from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
import joblib
import numpy as np
from sklearn.preprocessing import LabelEncoder
import pickle

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.DEBUG)

try:
    with open('f1_q3_model.pkl', 'rb') as f:
        model = pickle.load(f)
    
    drivers = [
        "Max Verstappen", "Lewis Hamilton", "Charles Leclerc",
        "Sergio Perez", "Carlos Sainz", "Lando Norris",
        "George Russell", "Oscar Piastri", "Fernando Alonso",
        "Esteban Ocon", "Pierre Gasly", "Yuki Tsunoda",
        "Lance Stroll", "Alex Albon", "Logan Sargeant",
        "Kevin Magnussen", "Nico Hulkenberg", "Valtteri Bottas",
        "Zhou Guanyu", "Daniel Ricciardo"
    ]
    
    le = LabelEncoder()
    le.fit(drivers)
    
    logging.info("Model and drivers loaded successfully")
except Exception as e:
    logging.error(f"Failed to load model: {str(e)}")
    raise e

@app.route('/')
def home():
    return "F1 Prediction API is running!"

@app.route('/api/predict', methods=['POST'])
def predict_q3():
    try:
        data = request.json
        race = data.get('race')  

        if not race:
            return jsonify({'error': 'No race provided'}), 400

        q1_time = 90.0  
        q2_time = 88.5  
        
        features = np.array([[q1_time, q2_time]])
        
        if hasattr(model, 'predict_proba'):
            proba = model.predict_proba(features)[0]
            top_10_indices = np.argsort(proba)[-10:][::-1]
            predictions = [
                {
                    'position': i + 1,
                    'driver': le.inverse_transform([top_10_indices[i]])[0],
                    'probability': float(proba[top_10_indices[i]])
                }
                for i in range(10)
            ]
        else:
            # Fallback to simple prediction if no probability available
            pred = model.predict(features)
            predictions = [
                {'position': i + 1, 'driver': drivers[i], 'probability': (10 - i) / 10}
                for i in range(10)
            ]

        return jsonify({'predictions': predictions})

    except Exception as e:
        logging.error(f"Prediction error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/tracks', methods=['GET'])
def get_tracks():
    try:
        tracks = [
            {
                'name': 'Bahrain GP',
                'country': 'Bahrain',
                'length': 5.412,
                'corners': 15,
                'drsZones': 3,
                'lapRecord': {
                    'time': '1:31.447',
                    'driver': 'Pedro de la Rosa',
                    'year': 2005
                },
                'image': 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Bahrain_Circuit.png.transform/8col/image.png',
                'pastWinners': [
                    { 'year': 2024, 'winner': 'Max Verstappen', 'team': 'Red Bull Racing Honda RBPT', 'time': '1:31:44.742' },
                    { 'year': 2023, 'winner': 'Max Verstappen', 'team': 'Red Bull Racing Honda RBPT', 'time': '1:33:56.736' }
                ]
            },
            {
                'name': 'Saudi Arabian Grand Prix',
                'country': 'Saudi Arabia',
                'length': 6.174,
                'corners': 27,
                'drsZones': 3,
                'lapRecord': {
                    'time': '1:28.049',
                    'driver': 'Lewis Hamilton',
                    'year': 2021
                },
                'image': 'https://media.formula1.com/image/upload/f_auto,c_limit,w_1920,q_auto/content/dam/fom-website/2018-redesign-assets/Circuit%20maps%2016x9/Saudi_Arabia_Circuit.png.transform/8col/image.png',
                'pastWinners': [
                    { 'year': 2024, 'winner': 'Max Verstappen', 'team': 'Red Bull Racing Honda RBPT', 'time': '1:20:43.273' },
                    { 'year': 2023, 'winner': 'Sergio Perez', 'team': 'Red Bull Racing Honda RBPT', 'time': '1:21:14.894' }
                ]
            },
            # Add more tracks as needed...
        ]
        return jsonify(tracks)
    except Exception as e:
        logging.error(f"Error getting tracks: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)