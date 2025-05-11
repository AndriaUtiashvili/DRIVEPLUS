from flask import Flask, jsonify, request, session
from flask_cors import CORS
from database import drive_plus_db, State, Vehicle, Trip, User, db
from datetime import datetime
import secrets

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = secrets.token_hex(16)  # For session management

CORS(app, origins=["http://localhost:3000", "http://127.0.0.1:3000"], supports_credentials=True)

drive_plus_db(app)

# Create initial user
with app.app_context():
    if not User.query.filter_by(email='andria@mail.com').first():
        user = User(
            first_name='Andria',
            last_name='User',
            email='andria@mail.com'
        )
        user.set_password('pass@123')
        db.session.add(user)
        db.session.commit()

@app.route("/auth/register", methods=["POST"])
def register():
    data = request.get_json()
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({"error": "Email already registered"}), 400
    
    new_user = User(
        first_name=data['firstName'],
        last_name=data['lastName'],
        email=data['email']
    )
    new_user.set_password(data['password'])
    
    db.session.add(new_user)
    db.session.commit()
    
    session['user_id'] = new_user.id
    
    return jsonify({
        "id": new_user.id,
        "firstName": new_user.first_name,
        "lastName": new_user.last_name,
        "email": new_user.email
    }), 201

@app.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({"error": "Invalid email or password"}), 401
    
    session['user_id'] = user.id
    
    return jsonify({
        "id": user.id,
        "firstName": user.first_name,
        "lastName": user.last_name,
        "email": user.email
    })

@app.route("/auth/currentuser", methods=["GET"])
def get_current_user():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({
        "id": user.id,
        "firstName": user.first_name,
        "lastName": user.last_name,
        "email": user.email
    })

@app.route("/auth/logout", methods=["POST"])
def logout():
    session.pop('user_id', None)
    return jsonify({"message": "Logged out successfully"})

@app.route("/states", methods=["GET"])
def get_states():
    states = State.query.all()
    return jsonify([{"id": state.id, "state": state.state, "state_short": state.state_short} for state in states])

@app.route("/vehicles", methods=["GET"])
def get_vehicles():
    vehicles = Vehicle.query.all()
    return jsonify([{"id": vehicle.id, "name": vehicle.name, "weight": vehicle.weight} for vehicle in vehicles])

@app.route("/trips", methods=["GET"])
def get_trips():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    pickup_subq = db.session.query(
        State.id, 
        State.state.label("pickup_state_full"),
        State.state_short.label("pickup_name")
    ).subquery()
    
    dropoff_subq = db.session.query(
        State.id, 
        State.state.label("dropoff_state_full"),
        State.state_short.label("dropoff_name")
    ).subquery()
    
    vehicle_subq = db.session.query(
        Vehicle.id, 
        Vehicle.name.label("vehicle_name")
    ).subquery()

    results = db.session.query(
        Trip,
        pickup_subq.c.pickup_name,
        pickup_subq.c.pickup_state_full,
        dropoff_subq.c.dropoff_name,
        dropoff_subq.c.dropoff_state_full,
        vehicle_subq.c.vehicle_name,
        vehicle_subq.c.id.label("vehicle_id")
    ).outerjoin(
        pickup_subq, Trip.pickupStateId == pickup_subq.c.id
    ).outerjoin(
        vehicle_subq, Trip.vehicleId == vehicle_subq.c.id
    ).outerjoin(
        dropoff_subq, Trip.dropoffStateId == dropoff_subq.c.id
    ).filter(Trip.user_id == user_id).all()

    trips = []
    for trip, pickup_short, pickup_full, dropoff_short, dropoff_full, vehicle_name, vehicle_id in results:
        trips.append({
            "id": trip.id,
            "date": trip.date.isoformat(),
            "pickupStateId": trip.pickupStateId,
            "pickupStateName": pickup_short,
            "pickupStateFull": pickup_full,
            "dropoffStateId": trip.dropoffStateId,
            "dropoffStateName": dropoff_short,
            "dropoffStateFull": dropoff_full,
            "vehicleId": vehicle_id,
            "vehicle": vehicle_name,
            "mileage": trip.mileage,
            "fuelprice": trip.fuelprice,
            "amount": trip.amount,
            "profit": trip.profit
        })

    return jsonify(trips)

