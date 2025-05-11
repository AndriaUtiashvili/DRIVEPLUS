from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(256), nullable=False)
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def __repr__(self):
        return f'<User {self.id}: {self.email}>'

class Trip(db.Model):
    __tablename__ = 'trips'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    pickupStateId = db.Column(db.Integer, nullable=False)
    dropoffStateId = db.Column(db.Integer, nullable=False)
    vehicleId = db.Column(db.Integer, nullable=False)
    mileage = db.Column(db.Integer, nullable=False)
    fuelprice = db.Column(db.Float, nullable=False)
    amount = db.Column(db.Integer, nullable=False)
    profit = db.Column(db.Float, nullable=False)

    user = db.relationship('User', backref=db.backref('trips', lazy=True))

    def __repr__(self):
        return f'<Trip {self.id}>'

class Vehicle(db.Model):
    __tablename__ = 'vehicles'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    weight = db.Column(db.Integer, nullable=False)
    
    def __repr__(self):
        return f'<Vehicle {self.id}: {self.name}>'

class State(db.Model):
    __tablename__ = 'states'
    
    id = db.Column(db.Integer, primary_key=True)
    state = db.Column(db.String(100), nullable=False)
    state_short = db.Column(db.String(2), nullable=False)
    
    def __repr__(self):
        return f'<State {self.id}: {self.state} ({self.state_short})>'

def drive_plus_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()
        
        if State.query.count() == 0:
            states = [
                State(state="Alabama", state_short="AL"),
                State(state="Alaska", state_short="AK"),
                State(state="Arizona", state_short="AZ"),
                State(state="Arkansas", state_short="AR"),
                State(state="California", state_short="CA"),
                State(state="Colorado", state_short="CO"),
                State(state="Connecticut", state_short="CT"),
                State(state="Delaware", state_short="DE"),
                State(state="Florida", state_short="FL"),
                State(state="Georgia", state_short="GA"),
                State(state="Hawaii", state_short="HI"),
                State(state="Idaho", state_short="ID"),
                State(state="Illinois", state_short="IL"),
                State(state="Indiana", state_short="IN"),
                State(state="Iowa", state_short="IA"),
                State(state="Kansas", state_short="KS"),
                State(state="Kentucky", state_short="KY"),
                State(state="Louisiana", state_short="LA"),
                State(state="Maine", state_short="ME"),
                State(state="Maryland", state_short="MD"),
                State(state="Massachusetts", state_short="MA"),
                State(state="Michigan", state_short="MI"),
                State(state="Minnesota", state_short="MN"),
                State(state="Mississippi", state_short="MS"),
                State(state="Missouri", state_short="MO"),
                State(state="Montana", state_short="MT"),
                State(state="Nebraska", state_short="NE"),
                State(state="Nevada", state_short="NV"),
                State(state="New Hampshire", state_short="NH"),
                State(state="New Jersey", state_short="NJ"),
                State(state="New Mexico", state_short="NM"),
                State(state="New York", state_short="NY"),
                State(state="North Carolina", state_short="NC"),
                State(state="North Dakota", state_short="ND"),
                State(state="Ohio", state_short="OH"),
                State(state="Oklahoma", state_short="OK"),
                State(state="Oregon", state_short="OR"),
                State(state="Pennsylvania", state_short="PA"),
                State(state="Rhode Island", state_short="RI"),
                State(state="South Carolina", state_short="SC"),
                State(state="South Dakota", state_short="SD"),
                State(state="Tennessee", state_short="TN"),
                State(state="Texas", state_short="TX"),
                State(state="Utah", state_short="UT"),
                State(state="Vermont", state_short="VT"),
                State(state="Virginia", state_short="VA"),
                State(state="Washington", state_short="WA"),
                State(state="West Virginia", state_short="WV"),
                State(state="Wisconsin", state_short="WI"),
                State(state="Wyoming", state_short="WY")
            ]
            db.session.add_all(states)
            db.session.commit()
        
        # Add initial vehicles if they don't exist
        if Vehicle.query.count() == 0:
            vehicles = [
                Vehicle(name="2022 Tesla Model 3 RWD", weight=3554),
                Vehicle(name="2023 Tesla Model 3 RWD", weight=3554),
                Vehicle(name="2024 Tesla Model 3 RWD", weight=3554),
                Vehicle(name="2022 Tesla Model 3 Long Range", weight=3805),
                Vehicle(name="2023 Tesla Model 3 Long Range", weight=3805),
                Vehicle(name="2024 Tesla Model 3 Long Range", weight=3805),
                Vehicle(name="2022 Tesla Model 3 Performance", weight=3844),
                Vehicle(name="2023 Tesla Model 3 Performance", weight=3844),
                Vehicle(name="2024 Tesla Model 3 Performance", weight=3844),
                Vehicle(name="2024 Tesla Model 3 Highland", weight=3850),
                Vehicle(name="2022 Tesla Model Y RWD", weight=4012),
                Vehicle(name="2023 Tesla Model Y RWD", weight=4012),
                Vehicle(name="2024 Tesla Model Y RWD", weight=4012),
                Vehicle(name="2022 Tesla Model Y Long Range", weight=4416),
                Vehicle(name="2023 Tesla Model Y Long Range", weight=4416),
                Vehicle(name="2024 Tesla Model Y Long Range", weight=4416),
                Vehicle(name="2022 Tesla Model Y Performance", weight=4416),
                Vehicle(name="2023 Tesla Model Y Performance", weight=4416),
                Vehicle(name="2024 Tesla Model Y Performance", weight=4416),
                Vehicle(name="2022 Tesla Model S Long Range", weight=4561),
                Vehicle(name="2023 Tesla Model S Long Range", weight=4561),
                Vehicle(name="2024 Tesla Model S Long Range", weight=4561),
                Vehicle(name="2022 Tesla Model S Plaid", weight=4761),
                Vehicle(name="2023 Tesla Model S Plaid", weight=4761),
                Vehicle(name="2024 Tesla Model S Plaid", weight=4761),
                Vehicle(name="2022 Tesla Model X Long Range", weight=5185),
                Vehicle(name="2023 Tesla Model X Long Range", weight=5185),
                Vehicle(name="2024 Tesla Model X Long Range", weight=5185),
                Vehicle(name="2022 Tesla Model X Plaid", weight=5185),
                Vehicle(name="2023 Tesla Model X Plaid", weight=5185),
                Vehicle(name="2024 Tesla Model X Plaid", weight=5185),
                Vehicle(name="2024 Tesla Cybertruck RWD", weight=6000),
                Vehicle(name="2024 Tesla Cybertruck AWD", weight=6500),
                Vehicle(name="2024 Tesla Cybertruck Cyberbeast", weight=6700)
            ]
            db.session.add_all(vehicles)
            db.session.commit() 