import numpy as np
import matplotlib.pyplot as plt
import csv
from scipy.interpolate import interp1d
from scipy.spatial.distance import cdist


def parse_csv_coordinates(csv_file):
    inner_points = []
    outer_points = []

    with open(csv_file, 'r') as file:
        reader = csv.DictReader(file)
        for row in reader:
            try:
                inner_lon = float(row['inner_lon'])
                inner_lat = float(row['inner_lat'])
                outer_lon = float(row['outer_lon'])
                outer_lat = float(row['outer_lat'])

                inner_points.append([outer_lon, outer_lat])
                outer_points.append([inner_lon, inner_lat])

            except (KeyError, ValueError) as e:
                print(f"Skipping row due to error: {e}")

    if not inner_points or not outer_points:
        raise ValueError("No valid coordinate data found in the CSV file")

    return np.array(inner_points), np.array(outer_points)


def resample_curve(points, n_points=1000):
    dist = np.zeros(len(points))
    for i in range(1, len(points)):
        dist[i] = dist[i - 1] + np.linalg.norm(points[i] - points[i - 1])

    fx = interp1d(dist, points[:, 0], kind='cubic')
    fy = interp1d(dist, points[:, 1], kind='cubic')

    new_dist = np.linspace(0, dist[-1], n_points)
    new_x = fx(new_dist)
    new_y = fy(new_dist)

    return np.vstack((new_x, new_y)).T


def curvature(points):
    x = points[:, 0]
    y = points[:, 1]

    dx = np.gradient(x)
    dy = np.gradient(y)

    ddx = np.gradient(dx)
    ddy = np.gradient(dy)

    k = (dx * ddy - dy * ddx) / (dx * dx + dy * dy) ** 1.5
    return k


def find_apex_points(points, curvature_vals, threshold=0.001):
    apex_indices = []
    n = len(curvature_vals)

    for i in range(1, n - 1):
        if (curvature_vals[i] > curvature_vals[i - 1] and
                curvature_vals[i] > curvature_vals[i + 1] and
                abs(curvature_vals[i]) > threshold):
            apex_indices.append(i)
    return apex_indices


def cluster_apex_points(points, apex_indices, dist_threshold=0.0005):
    apex_points = points[apex_indices]
    dist_mat = cdist(apex_points, apex_points)

    n = len(apex_points)
    visited = set()
    clusters = []

    for i in range(n):
        if i in visited:
            continue
        cluster = {i}
        stack = [i]
        while stack:
            curr = stack.pop()
            neighbors = np.where(dist_mat[curr] < dist_threshold)[0]
            for nb in neighbors:
                if nb not in cluster:
                    cluster.add(nb)
                    stack.append(nb)
        visited.update(cluster)
        clusters.append(list(cluster))

    return clusters


def filter_clusters_by_curvature(points, apex_indices, curvature_vals, clusters):
    filtered_apex = []
    for cluster in clusters:
        cluster_curvatures = [abs(curvature_vals[apex_indices[i]]) for i in cluster]
        max_idx_in_cluster = cluster[np.argmax(cluster_curvatures)]
        filtered_apex.append(apex_indices[max_idx_in_cluster])
    return filtered_apex


def find_opposite_track_points(source_points, target_points, source_apex_indices, max_distance=0.001):
    source_apex = source_points[source_apex_indices]
    dist_matrix = cdist(source_apex, target_points)

    opposite_indices = []
    for i in range(len(source_apex_indices)):
        min_dist_idx = np.argmin(dist_matrix[i])
        if dist_matrix[i, min_dist_idx] < max_distance:
            opposite_indices.append(min_dist_idx)

    return opposite_indices


def get_turn_direction(points, apex_indices):
    turn_directions = []
    for i in apex_indices:
        prev_idx = max(0, i - 5)
        next_idx = min(len(points) - 1, i + 5)

        tangent_prev = points[i] - points[prev_idx]
        tangent_next = points[next_idx] - points[i]

        cross = tangent_prev[0] * tangent_next[1] - tangent_prev[1] * tangent_next[0]

        turn_directions.append(1 if cross > 0 else -1)
    return turn_directions


