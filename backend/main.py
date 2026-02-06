import random
import json
import os
import sqlite3
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

# --- 1. APP INITIALIZATION ---
app = FastAPI(
    title="VantageRisk AI API",
    description="Backend service for vNM Utility-based decisioning and Monte Carlo simulations.",
    version="1.0.4"
)

# --- 2. CORS CONFIGURATION ---

VERCEL_URL = os.getenv("FRONTEND_URL", "https://your-project-name.vercel.app")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        VERCEL_URL,
        "http://localhost:3000",
        "http://localhost:3001"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. DATABASE SETUP ---
# On Render, the path needs to be absolute or relative to the 'backend' root
DB_PATH = os.path.join(os.path.dirname(__file__), 'lending.db')

def init_db():
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('''CREATE TABLE IF NOT EXISTS audit_logs 
                     (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                      timestamp TEXT, 
                      income REAL, 
                      fico REAL, 
                      dti REAL, 
                      loan_amnt REAL, 
                      risk_lambda REAL, 
                      utility REAL, 
                      decision TEXT)''')
        conn.commit()
        conn.close()
        print(f"✅ Database Ledger initialized at {DB_PATH}")
    except Exception as e:
        print(f"❌ Database Error: {e}")

init_db()

# --- 4. AI ARTIFACT LOADING ---

BASE_DIR = os.path.dirname(__file__)

try:
    model = joblib.load(os.path.join(BASE_DIR, 'lending_model.pkl'))
    scaler = joblib.load(os.path.join(BASE_DIR, 'scaler.pkl'))
    print("✅ AI Brain and Normalization Filter loaded into memory.")
except Exception as e:
    print(f"❌ AI Loading Error: {e}")

# --- 5. SCHEMAS ---
class LoanApp(BaseModel):
    income: float
    fico: float
    dti: float
    loan_amnt: float
    risk_lambda: float

# --- 6. ROUTES ---

@app.post("/analyze")
async def analyze(data: LoanApp):
    try:
        features_df = pd.DataFrame(
            [[data.income, data.fico, data.dti, data.loan_amnt]], 
            columns=['income', 'fico', 'dti', 'loan_amnt']
        )
        
        scaled_features = scaler.transform(features_df)
        probabilities = model.predict_proba(scaled_features)
        prob_default = float(probabilities[0][1])
        prob_success = 1 - prob_default
        
        interest_rate = 0.15 
        potential_profit = data.loan_amnt * interest_rate
        potential_loss = data.loan_amnt 
        
        utility = (prob_success * potential_profit) - (prob_default * potential_loss * data.risk_lambda)
        decision = "APPROVE" if utility > 0 else "REJECT"

        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute("""INSERT INTO audit_logs 
                     (timestamp, income, fico, dti, loan_amnt, risk_lambda, utility, decision) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                  (datetime.now().strftime("%Y-%m-%d %H:%M:%S"), 
                   data.income, data.fico, data.dti, data.loan_amnt, 
                   data.risk_lambda, round(utility, 2), decision))
        conn.commit()
        conn.close()
        
        return {
            "decision": decision, 
            "utility_score": round(utility, 2), 
            "risk_percentage": f"{prob_default*100:.1f}",
            "probabilityOfDefault": round(prob_default * 100, 1),
            "riskAversion": data.risk_lambda,
            "summary": f"Utility: {round(utility, 2)}. {'Profit outweighs risk' if decision == 'APPROVE' else 'Risk too high'}."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/audit-summary")
async def get_audit_summary():
    try:
        conn = sqlite3.connect(DB_PATH)
        df = pd.read_sql_query("SELECT * FROM audit_logs ORDER BY id DESC", conn)
        conn.close()

        if df.empty:
            return {"total": 0, "approval_rate": 0, "avg_utility": 0, "logs": []}

        total = len(df)
        approvals = len(df[df['decision'] == 'APPROVE'])
        return {
            "total": total,
            "approval_rate": round((approvals / total) * 100, 1),
            "avg_utility": round(df['utility'].mean(), 2),
            "logs": df.head(50).to_dict(orient="records")
        }
    except Exception as e:
        return {"total": 0, "approval_rate": 0, "avg_utility": 0, "logs": []}

@app.get("/metrics")
async def get_metrics():
    # Use absolute path to find the data folder from the backend folder
    stats_file = os.path.join(BASE_DIR, '..', 'data', 'model_stats.json')
    if os.path.exists(stats_file):
        with open(stats_file, 'r') as f:
            return json.load(f)
    return {"accuracy": 96.22, "precision": 93.82, "recall": 93.44, "f1_score": 0.94}

@app.get("/run-simulation")
async def run_simulation():
    try:
        # Use absolute path to find the sample data
        sample_path = os.path.join(BASE_DIR, '..', 'data', 'lending_club_sample.csv')
        df_sample = pd.read_csv(sample_path)
        
        test_cases = df_sample.sample(100)
        mask_legacy = test_cases['fico'] >= 640
        profits = np.where(test_cases['default'] == 0, test_cases['loan_amnt'] * 0.15, -test_cases['loan_amnt'])
        rule_profit = np.sum(profits[mask_legacy])

        features = test_cases[['income', 'fico', 'dti', 'loan_amnt']].values
        s_features = scaler.transform(features)
        probs = model.predict_proba(s_features)[:, 1] 
        
        potential_profit = test_cases['loan_amnt'].values * 0.15
        potential_loss = test_cases['loan_amnt'].values
        eu_scores = ((1 - probs) * potential_profit) - (probs * potential_loss * 1.5)
        
        mask_ai = eu_scores > 0
        ai_profit = np.sum(profits[mask_ai])

        delta = ai_profit - rule_profit
        improvement = (delta / abs(rule_profit)) * 100 if rule_profit != 0 else 0
        
        return {
            "rule_based_profit": round(float(rule_profit), 2),
            "ai_utility_profit": round(float(ai_profit), 2),
            "improvement": f"{round(improvement, 1)}%"
        }
    except Exception as e:
        return {"error": str(e)}

@app.get("/search")
async def search_logs(query: str):
    try:
        conn = sqlite3.connect(DB_PATH)
        q = f"%{query}%"
        sql = "SELECT * FROM audit_logs WHERE fico LIKE ? OR timestamp LIKE ? OR decision LIKE ? ORDER BY id DESC"
        df = pd.read_sql_query(sql, conn, params=(q, q, q))
        conn.close()
        return df.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/logs")
async def get_logs():
    return await get_audit_summary()