import { requestDataViaAxiosGet } from "./utils";
import { Place, DailyWeatherData, HourlyWeatherData } from "./types";

const DEFAULT_HEADER = { "User-Agent": "weahterBot/1.0" };
/** 
    Geocodes the given city name using the Nominatim API: https://nominatim.openstreetmap.org/search
    @param {string} cityName The name of the city to geocode.
    @returns {Promise<Place>} 
    **/
export async function geocodeLocation(cityName: string): Promise<Place> {
  const url = "https://nominatim.openstreetmap.org/search";

  const params = {
    q: cityName,
    format: "json",
    addressdetails: 1,
    limit: 1,
  };

  const headers = DEFAULT_HEADER;

  const places = await requestDataViaAxiosGet({ url, headers, params });

  if (!places || places.length === 0) {
    throw new Error(`No geocoded information found for ${cityName}`);
  }

  const place = places[0];

  const geocodedPlace = {
    name: cityName,
    displayName: place.display_name,
    latitude: place.lat,
    longitude: place.lon,
  };

  return geocodedPlace;
}

/**
 * Requests timezone for specified latitude and longitude from https://www.geotimezone.com/
 * @param latitude
 * @param longitude
 * @returns <Promise<string>> Timezone abbreviation
 */
export async function getTimezone(
  latitude: number,
  longitude: number
): Promise<string> {
  const url = "https://api.geotimezone.com/public/timezone";
  const params = { latitude, longitude };
  const headers = DEFAULT_HEADER;

  const timezoneData = await requestDataViaAxiosGet({
    url,
    headers,
    params,
  });

  if (!timezoneData || !timezoneData.iana_timezone) {
    throw new Error(`No timezone data found for ${latitude}, ${longitude}`);
  }

  return timezoneData.iana_timezone;
}

/** Requests weather data from https://open-meteo.com/
  @param {number} latitude Latitude coordinate
  @param {number} longitude Longitude coordinate
  @param {string} timezone Timezone name (e.g., GMT, CET...)
  @param {string} date YYYY-MM-DD
  @param {string} timeframe "hourly" or "daily"
  **/
export async function getWeatherData(
  latitude: number,
  longitude: number,
  timezone: string,
  date: string,
  timeframe: "daily" | "hourly"
): Promise<DailyWeatherData | HourlyWeatherData> {
  const url = "https://api.open-meteo.com/v1/forecast";

  let metrics = {};
  if (timeframe === "daily") {
    metrics = {
      daily:
        "temperature_2m_max,temperature_2m_min,sunrise,sunset,sunshine_duration,precipitation_probability_max,wind_speed_10m_max",
    };
  } else if (timeframe === "hourly") {
    metrics = {
      hourly:
        "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,cloud_cover,visibility",
    };
  } else {
    throw new Error("Timeframe must be either 'daily' or 'hourly'");
  }

  const headers = {};

  const params = {
    latitude: latitude,
    longitude: longitude,
    ...metrics,
    timezone: timezone,
    start_date: date,
    end_date: date,
  };

  const meteoData = await requestDataViaAxiosGet({ url, headers, params });

  if (!meteoData || !meteoData[timeframe]) {
    throw new Error("No weather data found in meteodata response");
  }

  if (timeframe === "daily") {
    const dailyWeatherData: DailyWeatherData = {
      time: meteoData[timeframe].time[0],
      temperature2mMax: meteoData[timeframe].temperature_2m_max[0],
      temperature2mMin: meteoData[timeframe].temperature_2m_min[0],
      sunrise: meteoData[timeframe].sunrise[0],
      sunset: meteoData[timeframe].sunset[0],
      sunshineDuration: meteoData[timeframe].sunshine_duration[0],
      precipitationProbabilityMax:
        meteoData[timeframe].precipitation_probability_max[0],
      windSpeed10mMax: meteoData[timeframe].wind_speed_10m_max[0],
    };

    return dailyWeatherData;
  } else if (timeframe === "hourly") {
    const hourlyWeatherData: HourlyWeatherData = {
      time: meteoData[timeframe].time,
      temperature2m: meteoData[timeframe].temperature_2m,
      relativeHumidity2m: meteoData[timeframe].relative_humidity_2m,
      apparentTemperature: meteoData[timeframe].apparent_temperature,
      precipitationProbability: meteoData[timeframe].precipitation_probability,
      precipitation: meteoData[timeframe].precipitation,
      cloudCover: meteoData[timeframe].cloud_cover,
      visibility: meteoData[timeframe].visibility,
    };
    return hourlyWeatherData;
  }

  throw new Error("No weather data found in meteodata response");
}

/**
 * Generates a message with the weather forecast for the given place and date based on provided daily weather data.
 * @param {DailyWeatherData} weatherData
 * @param {Place} place
 * @param {string} date
 * @returns
 */
export function generateDailyWeatherForecastMessage(
  weatherData: DailyWeatherData,
  place: Place,
  date: string
): string {
  const sunriseDate = new Date(weatherData.sunrise);
  const sunsetDate = new Date(weatherData.sunset);
  const dayDurationSeconds =
    (sunsetDate.getTime() - sunriseDate.getTime()) / 1000;
  const percentSunshine = weatherData.sunshineDuration / dayDurationSeconds;

  const placeAndTime = `The weather in ${place.name} on ${date} will be `;

  const sunEvaluation = `${percentSunshine > 0.5 ? "sunny" : "cloudy"}. `;
  const sunscreenNeeded = `${
    percentSunshine > 0.7 ? "" : "Better not forget the sunscreen! "
  }`;

  let wind = "";
  if (weatherData.windSpeed10mMax < 29) {
    wind = "";
  } else if (weatherData.windSpeed10mMax < 49) {
    wind = `There will be moderate wind with a maximum speed of ${weatherData.windSpeed10mMax} km/h. `;
  } else {
    wind = `There will be strong wind with a maximum speed of ${weatherData.windSpeed10mMax} km/h. `;
  }

  const temperature = `The maximum temperature will reach ${weatherData.temperature2mMax}°C and a minimum will be ${weatherData.temperature2mMin}°C. `;
  const rain = `The probability of rain is ${weatherData.precipitationProbabilityMax}%. `;
  const umbrellaNeeded = `${
    weatherData.precipitationProbabilityMax < 50
      ? ""
      : "You might want to bring an umbrella!"
  }`;

  const weatherForecast = `${placeAndTime}${sunEvaluation}${sunscreenNeeded}${wind}${temperature}${rain}${umbrellaNeeded}`;

  return weatherForecast;
}
