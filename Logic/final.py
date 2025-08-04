import numpy as np
import matplotlib.pyplot as plt
import csv
from scipy.spatial.distance import cdist
from matplotlib.collections import LineCollection
from scipy.signal import savgol_filter


def load_track_data(csv_file):

    inner_points, outer_points, center_points = [], [], []
    with open(csv_file, 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            try:
                inner_points.append([float(row['inner_lon']), float(row['inner_lat'])])
                outer_points.append([float(row['outer_lon']), float(row['outer_lat'])])
                center_points.append([float(row['center_lon']), float(row['center_lat'])])
            except (KeyError, ValueError) as e:
                print(f"Skipping row due to error: {e}")
    return np.array(inner_points), np.array(outer_points), np.array(center_points)


def load_apex_points(csv_file):

    apex_points = []
    with open(csv_file, 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            try:
                apex_points.append({
                    'point': np.array([float(row['longitude']), float(row['latitude'])]),
                    'curvature': abs(float(row.get('curvature', 1)))  # Default 1 if no curvature data
                })
            except (KeyError, ValueError) as e:
                print(f"Skipping row due to error: {e}")
    return apex_points


def calculate_turn_sharpness(center_line, window=10):

    sharpness = np.zeros(len(center_line))
    for i in range(len(center_line)):
        start = max(0, i - window)
        end = min(len(center_line) - 1, i + window)
        segment = center_line[start:end]

        # Calculate direction changes
        directions = np.arctan2(
            np.gradient(segment[:, 1]),
            np.gradient(segment[:, 0])
        )
        sharpness[i] = np.sum(np.abs(np.diff(directions)))
    return sharpness / np.max(sharpness)  # Normalize to 0-1


def find_closest_center_points(center_line, apex_data):

    apex_indices = []
    for apex in apex_data:
        distances = cdist([apex['point']], center_line)
        closest_idx = np.argmin(distances)
        apex_indices.append({
            'index': closest_idx,
            'sharpness': apex['curvature'],
            'point': apex['point']
        })

    # Sort by track order
    apex_indices.sort(key=lambda x: x['index'])
    return apex_indices


def create_adaptive_path(center_line, apex_info, base_influence=30, max_deviation=0.5):

    path = center_line.copy()
    sharpness_map = calculate_turn_sharpness(center_line)

    for apex in apex_info:
        apex_idx = apex['index']
        apex_sharpness = apex['sharpness']
        apex_point = apex['point']

        # Dynamic parameters based on sharpness
        influence_radius = int(base_influence * (1 + apex_sharpness))
        deviation_strength = max_deviation * apex_sharpness

        start_idx = max(0, apex_idx - influence_radius)
        end_idx = min(len(center_line) - 1, apex_idx + influence_radius)

        # Bell curve weighted by sharpness
        x = np.linspace(-3, 3, end_idx - start_idx)
        weights = np.exp(-x ** 2) * deviation_strength

        # Blend path toward apex point
        for i, idx in enumerate(range(start_idx, end_idx)):
            path[idx] = (1 - weights[i]) * path[idx] + weights[i] * apex_point

    # Apply curvature-adaptive smoothing
    smoothed_path = path.copy()
    for i in range(len(path)):
        window = max(3, int(10 * (1 - sharpness_map[i])))
        start = max(0, i - window)
        end = min(len(path), i + window + 1)
        smoothed_path[i] = np.mean(path[start:end], axis=0)

    return smoothed_path


def create_waveform_data():

    # Hardcoded velocity percentages for each turn
    turns = ['Turn 1', 'Turn 2', 'Turn 3', 'Turn 4', 'Turn 5',
             'Turn 6', 'Turn 7', 'Turn 8', 'Turn 9', 'Turn 10']
    velocity_percent = [20, 70, 80, 50, 60, 70, 40, 40, 20, 40]

    # Create smooth waveform for velocity
    x = np.arange(len(turns))
    x_interp = np.linspace(0, len(turns) - 1, 500)
    v_interp = np.interp(x_interp, x, velocity_percent)
    v_smooth = savgol_filter(v_interp, window_length=51, polyorder=3)

    # Calculate acceleration between turns (for bar chart)
    acceleration = np.diff(velocity_percent)
    acceleration = np.append(acceleration, 0)  # Pad with 0

    return x_interp, v_smooth, x, velocity_percent, acceleration, turns


def plot_combined_profiles():

    x_wave, velocity, x_bar, velocity_points, acceleration, turns = create_waveform_data()

    # Create figure with two subplots
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 8), sharex=True)

    # Plot velocity waveform (ECG-style)
    ax1.plot(x_wave, velocity, 'b-', linewidth=2, label='Velocity')
    ax1.scatter(x_bar, velocity_points, color='blue', s=100, zorder=3, label='Turn Points')

    # Add turn labels and markers
    for i, turn in enumerate(turns):
        ax1.axvline(x=i, color='gray', linestyle=':', alpha=0.5)
        ax1.text(i, 105, turn, ha='center', va='bottom', fontsize=10)

    ax1.set_title('Velocity Profile (ECG-style)', fontsize=14)
    ax1.set_ylabel('Speed (% of max)', fontsize=12)
    ax1.set_ylim(0, 110)
    ax1.grid(True, linestyle='--', alpha=0.7)
    ax1.legend()

    # Plot acceleration bar chart
    colors = ['green' if a >= 0 else 'red' for a in acceleration]
    bars = ax2.bar(turns, acceleration, color=colors, alpha=0.7)

    # Add value labels on bars
    for bar in bars:
        height = bar.get_height()
        ax2.text(bar.get_x() + bar.get_width() / 2., height,
                 f'{int(height)}%',
                 ha='center', va='bottom' if height >= 0 else 'top')

    ax2.set_title('Acceleration Profile (Bar Chart)', fontsize=14)
    ax2.set_xlabel('Track Position', fontsize=12)
    ax2.set_ylabel('Acceleration (% change)', fontsize=12)
    ax2.grid(True, axis='y', linestyle='--', alpha=0.7)
    ax2.axhline(0, color='black', linewidth=0.5)

    plt.tight_layout()
    plt.show()


