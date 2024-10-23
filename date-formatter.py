import os
import re
import sys

### To run this:
### python3 date-formatter.py /path/to/folder/

### What this aims to accomplish:
### Parse and fix dates to be a proper date format for yaml

def update_date_format(file_path):
    with open(file_path, 'r') as file:
        content = file.readlines()

    front_matter = False
    new_content = []

    for line in content:
        # Detect front matter section
        if line.strip() == '---':
            front_matter = not front_matter

        if front_matter and line.startswith('date:'):
            # Use regex to find and replace the date formats
            original_line = line.strip()
            print(f"Original Date Line: {original_line}")  # Debugging line

            # Match formats "Month day, year" and "Month day year"
            match = re.match(r"^date:\s*(\w+)\s+(\d{1,2})(?:st|nd|rd|th)?[, ]+\s*(\d{4})$", original_line)
            if match:
                month_str, day_str, year_str = match.groups()
                month_map = {
                    "January": "01", "February": "02", "March": "03", "April": "04",
                    "May": "05", "June": "06", "July": "07", "August": "08",
                    "September": "09", "October": "10", "November": "11", "December": "12"
                }
                month_num = month_map.get(month_str)
                day_num = day_str.zfill(2)  # Zero-pad day if needed
                new_date_line = f"date: {year_str}-{month_num}-{day_num}\n"
                new_content.append(new_date_line)
                print(f"Updated Date Line: {new_date_line.strip()}")  # Debugging line
            else:
                # If no match found, keep the original line
                new_content.append(line)
                continue
        else:
            new_content.append(line)

    # Write updated content back to the file
    with open(file_path, 'w') as file:
        file.writelines(new_content)

def main(folder_path):
    for filename in os.listdir(folder_path):
        if filename.endswith('.md'):
            file_path = os.path.join(folder_path, filename)
            update_date_format(file_path)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("ERROR! You must enter a folder path.")
        sys.exit(1)

    folder_path = sys.argv[1]
    if not os.path.isdir(folder_path):
        print("ERROR! The path you entered is invalid.")
        sys.exit(1)

    main(folder_path)