import dateparser
import pandas as pd
import requests
import spacy
import numpy as np
from datetime import (datetime, timedelta)

# Load the spaCy model
nlp = spacy.load("en_core_web_sm")

def extract_entities(text):
    doc = nlp(text)
    dates = []
    locations = []

    print(doc.ents)

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



def parse_weather_data(data: dict, how: str) -> pd.DataFrame:
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
        metrics = "temperature_2m_max,temperature_2m_min,sunrise,sunset,sunshine_duration,precipitation_probability_max,wind_speed_10m_max"
    elif timeframe == "hourly":
        metrics = "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,cloud_cover,visibility,",
    else:
        raise ValueError("Timeframe must be either 'daily' or 'hourly'")

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


def gather_input(prompt:str) -> str:
    """Returns a string value of user input for a given prompt"""
    return input(f"{prompt} ")


def construct_weather_forecast(parsed_date: str, locations: str, weather_data: pd.DataFrame) -> str:
    """
    Constructs a weather forecast message based on the provided weather data.

    Args:
        parsed_date (str): The date of the weather forecast.
        locations (str): The location for which the weather forecast is being generated.
        weather_data (pd.DataFrame): The weather data containing information such as wind speed, temperature, and precipitation.

    Returns:
        str: The constructed weather forecast message.

    """
    wind_speed = weather_data['wind_speed_10m_max'][0]
    max_temperature = weather_data['temperature_2m_max'][0]
    min_temperature = weather_data['temperature_2m_min'][0]
    rain_probability = weather_data['precipitation_probability_max'][0]

    sunset = datetime.strptime(weather_data['sunset'][0], '%Y-%m-%dT%H:%M')
    sunrise = datetime.strptime(weather_data['sunrise'][0], '%Y-%m-%dT%H:%M')   
    
    day_duration = (sunset - sunrise).total_seconds()
    percent_sunshine = weather_data['sunshine_duration'][0] / day_duration

    place_and_time = f"The weather in {locations} on {parsed_date.strftime("%Y-%d-%m")} will be "
    sun_evaluation = f"{"sunny" if percent_sunshine > 0.5 else "cloudy"}. "
    sunscreen_needed = f"{"" if percent_sunshine > 0.7 else "Better not forget the sunscreen!"}"
    if wind_speed < 29:
        wind = ""
    elif wind_speed < 49:
        wind = f"There will be moderate wind with a maximum speed of {wind_speed} km/h. "
    else:
        wind = f"There will be strong wind with a maximum speed of {wind_speed} km/h. "
    temperature = f"with a maximum temperature of {max_temperature}°C and a minimum of {min_temperature}°C. "
    rain = f"The probability of rain is {rain_probability}%. "
    umbrella_needed = f"{"" if rain_probability < 50 else "You might want to bring an umbrella!"}"

    response = f"{place_and_time}{sun_evaluation}{sunscreen_needed}{wind}{temperature}{rain}{umbrella_needed}"

    return response

def weather_bot(user_input: str) -> str:
    """
    Generates a weather forecast based on user input.

    Args:
        user_input (str): The user's input.

    Returns:
        str: The weather forecast.

    """
    dates, locations = extract_entities(user_input)
    # TODO: handle missing dates and locations
    
    parsed_dates = parse_dates(dates)
    geo_data = geocode_location(locations)
    weather_data = get_weather_data(
        lon=geo_data[0]["lon"], 
        lat=geo_data[0]["lat"], 
        timezone = "CET", # TODO: fetch from API
        date = str(parsed_dates[0].strftime("%Y-%m-%d")),
        timeframe = "daily" # TODO: choose dynamically based on input
        )

    forecast = construct_weather_forecast(parsed_dates[0], locations[0], weather_data)
    return forecast



if __name__ == "__main__":
    response = weather_bot("What will the weather be like in Prague tomorrow?")
    print(response)


#TODO: CLI - use plotext to draw charts of hourly weather data
#TODO: Implement logging via loguru
