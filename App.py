import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient, DESCENDING
from bson.objectid import ObjectId
from datetime import datetime
from dateutil.parser import parse  # Add this import at the top

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client["moneytracker"]
users_collection = db["users"]
transactions = db['transactions']

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9_.+-]+@gmail\.com$')
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

    users_collection.insert_one({ 'email': email, 'password': password })
    return jsonify({'message': 'Signup successful'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = users_collection.find_one({"email": email})

    if user and user['password'] == password:
        return jsonify({
            "message": "Login successful",
            "email": email
        })
    else:
        return jsonify({"error": "Invalid email or password"}), 401
    

for txn in transactions.find():
    if isinstance(txn.get("date"), str):
        try:
            date_obj = parse(txn["date"])
            transactions.update_one(
                {"_id": txn["_id"]},
                {"$set": {"date": date_obj}}
            )
            print(f" Updated: {txn['_id']}")
        except Exception as e:
            print(f" Failed: {txn['_id']} - {e}")    


@app.route('/api/summary')
def get_summary():
    email = request.args.get('email')
    if not email:
        return jsonify({'error': 'Email is required'}), 400

    now = datetime.now()
    first_day = now.replace(day=1)

    income = transactions.find({
        'email': email,
        'type': 'income',
        'date': {'$gte': first_day, '$lte': now}  # Use datetime here
    })

    expense = transactions.find({
        'email': email,
        'type': 'expense',
        'date': {'$gte': first_day, '$lte': now}
    })

    mincome = sum(int(i['amount']) for i in income)
    mexpense = sum(int(e['amount']) for e in expense)
    mbalance = mincome - mexpense

    all_income = transactions.find({'email': email, 'type': 'income'})
    all_expense = transactions.find({'email': email, 'type': 'expense'})
    overall_income = sum(int(i['amount']) for i in all_income)
    overall_expense = sum(int(e['amount']) for e in all_expense)
    overall_balance = overall_income - overall_expense

    return jsonify({
        "mincome": mincome,
        "mexpense": mexpense,
        "mbalance": mbalance,
        "overallincome": overall_income,
        "overallexpense": overall_expense,
        "overallbalance": overall_balance
    })

@app.route('/api/transactions/latest', methods=['GET'])
def get_latest_transactions():
    email = request.args.get('email')
    if not email:
        return jsonify({'error': 'Email required'}), 400

    latest = list(transactions.find({'email': email}).sort('_id', -1).limit(5))
    for txn in latest:
        txn['_id'] = str(txn['_id'])
        if isinstance(txn['date'], str):
            date_obj = datetime.fromisoformat(txn['date'].replace("Z", ""))
        else:
            date_obj = txn['date']
        txn['date'] = date_obj.strftime("%d %b %Y")  #  Final format  "2025-07-03"
        


    return jsonify(latest)

@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    txn_type = request.args.get('type')
    email = request.args.get('email')  #  add this

    query = {}
    if txn_type:
        query['type'] = txn_type
    if email:
        query['email'] = email

    txn_list = list(transactions.find(query).sort('date', -1))
    


    for txn in txn_list:
        txn['_id'] = str(txn['_id'])
        if isinstance(txn['date'], str):
            try:
                date_obj = datetime.fromisoformat(txn['date'].replace("Z", ""))
            except:
                date_obj = datetime.strptime(txn['date'], "%Y-%m-%d")
        else:
            date_obj = txn['date']

        txn['date'] = date_obj.strftime("%Y-%m-%d")

    return jsonify(txn_list)

@app.route('/api/transactions', methods=['POST'])
def add_transaction():
    data = request.get_json()

    if 'email' not in data:
        return jsonify({'error': 'Email is required'}), 400

    # Convert date string to datetime object
    if isinstance(data.get('date'), str):
        data['date'] = datetime.strptime(data['date'], "%Y-%m-%d")

    transactions.insert_one(data)
    return jsonify({'message': 'Transaction added'}), 201


@app.route('/api/transactions/<string:id>', methods=['DELETE'])
def delete_transaction(id):
    transactions.delete_one({'_id': ObjectId(id)})
    return jsonify({'message': 'Transaction deleted'})



@app.route('/api/transactions/<id>', methods=['PATCH'])
def update_transaction(id):
    data = request.get_json()

    try:
        parsed_date = parse(data['date'])  # This is datetime object
    except Exception:
        return jsonify({'error': 'Invalid date'}), 400

    result = transactions.update_one(
        {'_id': ObjectId(id)},
        {'$set': {
            'source': data['source'],
            'amount': data['amount'],
            'date': parsed_date,   #  Store as datetime, not string!
            'emoji': data.get('emoji', '💰'),
            'type': data['type']
        }}
    )

    if result.matched_count:
        return jsonify({'message': 'Transaction updated'}), 200
    else:
        return jsonify({'error': 'Transaction not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)
