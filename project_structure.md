# System Architecture & Project Structure

This document provides a comprehensive overview of the FIR Automation System's architecture, including the file structure, component responsibilities, and data flow key workflows.

## 📂 Project Structure

```text
/
├── backend/                 # Python Flask API & ML Logic
│   ├── model/               # Machine Learning Models & Assets
│   │   ├── crime_model.pkl  # Pre-trained Random Forest model
│   │   └── bns_assets.pkl   # Bharatiya Nyaya Sanhita data & embeddings
│   ├── routes/              # API Route Definitions
│   │   ├── auth_routes.py   # Login/Register endpoints
│   │   ├── fir_routes.py    # FIR submission & management
│   │   ├── police_routes.py # Police dashboard actions
│   │   └── ...
│   ├── app.py               # Main Flask Application Entrypoint
│   ├── config.py            # Configuration (DB URI, Model Paths, Secrets)
│   ├── db.py                # MongoDB Connection & Helper functions
│   ├── ml_service.py        # ML Inference Logic (Singleton Service)
│   ├── test_api.py          # API Testing Script
│   └── requirements.txt     # Python Dependencies
│
├── frontend/                # React.js + Vite Frontend
│   ├── src/                 # Source Code
│   │   ├── components/      # Reusable UI Components
│   │   ├── pages/           # Page Components (Home, Dashboard, Login)
│   │   ├── App.jsx          # Main App Component & Routing
│   │   └── main.jsx         # React Entrypoint
│   ├── public/              # Static Assets (images, icons)
│   ├── index.html           # HTML Entrypoint
│   └── vite.config.js       # Vite Build Configuration
│
├── scripts/                 # Utility Scripts for Development
│   ├── start_backend.bat    # One-click script to start Flask server
│   └── start_frontend.bat   # One-click script to start React app
│
├── docs/                    # Project Documentation
├── research/                # Experimental Notebooks & Data Analysis
├── .gitignore               # Git Ignore Rules
└── README.md                # Project Overview
```

## 🏗️ Component Responsibilities

### Backend (`/backend`)
The backend is built with **Flask** and serves as the central intelligence of the system.
- **`app.py`**: Initializes the Flask app, CORS, and registers blueprints (routes).
- **`ml_service.py`**: A singleton class that loads the ML models (`crime_model.pkl`) and BNS data (`bns_assets.pkl`) into memory once at startup to ensure fast inference.
- **`routes/`**: Contains the API logic.
    - **FIR Submission**: Receives user input, calls `ml_service` for BNS section prediction, and saves to MongoDB.
    - **Police Dashboard**: Fetches pending FIRs, updates status, and handles officer assignments.

### Frontend (`/frontend`)
The frontend is a modern Single Page Application (SPA) built with **React** and **Tailwind CSS**.
- **Role-Based Views**: Separate dashboards for Citizens (File FIR, View Status) and Police (Review FIRs, Update Status).
- **Interactive UI**: properties like crime mapping and real-time status updates.

### Database (MongoDB)
- **Collections**:
    - `users`: Stores citizen and police profiles.
    - `firs`: Stores FIR details, including status, predicted sections, and officer notes.

## 🔄 System Workflows

### 1. FIR Filing Workflow
1.  **User Action**: Citizen submits a complaint via the Frontend.
2.  **API Request**: Frontend sends `POST /api/fir` to Backend.
3.  **ML Processing**:
    - `ml_service.py` analyzes the complaint text.
    - Suggests applicable **BNS Sections** (e.g., "Theft", "Assault").
    - Predicts crime category.
4.  **Storage**: Backend saves the FIR + Predictions to MongoDB `firs` collection with status `Pending`.
5.  **Response**: Returns FIR ID to the user.

### 2. Police Review Workflow
1.  **User Action**: Police officer logs into the Dashboard.
2.  **Data Fetch**: Frontend requests `GET /api/fir/pending`.
3.  **Review**: Officer views the FIR, sees AI-suggested BNS sections.
4.  **Action**: Officer validates sections, adds notes, and updates status to `Approved` or `Investigating`.
5.  **Notification**: Backend triggers a notification for the Citizen.

## 🚀 How to Run
1.  **Start Database**: Ensure MongoDB is running locally.
2.  **Start Backend**: Double-click `scripts/start_backend.bat`.
3.  **Start Frontend**: Double-click `scripts/start_frontend.bat`.
