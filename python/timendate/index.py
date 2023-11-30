import urllib.request
import json
import re

from datetime import datetime

def to_seconds(time_str):
    time_obj = datetime.strptime(time_str, '%H:%M:%S')
    total_seconds = time_obj.hour * 3600 + time_obj.minute * 60 + time_obj.second
    return total_seconds

results = {}

for year in range(2022, 2045):
    for month in range(1, 13):
        try:
            url = f'https://www.timeanddate.com/sun/malaysia/penang?month={month}&year={year}'
            with urllib.request.urlopen(url) as response:
                html = response.read()
            pattern = r'<td class=\"c tr sep-l\">(.*?)</td>'
            matches = re.findall(pattern, html.decode())
            print(matches)
            print(len(matches))
            for day, time in enumerate(matches, 1):
                results[f'{year}-{str(month).rjust(2, "0")}-{str(day).rjust(2, "0")}'] = to_seconds(time)
        except Exception as e:
            print(f"An error occurred: {e}")

with open("dayLengths.js", mode="w") as f:
    s = json.dumps(results, indent=1)
    print(s, file=f)