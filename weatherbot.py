import dateparser
import pandas as pd
import requests
import spacy

# Load the spaCy model
nlp = spacy.load("en_core_web_sm")

def extract_entities(text):
    doc = nlp(text)
    dates = []
    locations = []

    # Extract entities
    for ent in doc.ents:
        if ent.label_ == "DATE":
            dates.append(ent.text)
        elif ent.label_ == "GPE":
            locations.append(ent.text)

    return dates, locations


def parse_dates(dates):
    parsed_dates = [dateparser.parse(date) for date in dates]
    return parsed_dates


def geocode_location(city_name: str):
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

def get_timezone(lat: float, lon: float):
    """Request timezone from https://www.geotimezone.com/ \n
        Args:

    """
    pass

def get_entire_day_weather(lon: float, lat: float, timezone: str, date: str):
    """
    Requests weather data from https://open-meteo.com/ \n
    Args:
    """
    url = "https://api.open-meteo.com/v1/forecast?"
    params = {
        "latitude": lat,
        "longitude": lon,
        "daily": ["weather_code","temperature_2m_max","temperature_2m_min","sunrise","sunset","precipitation_sum","rain_sum","showers_sum","snowfall_sum","precipitation_hours"],
        "timezone": timezone,
        "start_date": date,
        "end_date": date
    }

    response = requests.get(url, body=params, timeout=10)

def parse_weather_data(data: dict, how: str):
    metrics = data[how]
    df_daily_weather = pd.DataFrame.from_dict(metrics)
    return df_daily_weather


def get_weather_data(
    lon: float, lat: float, timezone: str, date: str, timeframe: str
    ) -> pd.DataFrame:
    """
    Requests weather data from https://open-meteo.com/  and returns a DataFrame\n
    Args: \n
    lon (float): Longitude coordinate\n
    lat (float): Latitude coordinate\n
    timezone (string): Timezone name (e.g., GMT, CET...)\n
    date (string): YYYY-MM-DD\n
    timeframe (string): "hourly" or "daily"
    """
    url = "https://api.open-meteo.com/v1/forecast?"

    if timeframe == "daily":
        metrics = "temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max"
    elif timeframe == "hourly":
        metrics = "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,cloud_cover,visibility",

    params = {
        "latitude": lat,
        "longitude": lon,
        timeframe: metrics,
        "timezone": timezone,
        "start_date": date,
        "end_date": date
    }

    response = requests.get(url, params=params, timeout=10)

    if response.status_code == 200:
        try:
            weather_data = parse_weather_data(data=response.json(), how=timeframe)
            
        except ValueError as e:  # Catch JSON decode error
            print("Error decoding JSON:", e)
            print("Response content:", response.text)
            weather_data = None
    else:
        print(f"Error: {response.status_code}")
        print("Response content:", response.text)
        weather_data = None
    
    return weather_data


def main():
    user_input = input("Enter your text: ")
    dates, locations = extract_entities(user_input)
    parsed_dates = parse_dates(dates)
    geo_data = geocode_location(locations)
    weather_data = get_weather_data(
        lon=geo_data[0]["lon"], 
        lat=geo_data[0]["lat"], 
        timezone = "CET", # TODO: fetch from API
        date = str(parsed_dates[0].strftime("%Y-%m-%d")),
        timeframe = "daily" # TODO: choose dynamically based on input
        )

    print("Parsed Dates:", parsed_dates)
    print("Locations:", locations)
    print("Geographical Data:", geo_data)
    print("Weather data:", weather_data)


if __name__ == "__main__":
    main()


#TODO: CLI - use plotext to draw charts of hourly weather data
