# DrivePlus: Profit Tracker for Truck Drivers

DrivePlus is a full-stack web application designed for car hauler drivers transporting Tesla vehicles across the U.S. It helps users log trips, calculate profits, and manage their work efficiently.

## Features

- User registration and login (drivers, dispatchers, carriers)  
- Add, view, edit, and delete trips  
- Real-time profit calculation based on fuel cost and vehicle weight  
- Select from all 51 U.S. states and preloaded Tesla vehicle models  
- Clean, user-friendly dashboard interface  
- Dockerized setup for frontend and backend  

## Tech Stack

- **Frontend:** React, Bootstrap
- **Backend:** Python, Flask, SQLAlchemy  
- **Database:** SQLite  
- **Deployment:** Docker, Docker Compose  

## Project Structure

```
drive-plus/         # React frontend  
drive-plus-api/     # Flask backend  
docker-compose.yaml # Docker orchestration  
```

## Getting Started

### Run with Docker

```
docker-compose up --build
```

Frontend: http://localhost:3000  
Backend: http://localhost:5000

### Run Without Docker

#### Backend

```
cd drive-plus-api  
pip install -r requirements.txt  
python app.py
```

#### Frontend

```
cd drive-plus  
npm install  
npm start
```

## Author

Andria Utiashvili  
San Diego State University  
CS 250 – Software Systems  
Instructor: Dr. Erekle Magradze
