import pandas as pd
import requests

# pd.set_option('display.max_columns', None)

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



get_weather_data(lon=13.41, lat=52.52, timezone="CET", date="2024-07-10", timeframe="daily")