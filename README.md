
# Project Title

📌 Introduction
This project simulates the optimal race line for Formula 1 circuits using AI, physics-based modeling, and real-world data from Google Earth Studio. It merges geospatial mapping, race dynamics, and user-drawn circuit support to generate the fastest possible lap path.

🚀 Features
Physics-aware race line simulation engine

Apex detection and curvature optimization

Friction-mapped surfaces and grip zone adjustments

Fully supports real F1 tracks and hand-drawn/custom circuits

AI chatbot for race insights and analysis

3D flythrough visualizations via Google Earth Studio



## Tech Stack

🚀 Core Technologies
Python 3.8+ – Main programming language for simulation and logic

TensorFlow – Apex detection, lap-time prediction, and ML models

NumPy & Pandas – Numerical computation and data handling

OpenCV – Image processing for custom-drawn track inputs

Matplotlib (optional) – Visualization of paths and simulation results

🌍 Geospatial & Track Handling
Google Earth Studio – For generating 3D flythroughs of tracks

Google Earth Engine / KML – To extract lat-long coordinates for real-world F1 circuits

🎮 Simulation Engine
Custom Physics Engine – Built from scratch using:

Turning radius logic

Grip/friction models

Apex and curvature optimization

Lap time minimization

💬 AI Chatbot (Optional Frontend Interface)
React.js – Frontend for interactive chatbot and dashboard

Node.js – Server-side integration

Flask / FastAPI – Lightweight backend for exposing simulation insights via API

📁 Data & File Formats
.kml – Real-world F1 track layouts (digitized manually)

.png / .jpg – Custom user-drawn tracks

.csv / .json – Intermediate results and path data


## 🧠 How It Works

Data Input
Load official F1 track (.kml) or custom-drawn image (.png, .jpg)

Extract inner and outer boundaries

Simulation Logic
Detect apex and curvature points

Apply lap-time minimization algorithms

Integrate friction and grip zone data

Visualization
Overlay optimal line on track

Animate lap using Google Earth Studio

Render flythroughs for visual storytelling
## ✍️ Authors

Dhyey Thakkar
📧 dhyey.7.thakkar@gmail.com


## 👥 Acknowledgements

Special thanks to engineers at Yas Marina Circuit, Abu Dhabi for expert feedback on:

Apex logic and line clipping strategies

Braking zone modeling

Realistic surface behavior simulation