def select_apex_based_on_turn_direction(inner_points, outer_points,
                                        inner_apex_indices, outer_apex_indices,
                                        k_inner, k_outer, max_pairing_distance=0.001):
    inner_apex_pts = inner_points[inner_apex_indices]
    outer_apex_pts = outer_points[outer_apex_indices]

    inner_turn_dirs = get_turn_direction(inner_points, inner_apex_indices)
    outer_turn_dirs = get_turn_direction(outer_points, outer_apex_indices)

    dist_matrix = cdist(inner_apex_pts, outer_apex_pts)
    valid_pairs = []

    for i, inner_idx in enumerate(inner_apex_indices):
        closest_outer_idx = outer_apex_indices[np.argmin(dist_matrix[i])]
        if dist_matrix[i, np.argmin(dist_matrix[i])] < max_pairing_distance:
            valid_pairs.append((inner_idx, closest_outer_idx, inner_turn_dirs[i]))

    final_inner_apex = []
    final_outer_apex = []

    for inner_idx, outer_idx, turn_dir in valid_pairs:
        if turn_dir == 1:  # Right turn → Keep inner apex
            final_inner_apex.append(inner_idx)
        else:  # Left turn → Keep outer apex
            final_outer_apex.append(outer_idx)

    return final_inner_apex, final_outer_apex


def plot_track_with_apex(inner, outer, inner_apex_indices, outer_apex_indices):
    plt.figure(figsize=(14, 10))

    # Plot tracks
    plt.plot(inner[:, 0], inner[:, 1], 'g-', label='Inner Track', linewidth=2)
    plt.plot(outer[:, 0], outer[:, 1], 'b-', label='Outer Track', linewidth=2)

    # Plot apex points
    if len(inner_apex_indices) > 0:
        plt.scatter(inner[inner_apex_indices, 0], inner[inner_apex_indices, 1],
                    color='red', s=100, marker='o', label='Inner Track Apex (from outer)')
    if len(outer_apex_indices) > 0:
        plt.scatter(outer[outer_apex_indices, 0], outer[outer_apex_indices, 1],
                    color='orange', s=100, marker='s', label='Outer Track Apex (from inner)')

    plt.title('Track with Apex Points on Opposite Tracks')
    plt.xlabel('Longitude')
    plt.ylabel('Latitude')
    plt.legend()
    plt.gca().set_aspect('equal', adjustable='box')
    plt.grid(True)
    plt.show()


def save_apex_points_to_csv(inner_points, outer_points, inner_apex_indices, outer_apex_indices,
                            filename='apex_points.csv'):
    with open(filename, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(['type', 'longitude', 'latitude', 'index'])

        for idx in inner_apex_indices:
            lon, lat = inner_points[idx]
            writer.writerow(['inner', lon, lat, idx])

        for idx in outer_apex_indices:
            lon, lat = outer_points[idx]
            writer.writerow(['outer', lon, lat, idx])

    print(f"Apex points saved to {filename}")


if __name__ == "__main__":
    # Configuration
    csv_file = 'track_paths.csv'
    resample_points = 2000
    curvature_threshold = 0.002
    cluster_threshold = 0.0005
    pairing_distance = 0.001

    # Load and process data
    inner, outer = parse_csv_coordinates(csv_file)
    inner_rs = resample_curve(inner, n_points=resample_points)
    outer_rs = resample_curve(outer, n_points=resample_points)

    # Calculate curvature
    k_inner = curvature(inner_rs)
    k_outer = curvature(outer_rs)

    # Find initial apex points
    apex_inner = find_apex_points(inner_rs, k_inner, threshold=curvature_threshold)
    apex_outer = find_apex_points(outer_rs, k_outer, threshold=curvature_threshold)

    # Cluster nearby apex points
    clusters_inner = cluster_apex_points(inner_rs, apex_inner, dist_threshold=cluster_threshold)
    clusters_outer = cluster_apex_points(outer_rs, apex_outer, dist_threshold=cluster_threshold)

    # Filter clusters to keep strongest apex in each
    filtered_inner = filter_clusters_by_curvature(inner_rs, apex_inner, k_inner, clusters_inner)
    filtered_outer = filter_clusters_by_curvature(outer_rs, apex_outer, k_outer, clusters_outer)

    # Find apex points on opposite tracks
    inner_apex_from_outer = find_opposite_track_points(outer_rs, inner_rs, filtered_outer, pairing_distance)
    outer_apex_from_inner = find_opposite_track_points(inner_rs, outer_rs, filtered_inner, pairing_distance)

    # Apply turn direction logic to final selection
    final_inner_apex, final_outer_apex = select_apex_based_on_turn_direction(
        inner_rs, outer_rs, inner_apex_from_outer, outer_apex_from_inner,
        k_inner, k_outer, max_pairing_distance=pairing_distance
    )

    # Output results
    print(f"Final inner apex count: {len(final_inner_apex)}")
    print(f"Final outer apex count: {len(final_outer_apex)}")

    # Save and visualize
    save_apex_points_to_csv(inner_rs, outer_rs, final_inner_apex, final_outer_apex)
    plot_track_with_apex(inner_rs, outer_rs, final_inner_apex, final_outer_apex)