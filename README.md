## 🧠 AI-Powered-Disease-Prediction-System
A machine-learning based web application that predicts diseases from user-provided symptoms and suggests nearby hospitals using Google Places API.

---

## 🚀 Features

- AI/ML Prediction: Uses a trained Python model to predict possible diseases.
- User-Friendly Interface: React.js frontend with responsive design.
- Node.js/Express Backend: Connects React UI with Python ML script.
- Hospital Recommendations: Integrated Google Places API for nearest hospital lookup.
- Chatbot Module: Guides users through symptom input and improves user flow.
- Secure & Scalable: Clean API structure with environment variable protection.
 ---
### 🏗️ Tech Stack
## Frontend
- React.js
- Tailwind CSS / CSS Modules
- Axios
  
## Backend
- Node.js
- Express.js
- Python Shell 

## 🧠 Machine Learning Implementation

### 🛠 Model Pipeline
The system utilizes a **Supervised Learning** approach to classify 40+ diseases based on 130+ unique symptoms.

1. **Preprocessing:** Raw user input is mapped to a binary feature vector using a symptom-index dictionary.
2. **Algorithm:** A **Random Forest Classifier** was selected due to its robustness against noise and ability to handle the non-linear relationship between symptoms.
3. **Serialization:** The trained model is exported using `pickle` for real-time inference via the Node.js `child_process`.

> **Note:** The model currently achieves high accuracy on the validation set but is intended for educational and preliminary screening purposes only.
  
## APIs
- Google Places API
- Custom ML Prediction API
 ---
## 📁 Project Structure
``` bash
root/
│── client/                
│   ├── src/
│   └── components/
│
│── server/               
│   ├── routes/
│   ├── controllers/
│   ├── config/
│   └── app.js
│
│── ml/                    
│   ├── predict.py
│   ├── model.pkl
│
│── README.md
│── package.json
│── requirements.txt
```
 ---
## ⚙️ Installation & Setup
1️⃣ Clone the repository
```bash
git clone https://github.com/sourav-kr14/AI-Powered-Disease-Prediction-System
cd disease-predictor
```

2️⃣ Install Python dependencies
```bash
- pip install -r requirements.txt
```

3️⃣ Install Node.js dependencies
```bash
cd server
npm install
```
4️⃣ Add environment variables
```bash
 Create a .env inside server/.
 PORT=5000
 GOOGLE_MAPS_API_KEY=your_api_key
```
5️⃣ Start the backend server
```bash
npm run dev
```
6️⃣ Start the frontend
```bash
cd client
npm run dev
```
 ---
## 🔥 How It Works
- User enters symptoms
- React sends symptoms → Node.js API
- Node triggers Python ML script
- Python loads the model and returns predicted diseases
- Node API returns prediction to React
- Google Places API fetches nearby hospitals
- Chatbot helps users step-by-step
 ---
## 🎯 Future Enhancements
- Add voice-based symptom input
- Add doctor appointment booking
- Add real-time chat with healthcare assistant
 ---
## 🤝 Contributing
- Pull requests are welcome. For major changes, open an issue first to discuss.
 ---
## 📜 License
- This project is licensed under the MIT License.
