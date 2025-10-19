# backend/helpers.py
from flask import session, redirect, url_for, flash
from functools import wraps
from .db_init import get_db_connection  # relative import


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if "user_id" not in session:
            flash("You must log in first!", "warning")
            return redirect(url_for("main.login"))
        return f(*args, **kwargs)
    return decorated_function


def get_portfolio(user_id):
    conn = get_db_connection()
    cash_row = conn.execute(
        "SELECT cash FROM users WHERE id = ?", (user_id,)
    ).fetchone()
    cash = cash_row["cash"] if cash_row else 0

    rows = conn.execute("""
        SELECT symbol, SUM(shares) AS total_shares
        FROM transactions
        WHERE user_id = ?
        GROUP BY symbol
        HAVING total_shares > 0
    """, (user_id,)).fetchall()

    portfolio = []
    total_value = 0
    for row in rows:
        symbol = row["symbol"]
        shares = row["total_shares"]
        current_price = 100.0
        total_stock_value = shares * current_price
        total_value += total_stock_value
        portfolio.append({
            "symbol": symbol,
            "shares": shares,
            "price": current_price,
            "total": total_stock_value
        })

    conn.close()
    return portfolio, cash, total_value + cash


def get_cashflow(user_id):
    # placeholder implementation
    return {"income": 0, "expenses": 0}


def get_networth(user_id):
    # placeholder implementation
    return {"networth": 0}
