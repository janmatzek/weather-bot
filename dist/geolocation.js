"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.geocodeLocation = geocodeLocation;
const utils_1 = require("./utils");
async function geocodeLocation(cityName) {
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
    const places = await (0, utils_1.getData)({ url, headers, params });
    if (!places || places.length === 0) {
        throw new Error(`No geocoded information found for ${cityName}`);
    }
    const place = places[0];
    console.dir(place);
    const geocodedPlace = {
        name: cityName,
        displayName: place.display_name,
        latitude: place.lat,
        longitude: place.lon,
    };
    return geocodedPlace;
}
//     headers = {"User-Agent": "YourAppName/1.0 (your_email@example.com)"}
//     geo_response = requests.get(url, params=params, headers=headers, timeout=10)
//     return geo_response.json()
