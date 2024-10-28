import axios from "axios";

export async function geocodeLocation(cityName: string): Promise<any> {
  /**
    Geocodes the given city name using the Nominatim API.

    @param city_name: string The name of the city to geocode.

    @returns:
        dict: A dictionary containing the geocoded information for the city.
     */

  const url = "https://nominatim.openstreetmap.org/search";

  const params = {
    q: cityName,
    format: "json",
    addressdetails: 1,
    limit: 1,
  };

  const headers = { "User-Agent": "YourAppName/1.0 (your_email@example.com)" };

  const response = await axios.get(url, { params, headers, timeout: 1000 });

  return await response.data;
}

//     headers = {"User-Agent": "YourAppName/1.0 (your_email@example.com)"}

//     geo_response = requests.get(url, params=params, headers=headers, timeout=10)

//     return geo_response.json()
