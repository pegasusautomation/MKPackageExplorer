import json

# Read the content of the text file
with open('bitrate_hist_mksp1_active.txt', 'r') as file:
    text_content = file.read()

# Split the text into lines
lines = text_content.splitlines()

# Create a dictionary from the lines
data = {}
for line in lines:
    # Split the line at the first occurrence of ':'
    key, value = line.split(':', 1)
    # Strip leading and trailing whitespaces from key and value
    data[key.strip()] = value.strip()

# Write the data to a JSON file
with open('output.json', 'w') as json_file:
    json.dump(data, json_file, indent=4)

