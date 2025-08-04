🏁 Optimal Race Line Prediction and Visualisation
Welcome to a complete simulation and visualization pipeline for predicting the fastest possible racing line on any Formula 1 circuit — powered by AI, vehicle dynamics, geospatial mapping, and a custom-built simulation engine.

This project bridges real-world physics, machine learning, and creative input handling, and includes support for both official F1 tracks and user-drawn circuits.

🚀 Key Features
Physics-Aware Simulation Engine
Built using Python (TensorFlow, NumPy, Pandas) to model:

Shortest path & curvature optimization

Apex detection and lap-time minimization

Grip-aware driving dynamics and turning radius logic

User-Drawn Track Support
Draw your own racetrack layout (inner and outer boundaries), and the system will:

Interpret boundaries

Construct digital representations

Simulate the optimal racing line with full lap dynamics

Real F1 Track Database (KML-Based)
Manually digitized all official F1 tracks via Google Earth Engine and Google Earth Studio, capturing:

Precise lat/long coordinates

3D flythrough animations

Friction zones and sector behavior

AI-Powered Chatbot Interface
Ask questions about the simulation:

“Where is my slowest corner?”

“Who has the fastest lap here?”

Get predictive insights and driver stats

Professional Guidance
Developed with input from engineers at Yas Marina Circuit, Abu Dhabi, ensuring the simulation reflects real-world racing behavior.


🧠 How It Works
Data Input

Load real track layout (KML) or custom-drawn layout (PNG/JPG).

Extract edges, boundaries, and segment coordinates.

Simulation Logic

Detect apex points and turn radii

Optimize racing line for minimum lap time using physics models

Adjust path based on dynamic friction values

Visualization

Overlay optimal line on track map

Simulate full-speed lap

Render animations using Google Earth Studio (for real tracks)

AI Chatbot (Optional)

React + Node interface

Connects to local track DB for lap records, corner analysis, etc.


⚙ Requirements
Python 3.8+

TensorFlow

NumPy, Pandas, OpenCV

Flask / FastAPI (for chatbot backend)

React.js (for chatbot frontend)

Google Earth Studio (manual animation export)


💡 Use Cases
F1 Strategy and Simulation

Racing Game Engine Integration

AI-powered Race Education Tools

eSports and Virtual Circuit Testing


🤝 Acknowledgments
Special thanks to engineers at Yas Marina Circuit for technical feedback on:

Surface grip modeling

Apex strategies

Turn-in points and braking zones


📬 Contact
For questions, collaboration, or demonstrations, feel free to connect with me:

Dhyey Thakkar
📧 dhyey.7.thakkar@gmail.com
