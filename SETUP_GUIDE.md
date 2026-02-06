# VantageRisk AI - Setup & Deployment Guide

This guide provides step-by-step instructions for setting up the **VantageRisk AI** micro-lending platform on a new machine. This covers both the Python backend (inference engine) and the Next.js frontend (user interface).

## Prerequisites

Before starting, ensure the machine has the following installed:

1.  **Node.js & npm** (Frontend runtime)
    *   Download: [https://nodejs.org/](https://nodejs.org/)
    *   Verify: `node -v` (Should be v18+), `npm -v`

2.  **Python** (Backend runtime)
    *   Download: [https://www.python.org/](https://www.python.org/)
    *   Verify: `python --version` (Should be v3.9+)

---

## 1. Backend Setup (Inference Engine)

The backend runs on FastAPI and handles risk scoring, utility calculations, and database operations.

### Steps:

1.  Navigate into the `backend` folder:
    ```bash
    cd backend
    ```

2.  (Optional but Recommended) Create a virtual environment to isolate dependencies:
    ```bash
    python -m venv venv
    
    # Activate on Windows:
    .\venv\Scripts\activate
    
    # Activate on Mac/Linux:
    source venv/bin/activate
    ```

3.  Install the required Python libraries:
    ```bash
    pip install -r requirements.txt
    ```

4.  Start the Backend Server:
    ```bash
    uvicorn main:app --reload
    ```
    *   The server will start at `http://localhost:8000`.
    *   API Documentation is available at `http://localhost:8000/docs`.

---

## 2. Frontend Setup (User Interface)

The frontend is a modern Next.js web application.

### Steps:

1.  Open a new terminal window.

2.  Navigate into the `frontend` folder:
    ```bash
    cd frontend
    ```

3.  Install the Node.js dependencies:
    ```bash
    npm install
    # OR if you prefer pnpm (faster):
    # npm install -g pnpm
    # pnpm install
    ```

4.  Start the Development Server:
    ```bash
    npm run dev
    ```

5.  Access the Application:
    *   Open your web browser and go to: `http://localhost:3000`

---

## Troubleshooting

### Common Issues

*   **"Port already in use"**:
    *   If port 8000 or 3000 is taken, close other conflicting applications or change the port in the start commands (e.g., `uvicorn main:app --port 8001`).

*   **Backend Connection Failed**:
    *   Ensure the backend terminal is running and shows "Application startup complete".
    *   The frontend expects the backend at `http://localhost:8000`. If you changed the port, update the API URLs in the frontend code.

*   **Missing Dependencies**:
    *   If you see "Module not found", double-check that you ran `pip install -r requirements.txt` (backend) or `npm install` (frontend) successfully.

---

## Project Structure Overview

*   **`/backend`**: Contains the FastAPI server, machine learning models (`.pkl`), and SQLite database (`lending.db`).
*   **`/frontend`**: Contains the Next.js React application, UI components, and pages.

## Deployment Notes

For a production environment, you would typically:
*   Build the frontend using `npm run build` and serve it with `npm start`.
*   Run the backend using a production server like Gunicorn behind Nginx.
