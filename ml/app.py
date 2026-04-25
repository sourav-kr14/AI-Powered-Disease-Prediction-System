import pickle
import numpy as np
import pandas as pd
import os
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

base = os.path.dirname(__file__)

# Load models
rfc = pickle.load(open(os.path.join(base, "rfc.pkl"), "rb"))
svm = pickle.load(open(os.path.join(base, "svm.pkl"), "rb"))
naive_bayes = pickle.load(open(os.path.join(base, "nb.pkl"), "rb"))
encoder = pickle.load(open(os.path.join(base, "encoder.pkl"), "rb"))

# Load precautions dataset
precaution_df = pd.read_csv(os.path.join(base, "Disease precaution.csv"))

# Symptoms list
symptoms_list = [
    'fever', 'headache', 'nausea', 'vomiting', 'fatigue', 'joint_pain',
    'skin_rash', 'cough', 'weight_loss', 'yellow_eyes'
]

symptom_index = {symptom: idx for idx, symptom in enumerate(symptoms_list)}

# Request model
class PredictRequest(BaseModel):
    symptoms: list[str]

# Health check
@app.get("/")
def health():
    return {"status": "API running"}

#  Get precautions
def get_precautions(disease):
    row = precaution_df[precaution_df["Disease"].str.lower() == disease.lower()]

    if row.empty:
        return []

    return row.iloc[0].drop("Disease").dropna().tolist()

#  Prediction API
@app.post("/predict")
def predict(data: PredictRequest):

    symptoms_split = [s.strip().lower() for s in data.symptoms if s.strip()]

    if not symptoms_split:
        return {"error": "No valid symptoms provided"}

    input_vector = [0] * len(symptom_index)

    for symptom in symptoms_split:
        if symptom in symptom_index:
            input_vector[symptom_index[symptom]] = 1

    input_df = pd.DataFrame([input_vector], columns=symptoms_list)

    try:
        # Model probabilities
        rfc_prob = rfc.predict_proba(input_df)[0]
        nb_prob = naive_bayes.predict_proba(input_df)[0]

        try:
            svm_prob = svm.predict_proba(input_df)[0] if hasattr(svm, "predict_proba") else np.zeros_like(rfc_prob)
        except:
            svm_prob = np.zeros_like(rfc_prob)

        # Ensemble average
        avg_prob = (rfc_prob + nb_prob + svm_prob) / 3

        # Top 3 predictions
        top3_idx = np.argsort(avg_prob)[::-1][:3]

        top3 = []
        for idx in top3_idx:
            disease = encoder.classes_[idx]
            confidence = round(float(avg_prob[idx]), 4)

            top3.append({
                "disease": disease,
                "confidence": confidence
            })

        #  Get precautions
        precautions = {}
        for item in top3:
            precautions[item["disease"]] = get_precautions(item["disease"])

        return {
            "prediction": top3[0]["disease"],
            "top3": top3,
            "precautions": precautions,
            "note": "This is an AI-based prediction. Please consult a doctor."
        }

    except Exception as e:
        return {"error": str(e)}