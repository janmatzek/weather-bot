import requests


def geocode_location(city_name):
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": city_name,
        "format": "json",
        "addressdetails": 1,
        "limit": 1,  # To limit the number of returned results
    }
    headers = {"User-Agent": "YourAppName/1.0 (your_email@example.com)"}
    response = requests.get(url, params=params, headers=headers, timeout=10)
    return response.json()


# Geocoding Example
city_name = "Prague"
geocode_result = geocode_location(city_name)
print("Geocode Result:", geocode_result)
