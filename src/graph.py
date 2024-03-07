import json
import matplotlib.pyplot as plt
 
# JSON data
# Open the JSON file
with open('userData.json', 'r') as file:
    # Load JSON data
    data = json.load(file)
 
# Extract data for plotting
timestamps = [point['date'] for point in data]
br_values = [point['null']['br'] for point in data]
 
# Plot
plt.figure(figsize=(10, 6))
plt.plot(timestamps, br_values, marker='o', linestyle='-')
plt.xlabel('Timestamp')
plt.ylabel('BR Value')
plt.title('BR Values Over Time')
plt.xticks(rotation=45)  # Rotate x-axis labels for better readability
plt.grid(True)
plt.tight_layout()  # Adjust layout to prevent cropping of labels
plt.show()