def plot_optimal_racing_line(inner, outer, center, apex_data, optimal_path):

    fig, ax = plt.subplots(figsize=(16, 12))

    # Plot track boundaries
    ax.plot(inner[:, 0], inner[:, 1], 'g-', alpha=0.4, label='Inner Boundary')
    ax.plot(outer[:, 0], outer[:, 1], 'b-', alpha=0.4, label='Outer Boundary')

    # Calculate curvature
    dx = np.gradient(optimal_path[:, 0])
    dy = np.gradient(optimal_path[:, 1])
    ddx = np.gradient(dx)
    ddy = np.gradient(dy)
    curvature = np.abs(dx * ddy - dy * ddx) / (dx ** 2 + dy ** 2) ** 1.5

    # Create line segments colored by curvature
    points = np.array([optimal_path[:-1], optimal_path[1:]]).transpose(1, 0, 2)
    segments = np.concatenate([points[:-1], points[1:]], axis=1)

    # Create a continuous norm to map from data points to colors
    norm = plt.Normalize(curvature.min(), curvature.max())
    lc = LineCollection(segments, cmap='hot', norm=norm, linewidth=2)
    lc.set_array(curvature)
    line = ax.add_collection(lc)

    # Add colorbar
    cbar = fig.colorbar(line, ax=ax, label='Curvature Intensity')

    # Mark apex points
    for i, apex in enumerate(apex_data):
        ax.scatter(apex['point'][0], apex['point'][1],
                   s=50 + 150 * apex['sharpness'], c='red',
                   marker='o', edgecolors='black',
                   label='Apex' if i == 0 else None)

    ax.set_title('Adaptive Minimum Curvature Racing Line', fontsize=16)
    ax.set_xlabel('Longitude', fontsize=14)
    ax.set_ylabel('Latitude', fontsize=14)
    ax.legend(fontsize=12)
    ax.set_aspect('equal', adjustable='box')
    ax.grid(True)
    plt.show()


def main():
    # Load data
    inner, outer, center = load_track_data('track_paths.csv')
    apex_data = load_apex_points('apex_points.csv')

    # Process apexes
    apex_info = find_closest_center_points(center, apex_data)

    # Generate adaptive racing line
    optimal_path = create_adaptive_path(center, apex_info,
                                        base_influence=30, max_deviation=0.6)

    # Visualize optimal racing line
    plot_optimal_racing_line(inner, outer, center, apex_info, optimal_path)

    # After closing the racing line plot, show combined profiles
    plot_combined_profiles()

    # Save results
    np.savetxt('adaptive_racing_line.csv', optimal_path,
               delimiter=',', header='longitude,latitude', comments='')


if __name__ == "__main__":
    main()