@app.route("/trips", methods=["POST"])
def create_trip():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    data = request.get_json()
    dateParsed = datetime.strptime(data['date'], "%Y-%m-%d").date()

    json_data = {
    "vehicle_id": data['vehicleId'], 
    "mileage": data['mileage'],
    "amount": data['amount'],
    "fuel_cost": data["fuelprice"]
    }

    profit = calculateProfit(json_data)

    new_trip = Trip(
        user_id=user_id,
        date=dateParsed,
        pickupStateId=data['pickupStateId'],
        dropoffStateId=data['dropoffStateId'],
        vehicleId=data['vehicleId'],
        mileage=data['mileage'],
        amount=data['amount'],
        fuelprice=data["fuelprice"],
        profit=profit
    )
    db.session.add(new_trip)
    db.session.commit()

    pickup_state = State.query.get(new_trip.pickupStateId)
    dropoff_state = State.query.get(new_trip.dropoffStateId)
    vehicle = Vehicle.query.get(new_trip.vehicleId)

    return jsonify({
        "id": new_trip.id,
        "date": new_trip.date.isoformat(),
        "pickupStateId": new_trip.pickupStateId,
        "pickupStateName": pickup_state.state_short,
        "pickupStateFull": pickup_state.state,
        "dropoffStateId": new_trip.dropoffStateId,
        "dropoffStateName": dropoff_state.state_short,
        "dropoffStateFull": dropoff_state.state,
        "vehicleId": new_trip.vehicleId,
        "vehicle": vehicle.name,
        "mileage": new_trip.mileage,
        "fuelprice": new_trip.fuelprice,
        "amount": new_trip.amount,
        "profit": new_trip.profit
    }), 201

@app.route("/trips/<int:trip_id>", methods=["PUT"])
def update_trip(trip_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()
    if not trip:
        return jsonify({"error": "Trip not found"}), 404
    
    data = request.get_json()
    
    if 'date' in data:
        trip.date = datetime.strptime(data['date'], "%Y-%m-%d").date()
    if 'pickupStateId' in data:
        trip.pickupStateId = data['pickupStateId']
    if 'dropoffStateId' in data:
        trip.dropoffStateId = data['dropoffStateId']
    if 'vehicleId' in data:
        trip.vehicleId = data['vehicleId']
    if 'mileage' in data:
        trip.mileage = data['mileage']
    if 'fuelprice' in data:
        trip.fuelprice = data['fuelprice']
    if 'amount' in data:
        trip.amount = data['amount']

    json_data = {
        "vehicle_id": trip.vehicleId, 
        "mileage": trip.mileage,
        "amount": trip.amount,
        "fuel_cost": trip.fuelprice
         }
    
    trip.profit = calculateProfit(json_data)
    
    db.session.commit()

    pickup_state = State.query.get(trip.pickupStateId)
    dropoff_state = State.query.get(trip.dropoffStateId)
    vehicle = Vehicle.query.get(trip.vehicleId)
    
    return jsonify({
        "id": trip.id,
        "date": trip.date.isoformat(),
        "pickupStateId": trip.pickupStateId,
        "pickupStateName": pickup_state.state_short,
        "pickupStateFull": pickup_state.state,
        "dropoffStateId": trip.dropoffStateId,
        "dropoffStateName": dropoff_state.state_short,
        "dropoffStateFull": dropoff_state.state,
        "vehicleId": trip.vehicleId,
        "vehicle": vehicle.name,
        "mileage": trip.mileage,
        "fuelprice": trip.fuelprice,
        "amount": trip.amount,
        "profit": trip.profit
    })

@app.route("/trips/<int:trip_id>", methods=["DELETE"])
def delete_trip(trip_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401

    trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first()
    if not trip:
        return jsonify({"error": "Trip not found"}), 404
    
    db.session.delete(trip)
    db.session.commit()
    
    return jsonify({"message": "Trip deleted successfully"}), 200

@app.route("/trips/calculate", methods=['POST'])
def calculate():
    data = request.get_json()
    profit = calculateProfit(data)
    return jsonify({"profit": profit})


def calculateProfit(data):

    vehicleid = data['vehicle_id']
    mileage = data['mileage']
    amount = data['amount']
    fuel_cost = data['fuel_cost']


    vehicle = Vehicle.query.filter_by(id=vehicleid).first()
    print(vehicleid)
    base_fuel_consumption = 0.05
    towing_weight_max = 10000
    weight = vehicle.weight + 2000
    penalty_factor = 0.75

    

    final_fuel_consumption = base_fuel_consumption * (1 + weight/towing_weight_max * penalty_factor)

    profit = float(amount) - float(final_fuel_consumption) * float(mileage) * float(fuel_cost)

    return profit

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
        