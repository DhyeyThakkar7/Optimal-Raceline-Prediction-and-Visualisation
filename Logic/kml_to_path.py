import cv2
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import requests
from scipy.interpolate import griddata
from matplotlib.colors import Normalize
import matplotlib.cm as cm
from matplotlib.widgets import Button
import xml.etree.ElementTree as ET
from scipy.optimize import minimize
from scipy.interpolate import interp1d

# Configuration
CIRCLE_RADIUS = 0.000025  # Radius of friction change on click
GROQ_API_KEY = "your groq key"
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

# Global variables
selected_friction = 1.0
friction_grid = None
track_mask = None
outer_boundary = None
inner_boundary = None
x_min = x_max = y_min = y_max = None
x_grid = y_grid = None

# Parse KML file and extract coordinates
def parse_kml(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()

    # Namespace dictionary
    ns = {'kml': 'http://www.opengis.net/kml/2.2'}

    # Extract coordinates for outer and inner boundaries
    outer_coords = []
    inner_coords = []

    for placemark in root.findall('.//kml:Placemark', ns):
        name = placemark.find('kml:name', ns).text
        coordinates = placemark.find('.//kml:coordinates', ns).text.strip()
        coords_list = [tuple(map(float, coord.split(','))) for coord in coordinates.split()]

        if name == 'Line 1':
            outer_coords = coords_list
        elif name == 'Line 3':
            inner_coords = coords_list

    # Convert to numpy arrays and remove altitude (z-coordinate)
    outer_boundary = np.array([(x, y) for x, y, _ in outer_coords])
    inner_boundary = np.array([(x, y) for x, y, _ in inner_coords])

    return outer_boundary, inner_boundary

# Generate a smooth gradient inside the track
def generate_friction_gradient(outer_boundary, inner_boundary, resolution=1000):
    global x_grid, y_grid

    x_min, x_max = min(outer_boundary[:, 0]), max(outer_boundary[:, 0])
    y_min, y_max = min(outer_boundary[:, 1]), max(outer_boundary[:, 1])

    x_grid, y_grid = np.meshgrid(np.linspace(x_min, x_max, resolution),
                                 np.linspace(y_min, y_max, resolution))

    track_points = np.vstack([outer_boundary, inner_boundary])
    friction_values = np.linspace(0.8, 1.2, len(track_points))

    friction_grid = griddata(track_points, friction_values, (x_grid, y_grid), method='linear')

    return x_min, x_max, y_min, y_max, friction_grid

# Create track mask
def create_track_mask(outer_boundary, inner_boundary, x_grid, y_grid):
    mask = np.zeros_like(x_grid, dtype=np.uint8)

    track_shape = x_grid.shape
    scale_x = track_shape[1] / (x_max - x_min)
    scale_y = track_shape[0] / (y_max - y_min)

    outer_scaled = np.column_stack([(outer_boundary[:, 0] - x_min) * scale_x,
                                    (outer_boundary[:, 1] - y_min) * scale_y]).astype(np.int32)
    inner_scaled = np.column_stack([(inner_boundary[:, 0] - x_min) * scale_x,
                                    (inner_boundary[:, 1] - y_min) * scale_y]).astype(np.int32)

    cv2.fillPoly(mask, [outer_scaled], 1)
    cv2.fillPoly(mask, [inner_scaled], 0)

    return mask

# Interactive plotting
def plot_friction_map():
    global friction_grid, selected_friction

    friction_grid_masked = np.where(track_mask, friction_grid, np.nan)

    fig, ax = plt.subplots(figsize=(10, 8))
    norm = Normalize(vmin=0.5, vmax=1.5)
    cmap = cm.plasma

    friction_img = ax.imshow(friction_grid_masked, cmap=cmap, norm=norm,
                             extent=[x_min, x_max, y_min, y_max], origin='lower')

    ax.plot(outer_boundary[:, 0], outer_boundary[:, 1], 'r', label="Outer Boundary")
    ax.plot(inner_boundary[:, 0], inner_boundary[:, 1], 'b', label="Inner Boundary")

    ax.set_title("Interactive Friction Map")
    ax.legend()

    cbar_ax = fig.add_axes([0.92, 0.2, 0.02, 0.6])
    cbar = plt.colorbar(cm.ScalarMappable(norm=norm, cmap=cmap), cax=cbar_ax)
    cbar.set_label("Friction Coefficient")

    def on_click(event):
        global selected_friction, friction_grid

        if event.inaxes == cbar_ax:
            # Select friction value from color scale
            selected_friction = norm.vmin + (norm.vmax - norm.vmin) * (event.ydata - cbar_ax.get_ylim()[0]) / (
                    cbar_ax.get_ylim()[1] - cbar_ax.get_ylim()[0])
            selected_friction = np.clip(selected_friction, norm.vmin, norm.vmax)
            print(f"Selected friction: {selected_friction:.2f}")

        elif event.inaxes == ax:
            x, y = event.xdata, event.ydata

            # Calculate the grid indices corresponding to the click coordinates
            x_idx = np.argmin(np.abs(x_grid[0, :] - x))
            y_idx = np.argmin(np.abs(y_grid[:, 0] - y))

            # Define a circular region around the selected point
            for i in range(max(0, y_idx - 10), min(friction_grid.shape[0], y_idx + 10)):
                for j in range(max(0, x_idx - 10), min(friction_grid.shape[1], x_idx + 10)):
                    if track_mask[i, j]:
                        # Calculate the distance from the click point
                        dist = np.sqrt((x_grid[i, j] - x) ** 2 + (y_grid[i, j] - y) ** 2)
                        if dist <= CIRCLE_RADIUS:
                            friction_grid[i, j] = selected_friction  # Update only within the circular region

            # Update the visualization
            friction_img.set_data(np.where(track_mask, friction_grid, np.nan))
            fig.canvas.draw()
            print(f"Updated friction in a circular region around ({x:.1f}, {y:.1f})")

    def on_done(event):
        save_friction_values("modified_friction.csv")
        plt.close(fig)
        print("Chatbot: Friction map saved. You can now ask me about wet zones, max friction, etc.")

    done_ax = fig.add_axes([0.8, 0.05, 0.1, 0.075])
    done_button = Button(done_ax, 'Done')
    done_button.on_clicked(on_done)

    fig.canvas.mpl_connect('button_press_event', on_click)
    plt.show()

# Save friction values
def save_friction_values(output_csv):
    rows = []
    for i in range(friction_grid.shape[0]):
        for j in range(friction_grid.shape[1]):
            if track_mask[i, j]:
                rows.append([x_grid[i, j], y_grid[i, j], friction_grid[i, j]])

    df = pd.DataFrame(rows, columns=['X', 'Y', 'Friction'])
    df.to_csv(output_csv, index=False)
    print(f"Modified friction values saved to {output_csv}")

# Interpolate boundaries to the same length
def interpolate_boundaries(outer_boundary, inner_boundary):
    from scipy.interpolate import interp1d

    # Interpolate outer boundary
    t_outer = np.linspace(0, 1, len(outer_boundary))
    f_outer_x = interp1d(t_outer, outer_boundary[:, 0], kind='linear')
    f_outer_y = interp1d(t_outer, outer_boundary[:, 1], kind='linear')

    # Interpolate inner boundary
    t_inner = np.linspace(0, 1, len(inner_boundary))
    f_inner_x = interp1d(t_inner, inner_boundary[:, 0], kind='linear')
    f_inner_y = interp1d(t_inner, inner_boundary[:, 1], kind='linear')

    # Use the longer length for interpolation
    max_length = max(len(outer_boundary), len(inner_boundary))
    t_new = np.linspace(0, 1, max_length)

    outer_interp = np.column_stack([f_outer_x(t_new), f_outer_y(t_new)])
    inner_interp = np.column_stack([f_inner_x(t_new), f_inner_y(t_new)])

    return outer_interp, inner_interp

# Plot track without black fill
def plot_track():
    global outer_boundary, inner_boundary

    # Interpolate boundaries to the same length
    outer_interp, inner_interp = interpolate_boundaries(outer_boundary, inner_boundary)

    fig, ax = plt.subplots(figsize=(10, 8))
    ax.plot(outer_interp[:, 0], outer_interp[:, 1], 'r', label="Outer Boundary")
    ax.plot(inner_interp[:, 0], inner_interp[:, 1], 'b', label="Inner Boundary")
    ax.set_title("Track Visualization")
    ax.legend()
    plt.show()

# Highlight points on the track
def highlight_points(points, color, label):
    global outer_boundary, inner_boundary

    # Close any existing track visualization
    plt.close('all')

    # Interpolate boundaries to the same length
    outer_interp, inner_interp = interpolate_boundaries(outer_boundary, inner_boundary)

    fig, ax = plt.subplots(figsize=(10, 8))
    ax.plot(outer_interp[:, 0], outer_interp[:, 1], 'r', label="Outer Boundary")
    ax.plot(inner_interp[:, 0], inner_interp[:, 1], 'b', label="Inner Boundary")
    ax.scatter(points['X'], points['Y'], c=color, s=50, label=label)
    ax.set_title(f"Track with {label}")
    ax.legend()
    plt.show()

def min_curvature_path(outer_boundary, inner_boundary, nseg=1500):
    """
    Compute the minimum curvature path between the outer and inner boundaries.
    """
    # Interpolate boundaries to have the same number of points
    t_outer = np.linspace(0, 1, len(outer_boundary))
    t_inner = np.linspace(0, 1, len(inner_boundary))
    f_outer = interp1d(t_outer, outer_boundary, axis=0, kind='linear')
    f_inner = interp1d(t_inner, inner_boundary, axis=0, kind='linear')
    t_new = np.linspace(0, 1, nseg)
    outer_interp = f_outer(t_new)
    inner_interp = f_inner(t_new)

    # Compute deltas between inner and outer boundaries
    delx = outer_interp[:, 0] - inner_interp[:, 0]
    dely = outer_interp[:, 1] - inner_interp[:, 1]

    # Form H matrix (quadratic term)
    n = len(delx)
    H = np.zeros((n, n))
    for i in range(1, n - 1):
        H[i - 1, i - 1] += delx[i - 1] ** 2 + dely[i - 1] ** 2
        H[i - 1, i] += -2 * delx[i - 1] * delx[i] - 2 * dely[i - 1] * dely[i]
        H[i - 1, i + 1] += delx[i - 1] * delx[i + 1] + dely[i - 1] * dely[i + 1]
        H[i, i - 1] += -2 * delx[i - 1] * delx[i] - 2 * dely[i - 1] * dely[i]
        H[i, i] += 4 * delx[i] ** 2 + 4 * dely[i] ** 2
        H[i, i + 1] += -2 * delx[i] * delx[i + 1] - 2 * dely[i] * dely[i + 1]
        H[i + 1, i - 1] += delx[i - 1] * delx[i + 1] + dely[i - 1] * dely[i + 1]
        H[i + 1, i] += -2 * delx[i] * delx[i + 1] - 2 * dely[i] * dely[i + 1]
        H[i + 1, i + 1] += delx[i + 1] ** 2 + dely[i + 1] ** 2

    # Form B vector (linear term)
    B = np.zeros(n)
    for i in range(1, n - 1):
        B[i - 1] += 2 * (inner_interp[i + 1, 0] + inner_interp[i - 1, 0] - 2 * inner_interp[i, 0]) * delx[i - 1] + \
                    2 * (inner_interp[i + 1, 1] + inner_interp[i - 1, 1] - 2 * inner_interp[i, 1]) * dely[i - 1]
        B[i] += -4 * (inner_interp[i + 1, 0] + inner_interp[i - 1, 0] - 2 * inner_interp[i, 0]) * delx[i] + \
                -4 * (inner_interp[i + 1, 1] + inner_interp[i - 1, 1] - 2 * inner_interp[i, 1]) * dely[i]
        B[i + 1] += 2 * (inner_interp[i + 1, 0] + inner_interp[i - 1, 0] - 2 * inner_interp[i, 0]) * delx[i + 1] + \
                    2 * (inner_interp[i + 1, 1] + inner_interp[i - 1, 1] - 2 * inner_interp[i, 1]) * dely[i + 1]

    # Define constraints (start and end points are the same)
    Aeq = np.zeros((1, n))
    Aeq[0, 0] = 1
    Aeq[0, -1] = -1
    beq = np.array([0])

    # Solve the quadratic programming problem
    res = minimize(lambda x: 0.5 * x.T @ H @ x + B @ x,
                   x0=np.zeros(n),
                   constraints={'type': 'eq', 'fun': lambda x: Aeq @ x - beq},
                   bounds=[(0, 1)] * n)

    # Compute the minimum curvature path
    x_res = inner_interp[:, 0] + res.x * delx
    y_res = inner_interp[:, 1] + res.x * dely
    return np.column_stack((x_res, y_res))

# Chatbot Function
def chat_with_groq():
    print("\n--- Chatbot Started! Ask me anything. Use 'my track', 'my circuit', or 'my racetrack' for track-related queries. Type 'exit' to quit. ---\n")

    # Prompt the user to tweak the friction map
    print("Chatbot: Let's start by tweaking the friction map. Adjust the friction values as needed and click 'Done' when finished.")
    plot_friction_map()

    while True:
        user_input = input("You: ").lower()

        if user_input == "exit":
            print("Goodbye!")
            plt.close('all')
            break

        # Check for track-related cues
        if any(phrase in user_input for phrase in ["my track", "my circuit", "my racetrack"]):
            try:
                df = pd.read_csv("modified_friction.csv")

                if "least friction" in user_input:
                    min_friction = df["Friction"].min()
                    least_friction_points = df[df["Friction"] == min_friction][["X", "Y"]]
                    print(f"Lowest friction: {min_friction:.2f}")
                    print("Locations:")
                    print(least_friction_points)
                    highlight_points(least_friction_points, 'red', 'Least Friction Zones')

                elif "most friction" in user_input:
                    max_friction = df["Friction"].max()
                    most_friction_points = df[df["Friction"] == max_friction][["X", "Y"]]
                    print(f"Highest friction: {max_friction:.2f}")
                    print("Locations:")
                    print(most_friction_points)
                    highlight_points(most_friction_points, 'green', 'Maximum Friction Zones')

                elif "average friction" in user_input:
                    avg_friction = df["Friction"].mean()
                    print(f"Average friction on the track: {avg_friction:.2f}")

                elif "wet zones" in user_input or "water puddles" in user_input:
                    wet_zones = df[df["Friction"] < 0.6][["X", "Y", "Friction"]]
                    if wet_zones.empty:
                        print("No wet zones detected on your track.")
                    else:
                        print("Wet zones (friction < 0.6) detected at:")
                        print(wet_zones)
                        highlight_points(wet_zones[["X", "Y"]], 'blue', 'Wet Zones')

                elif "tyre degradation zones" in user_input or "rough gravel zones" in user_input:
                    high_friction_zones = df[df["Friction"] > 1.4][["X", "Y", "Friction"]]
                    if high_friction_zones.empty:
                        print("No tyre degradation zones detected on your track.")
                    else:
                        print("Tyre degradation zones (friction > 1.4) detected at:")
                        print(high_friction_zones)
                        highlight_points(high_friction_zones[["X", "Y"]], 'yellow', 'Tyre Degradation Zones')

                elif "optimal racing line" in user_input or "minimum curvature path" in user_input:
                    try:
                        optimal_path = min_curvature_path(outer_boundary, inner_boundary)
                        highlight_points(pd.DataFrame(optimal_path, columns=['X', 'Y']), 'green', 'Optimal Racing Line')
                    except Exception as e:
                        print("Error computing optimal racing line:", str(e))

                else:
                    print("I'm not sure how to analyze that about your track. Try asking about least, most, average friction, wet zones, or tyre degradation zones.")

            except Exception as e:
                print("Error reading track data:", str(e))

            continue  # Skip Groq API for track-related queries

        # If not track-related, send query to Groq API
        response = requests.post(
            GROQ_API_URL,
            headers={"Authorization": f"Bearer {GROQ_API_KEY}", "Content-Type": "application/json"},
            json={
                "model": "mixtral-8x7b-32768",
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": user_input}
                ]
            }
        )

        try:
            reply = response.json()["choices"][0]["message"]["content"]
            print(f"Chatbot: {reply}")

        except Exception as e:
            print("Chatbot: Sorry, something went wrong.")
            print("Error:", str(e))

# Run the pipeline
kml_file = 'abu_dhabi_final.kml'  # Replace with your KML file path
outer_boundary, inner_boundary = parse_kml(kml_file)
x_min, x_max, y_min, y_max, friction_grid = generate_friction_gradient(outer_boundary, inner_boundary)
track_mask = create_track_mask(outer_boundary, inner_boundary, x_grid, y_grid)

# Start the chatbot
chat_with_groq()

# Compute the minimum curvature path
optimal_path = min_curvature_path(outer_boundary, inner_boundary)

# Plot the optimal path
fig, ax = plt.subplots(figsize=(10, 8))
ax.plot(outer_boundary[:, 0], outer_boundary[:, 1], 'r', label="Outer Boundary")
ax.plot(inner_boundary[:, 0], inner_boundary[:, 1], 'b', label="Inner Boundary")
ax.plot(optimal_path[:, 0], optimal_path[:, 1], 'g', label="Optimal Racing Line")
ax.set_title("Track with Optimal Racing Line")
ax.legend()
plt.show()