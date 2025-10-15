# Wealth Tracker - CS50 Final Project

A simple and intuitive web application for personal wealth tracking, featuring user authentication and interactive data visualizations.

## Features

### 🔐 User Authentication
- Secure user registration with password hashing
- Login/logout functionality
- Session management

### 💰 Wealth Tracking
- Add income and expense transactions
- Categorize transactions (Salary, Food, Rent, Entertainment, etc.)
- View all transactions in a detailed table
- Delete transactions
- Track net worth in real-time

### 📊 Data Visualization
- Interactive bar chart showing income vs expenses by category
- Line chart displaying monthly income and expense trends
- Real-time dashboard with key financial metrics

### 🎨 User Interface
- Clean and modern responsive design
- Mobile-friendly layout
- Intuitive navigation
- Flash messages for user feedback

## Technologies Used

- **Backend**: Flask (Python)
- **Database**: SQLite3
- **Frontend**: HTML5, CSS3, JavaScript
- **Charts**: Chart.js
- **Security**: Werkzeug password hashing

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Nagoyashi/cs50_finalproject.git
cd cs50_finalproject
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Usage

1. Run the application:
```bash
python app.py
```

2. Open your web browser and navigate to:
```
http://localhost:5000
```

3. Register a new account or log in if you already have one

4. Start tracking your finances!

## Application Structure

```
cs50_finalproject/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── wealth_tracker.db      # SQLite database (auto-generated)
├── templates/             # HTML templates
│   ├── layout.html        # Base template
│   ├── index.html         # Landing page
│   ├── login.html         # Login page
│   ├── register.html      # Registration page
│   ├── dashboard.html     # Main dashboard
│   ├── transactions.html  # All transactions view
│   └── add_transaction.html # Add transaction form
└── static/                # Static files
    ├── css/
    │   └── style.css      # Stylesheet
    └── js/
        └── charts.js      # Chart rendering logic
```

## Database Schema

### Users Table
- `id`: Primary key
- `username`: Unique username
- `password_hash`: Hashed password
- `created_at`: Registration timestamp

### Transactions Table
- `id`: Primary key
- `user_id`: Foreign key to users
- `type`: Income or expense
- `category`: Transaction category
- `amount`: Transaction amount
- `description`: Optional description
- `date`: Transaction date
- `created_at`: Creation timestamp

## Security Features

- Passwords are hashed using Werkzeug's security functions
- Session-based authentication
- CSRF protection through Flask
- User data isolation (users can only see their own data)

## Future Enhancements

- Budget setting and tracking
- Recurring transactions
- Export data to CSV
- Multiple currency support
- Mobile app version
- Email notifications
- Advanced filtering and search

## License

This project is created as part of CS50's Final Project.

## Author

Created for CS50x - Harvard's Introduction to Computer Science

## Acknowledgments

- CS50 staff for the excellent course
- Flask documentation and community
- Chart.js for visualization library
