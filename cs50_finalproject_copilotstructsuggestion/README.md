# cs50_finalproject

## Project Overview
This project is a Flask web application designed for the CS50 final project. It serves as a backend API and includes various features and functionalities.

## Folder Structure
```
cs50_finalproject
├── backend
│   ├── app.py
│   ├── config.py
│   ├── routes
│   │   ├── __init__.py
│   │   └── api.py
│   ├── models
│   │   └── __init__.py
│   ├── templates
│   │   └── base.html
│   ├── static
│   │   ├── css
│   │   └── js
│   └── requirements.txt
├── tests
│   └── test_app.py
├── .env.example
├── .gitignore
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd cs50_finalproject
   ```
3. Create a virtual environment:
   ```
   python3 -m venv venv
   ```
4. Activate the virtual environment:
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```
   - On Windows:
     ```
     venv\Scripts\activate
     ```
5. Install the required dependencies:
   ```
   pip install -r backend/requirements.txt
   ```

## Usage
To run the application, execute the following command:
```
python backend/app.py
```
The application will be accessible at `http://localhost:5000`.

## Testing
To run the tests, ensure the virtual environment is activated and execute:
```
pytest tests/test_app.py
```

## Environment Variables
Create a `.env` file in the root directory based on the `.env.example` template to set up your environment variables.

## License
This project is licensed under the MIT License.