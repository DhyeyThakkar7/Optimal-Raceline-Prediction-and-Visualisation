import pandas as pd
import numpy as np
import simplekml
import matplotlib.pyplot as plt
from pykml import parser
import requests

# ---- CONFIG ----
KML_FILE = "abu_dhabi_final.kml"
CSV_FILE = "adaptive_racing_line.csv"
GOOGLE_API_KEY = "AIzaSyCctAWoHT22LHoioefjMN6VPKa39xOHTeM"  # Replace with your key
ELEVATION_API_URL = "https://maps.googleapis.com/maps/api/elevation/json"

# ---- FUNCTIONS ----

def extract_kml_coordinates(filepath):
    with open(filepath, 'r') as f:
        root = parser.parse(f).getroot()
    ns = {'kml': 'http://www.opengis.net/kml/2.2'}
    coords = root.findall('.//kml:coordinates', namespaces=ns)
    lines = [line.text.strip() for line in coords if line.text]
    split_coords = [[list(map(float, c.split(',')[:2])) for c in line.split()] for line in lines]
    return split_coords  # [inner_coords, outer_coords]

def fetch_elevation(coords):
    elevations = []
    for i in range(0, len(coords), 50):
        chunk = coords[i:i+50]
        locations = "|".join([f"{lat},{lon}" for lon, lat in chunk])
        response = requests.get(ELEVATION_API_URL, params={
            "locations": locations,
            "key": GOOGLE_API_KEY
        })
        results = response.json().get("results", [])
        elevations.extend([(lon, lat, res["elevation"]) for (lon, lat), res in zip(chunk, results)])
    return elevations

def plot_3d_track(inner, outer, optimal):
    fig = plt.figure(figsize=(12, 8))
    ax = fig.add_subplot(111, projection='3d')

    for pts, label, color in zip([inner, outer, optimal],
                                 ['Inner Boundary', 'Outer Boundary', 'Optimized Racing Line'],
                                 ['green', 'blue', 'red']):
        xs, ys, zs = zip(*pts)
        ax.plot(xs, ys, zs, label=label, color=color)

    ax.set_xlabel('Longitude')
    ax.set_ylabel('Latitude')
    ax.set_zlabel('Elevation (m)')
    ax.set_title('3D Track Visualization with Elevation')
    ax.legend()
    plt.tight_layout()
    plt.show()

# ---- MAIN ----

# 1. Load KML and CSV
kml_data = extract_kml_coordinates(KML_FILE)
inner_coords, outer_coords = kml_data[0], kml_data[1]
optimal_df = pd.read_csv(CSV_FILE)
optimal_coords = optimal_df[['longitude', 'latitude']].values.tolist()

# 2. Fetch elevation
print("Fetching elevation data from Google API...")
inner_elev = fetch_elevation(inner_coords)
outer_elev = fetch_elevation(outer_coords)
optimal_elev = fetch_elevation(optimal_coords)

# 3. Create a combined KML
print("Creating KML file with elevation data...")
kml = simplekml.Kml()
for name, coords, color in zip(
    ["Inner", "Outer", "Optimal"],
    [inner_elev, outer_elev, optimal_elev],
    [simplekml.Color.green, simplekml.Color.blue, simplekml.Color.red]
):
    ls = kml.newlinestring(name=name)
    ls.coords = coords
    ls.altitudemode = simplekml.AltitudeMode.absolute
    ls.extrude = 1
    ls.style.linestyle.width = 3
    ls.style.linestyle.color = color

kml.save("track_with_all_elevations.kml")

# 4. Plot in 3D
print("Plotting in 3D...")
plot_3d_track(inner_elev, outer_elev, optimal_elev)
