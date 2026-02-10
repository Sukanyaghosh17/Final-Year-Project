# Testing & Running the Project

This guide explains how to set up, run, and test the FIR Automation project.

## Prerequisites

- **Python 3.8+**
- **Node.js 16+** & **npm**
- **MongoDB** (running locally or via Atlas)

## 1. Backend Setup

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Create a virtual environment:
    ```bash
    python -m venv venv
    ```
3.  Activate the virtual environment:
    - **Windows:** `venv\Scripts\activate`
    - **Mac/Linux:** `source venv/bin/activate`
4.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
5.  **Configuration**:
    - Copy `.env.example` to `.env`:
      ```bash
      cp .env.example .env
      # Windows command prompt: copy .env.example .env
      ```
    - Edit `.env` and set your `MONGO_URI` if different from localhost.

6.  **Run the Server**:
    ```bash
    python app.py
    ```
    The server should start on `http://localhost:5000`.

## 2. Frontend Setup

1.  Open a new terminal and navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    The app should be running at `http://localhost:5173` (or similar).

## 3. Running Tests

### Automated API Tests

We have a script to test the backend APIs automatically.

1.  Ensure the **Backend is running**.
2.  From the project root (or `scripts` folder), run:

    ```bash
    python scripts/test_api.py
    ```

    _Note: You might need to install `requests` if not in your global python, or run it using the backend venv._

    ```bash
    # Example using backend venv from root
    .\backend\venv\Scripts\python scripts/test_api.py
    ```

### Manual Testing

1.  Open the Frontend URL in your browser.
2.  **Register** a new user.
3.  **Login** with that user.
4.  Navigate to the **Dashboard**.
5.  Try submitting an FIR.

## Troubleshooting

- **Backend fails to start**: Check if MongoDB is running. Check if dependencies are installed.
- **Frontend can't connect**: Ensure Backend is running on port 5000.
