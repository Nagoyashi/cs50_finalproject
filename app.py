from flask import Flask, render_template, request, redirect, url_for, session, flash, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import sqlite3
from datetime import datetime
import os

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')

DATABASE = 'wealth_tracker.db'

def get_db():
    """Connect to the database"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize the database with required tables"""
    conn = get_db()
    cursor = conn.cursor()
    
    # Users table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Transactions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            type TEXT NOT NULL,
            category TEXT NOT NULL,
            amount REAL NOT NULL,
            description TEXT,
            date DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()

def login_required(f):
    """Decorator to require login for routes"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'warning')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/')
def index():
    """Home page"""
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    return render_template('index.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    """User registration"""
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')
        confirm_password = request.form.get('confirm_password', '')
        
        # Validation
        if not username or not password:
            flash('Username and password are required.', 'error')
            return render_template('register.html')
        
        if len(username) < 3:
            flash('Username must be at least 3 characters long.', 'error')
            return render_template('register.html')
        
        if len(password) < 6:
            flash('Password must be at least 6 characters long.', 'error')
            return render_template('register.html')
        
        if password != confirm_password:
            flash('Passwords do not match.', 'error')
            return render_template('register.html')
        
        # Check if username already exists
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT id FROM users WHERE username = ?', (username,))
        if cursor.fetchone():
            flash('Username already exists.', 'error')
            conn.close()
            return render_template('register.html')
        
        # Create new user
        password_hash = generate_password_hash(password)
        cursor.execute('INSERT INTO users (username, password_hash) VALUES (?, ?)',
                      (username, password_hash))
        conn.commit()
        conn.close()
        
        flash('Registration successful! Please log in.', 'success')
        return redirect(url_for('login'))
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    """User login"""
    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')
        
        if not username or not password:
            flash('Username and password are required.', 'error')
            return render_template('login.html')
        
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('SELECT id, password_hash FROM users WHERE username = ?', (username,))
        user = cursor.fetchone()
        conn.close()
        
        if user and check_password_hash(user['password_hash'], password):
            session['user_id'] = user['id']
            session['username'] = username
            flash('Login successful!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid username or password.', 'error')
            return render_template('login.html')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    """User logout"""
    session.clear()
    flash('You have been logged out.', 'info')
    return redirect(url_for('index'))

@app.route('/dashboard')
@login_required
def dashboard():
    """Main dashboard showing wealth overview"""
    user_id = session['user_id']
    conn = get_db()
    cursor = conn.cursor()
    
    # Get total income and expenses
    cursor.execute('''
        SELECT 
            SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) as total_income,
            SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) as total_expense
        FROM transactions
        WHERE user_id = ?
    ''', (user_id,))
    
    totals = cursor.fetchone()
    total_income = totals['total_income'] or 0
    total_expense = totals['total_expense'] or 0
    net_worth = total_income - total_expense
    
    # Get recent transactions
    cursor.execute('''
        SELECT * FROM transactions
        WHERE user_id = ?
        ORDER BY date DESC, created_at DESC
        LIMIT 10
    ''', (user_id,))
    recent_transactions = cursor.fetchall()
    
    conn.close()
    
    return render_template('dashboard.html', 
                         total_income=total_income,
                         total_expense=total_expense,
                         net_worth=net_worth,
                         recent_transactions=recent_transactions)

@app.route('/transactions')
@login_required
def transactions():
    """View all transactions"""
    user_id = session['user_id']
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute('''
        SELECT * FROM transactions
        WHERE user_id = ?
        ORDER BY date DESC, created_at DESC
    ''', (user_id,))
    all_transactions = cursor.fetchall()
    
    conn.close()
    
    return render_template('transactions.html', transactions=all_transactions)

@app.route('/add_transaction', methods=['GET', 'POST'])
@login_required
def add_transaction():
    """Add a new transaction"""
    if request.method == 'POST':
        transaction_type = request.form.get('type')
        category = request.form.get('category', '').strip()
        amount = request.form.get('amount')
        description = request.form.get('description', '').strip()
        date = request.form.get('date')
        
        # Validation
        if not transaction_type or not category or not amount or not date:
            flash('All fields except description are required.', 'error')
            return render_template('add_transaction.html')
        
        try:
            amount = float(amount)
            if amount <= 0:
                flash('Amount must be greater than zero.', 'error')
                return render_template('add_transaction.html')
        except ValueError:
            flash('Invalid amount.', 'error')
            return render_template('add_transaction.html')
        
        # Insert transaction
        user_id = session['user_id']
        conn = get_db()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO transactions (user_id, type, category, amount, description, date)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (user_id, transaction_type, category, amount, description, date))
        conn.commit()
        conn.close()
        
        flash('Transaction added successfully!', 'success')
        return redirect(url_for('dashboard'))
    
    return render_template('add_transaction.html')

@app.route('/delete_transaction/<int:transaction_id>', methods=['POST'])
@login_required
def delete_transaction(transaction_id):
    """Delete a transaction"""
    user_id = session['user_id']
    conn = get_db()
    cursor = conn.cursor()
    
    # Verify the transaction belongs to the user
    cursor.execute('SELECT id FROM transactions WHERE id = ? AND user_id = ?', 
                  (transaction_id, user_id))
    if not cursor.fetchone():
        flash('Transaction not found.', 'error')
        conn.close()
        return redirect(url_for('transactions'))
    
    cursor.execute('DELETE FROM transactions WHERE id = ?', (transaction_id,))
    conn.commit()
    conn.close()
    
    flash('Transaction deleted successfully!', 'success')
    return redirect(url_for('transactions'))

@app.route('/api/chart_data')
@login_required
def chart_data():
    """API endpoint for chart data"""
    user_id = session['user_id']
    conn = get_db()
    cursor = conn.cursor()
    
    # Get data by category
    cursor.execute('''
        SELECT category, type, SUM(amount) as total
        FROM transactions
        WHERE user_id = ?
        GROUP BY category, type
        ORDER BY total DESC
    ''', (user_id,))
    
    category_data = cursor.fetchall()
    
    # Get data by month
    cursor.execute('''
        SELECT 
            strftime('%Y-%m', date) as month,
            type,
            SUM(amount) as total
        FROM transactions
        WHERE user_id = ?
        GROUP BY month, type
        ORDER BY month
    ''', (user_id,))
    
    monthly_data = cursor.fetchall()
    
    conn.close()
    
    return jsonify({
        'categories': [dict(row) for row in category_data],
        'monthly': [dict(row) for row in monthly_data]
    })

if __name__ == '__main__':
    init_db()
    app.run(debug=True)
