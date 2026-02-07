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

rfc = pickle.load(open(os.path.join(base, "rfc.pkl"), "rb"))
svm = pickle.load(open(os.path.join(base, "svm.pkl"), "rb"))
naive_bayes = pickle.load(open(os.path.join(base, "nb.pkl"), "rb"))
encoder = pickle.load(open(os.path.join(base, "encoder.pkl"), "rb"))


symptoms_list = [
    'fever', 'headache', 'nausea', 'vomiting', 'fatigue', 'joint_pain',
    'skin_rash', 'cough', 'weight_loss', 'yellow_eyes'
]

symptom_index = {symptom: idx for idx, symptom in enumerate(symptoms_list)}


class PredictRequest(BaseModel):
    symptoms:List[str]


@app.get("/")
def health():
    return {"status": "API running"}

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
        rfc_prob = rfc.predict_proba(input_df)[0]
        nb_prob = naive_bayes.predict_proba(input_df)[0]

        try:
            known = hasattr(svm, "predict_proba")
            svm_prob = svm.predict_proba(input_df)[0] if known else np.zeros_like(rfc_prob)
        except:
            svm_prob = np.zeros_like(rfc_prob)

        avg_prob = (rfc_prob + nb_prob + svm_prob) / 3
        top3_idx = np.argsort(avg_prob)[::-1][:3]

        top3 = []
        for idx in top3_idx:
            disease = encoder.classes_[idx]   # ✅ FIXED
            confidence = round(float(avg_prob[idx]), 4)
            top3.append({
                "disease": disease,
                "confidence": confidence
            })

        return {
            "prediction": top3[0]["disease"],
            "top3": top3
        }

    except Exception as e:
        return {"error": str(e)}
