import joblib
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

# ✅ Load model & encoder
model = joblib.load(os.path.join(base, "model.pkl"))
encoder = joblib.load(os.path.join(base, "label_encoder.pkl"))

# ✅ Load dataset to get correct features
df = pd.read_csv(os.path.join(base, "DiseaseAndSymptoms.csv"))

# ✅ Correct feature handling
feature_names = model.feature_names_in_
symptom_index = {s: i for i, s in enumerate(feature_names)}

# ✅ Load precautions
precaution_df = pd.read_csv(os.path.join(base, "Disease precaution.csv"))

class PredictRequest(BaseModel):
    symptoms: list[str]

@app.get("/")
def health():
    return {"status": "API running"}

def get_precautions(disease):
    row = precaution_df[precaution_df["Disease"].str.lower() == disease.lower()]
    if row.empty:
        return []
    return row.iloc[0].drop("Disease").dropna().tolist()

@app.get("/symptoms")
def get_symptoms():
    return list(feature_names)
    
@app.post("/predict")
def predict(data: PredictRequest):

    symptoms = [s.strip().lower() for s in data.symptoms if s.strip()]

    # ✅ Correct input vector size (131 features)
    input_vector = [0] * len(feature_names)

    for s in symptoms:
        if s in symptom_index:
            input_vector[symptom_index[s]] = 1

    input_array = np.array(input_vector).reshape(1, -1)

    # ✅ Predict
    probs = model.predict_proba(input_array)[0]

    top3_idx = np.argsort(probs)[::-1][:3]

    top3 = []
    for idx in top3_idx:
        disease = encoder.inverse_transform([idx])[0]
        confidence = float(probs[idx])
        top3.append({
            "disease": disease,
            "confidence": round(confidence, 4)
        })

    precautions = {
        item["disease"]: get_precautions(item["disease"])
        for item in top3
    }

    return {
        "prediction": top3[0]["disease"],
        "top3": top3,
        "precautions": precautions,
        "note": "This is an AI-based prediction. Please consult a doctor."
    }