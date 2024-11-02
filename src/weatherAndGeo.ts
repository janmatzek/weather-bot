import { requestDataViaAxiosGet } from "./utils";
import { Place } from "./types";

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

  const placeResponse = await requestDataViaAxiosGet({ url, headers, params });
  const places = placeResponse.data;

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

  const timezoneResponse = await requestDataViaAxiosGet({
    url,
    headers,
    params,
  });
  const timezoneData = timezoneResponse.data;

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
): Promise<Record<string, string>> {
  const url = "https://api.open-meteo.com/v1/forecast";

  let metrics = "";
  if (timeframe === "daily") {
    metrics =
      "temperature_2m_max,temperature_2m_min,sunrise,sunset,sunshine_duration,precipitation_probability_max,wind_speed_10m_max";
  } else if (timeframe === "hourly") {
    metrics =
      "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,cloud_cover,visibility";
  } else {
    throw new Error("Timeframe must be either 'daily' or 'hourly'");
  }

  const headers = {};

  const params = {
    latitude: latitude,
    longitude: longitude,
    daily: metrics,
    timezone: timezone,
    start_date: date,
    end_date: date,
  };
  console.log("params", params);
  const meteoResponse = await requestDataViaAxiosGet({ url, headers, params });
  const meteoData = meteoResponse.data;
  if (!meteoData || !meteoData["daily"]) {
    throw new Error("No weather data found");
  }

  return meteoData[timeframe];
}
