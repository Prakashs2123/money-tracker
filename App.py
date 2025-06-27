import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from pymongo import DESCENDING


app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client["moneytracker"]
users_collection = db["users"]
transactions = db['transactions']   

# Email must end with @gmail.com and follow valid format
EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9_.+-]+@gmail\.com$')

# Password must be 8+ characters with at least one special character
PASSWORD_REGEX = re.compile(r'^(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$')

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirmPassword')

    if not email or not password or not confirm_password:
        return jsonify({'error': 'All fields are required'}), 400

    if not EMAIL_REGEX.match(email):
        return jsonify({'error': 'Email must be a valid Gmail address'}), 400

    if not PASSWORD_REGEX.match(password):
        return jsonify({'error': 'Password must be at least 8 characters long and include a special character'}), 400

    if password != confirm_password:
        return jsonify({'error': 'Passwords do not match'}), 400

    if users_collection.find_one({'email': email}):
        return jsonify({'error': 'Email already registered'}), 409

    users_collection.insert_one({
        'email': email,
        'password': password  
    })

    return jsonify({'message': 'Signup successful'}), 201

print('success Done')

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    print("Login attempt:")
    print("Email from frontend:", email)
    print("Password from frontend:", password)

    user = users_collection.find_one({"email": email})
    print("User from DB:", user)

    if user and user['password'] == password:
        print(" Password matched")
        return jsonify({"message": "Login successful"}), 200
    else:
        print(" Invalid login")
        return jsonify({"error": "Invalid email or password"}), 401
    



@app.route('/api/summary', methods=['GET'])
def get_summary():
    income = transactions.find({'type': 'income'})
    expense = transactions.find({'type': 'expense'})

    total_income = sum(int(t['amount']) for t in income)
    total_expense = sum(int(t['amount']) for t in expense)
    balance = total_income - total_expense

    return jsonify({
        'income': total_income,
        'expense': total_expense,
        'balance': balance
    })

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    txn_type = request.args.get('type')  
    query = {'type': txn_type} if txn_type else {}
    txn_list = list(transactions.find(query).sort('date', -1))

    # Convert ObjectId to string
    for txn in txn_list:
        txn['_id'] = str(txn['_id'])

    return jsonify(txn_list)

@app.route('/api/transactions', methods=['POST'])
def add_transaction():
    data = request.get_json()
    transactions.insert_one(data)
    return jsonify({'message': 'Transaction added'}), 201


# Example Flask route
@app.route('/api/transactions/<string:id>', methods=['DELETE'])
def delete_transaction(id):
    db.transactions.delete_one({'_id': ObjectId(id)})
    return jsonify({'message': 'Transaction deleted'})


@app.route('/api/transactions/latest', methods=['GET'])
def get_latest_transactions():
    latest = list(transactions.find().sort('_id', DESCENDING).limit(5))
    for item in latest:
        item['_id'] = str(item['_id'])
    return jsonify(latest)


if __name__ == '__main__':
    app.run(debug=True)
