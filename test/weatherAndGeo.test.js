const {
  geocodeLocation,
  getTimezone,
  getWeatherData,
} = require("../src/weatherAndGeo");
const {
  geocodeMockData,
  timezoneMockData,
  weatherMockData,
} = require("../test/axiosMockData");
const axios = require("axios");

jest.mock("axios");

test("Geocode location", async () => {
  axios.get.mockResolvedValue(geocodeMockData);

  const geocodedPlace = await geocodeLocation("Prague");

  expect(geocodedPlace).toEqual({
    name: "Prague",
    displayName: "Praha, obvod Praha 4, Hlavní město Praha, Praha, Česko",
    latitude: "50.0596288",
    longitude: "14.446459273258009",
  });
});

test("Get timezone", async () => {
  axios.get.mockResolvedValue(timezoneMockData);

  const latitude = "50.0596288";
  const longitude = "14.446459273258009";

  const timezone = await getTimezone(latitude, longitude);

  expect(timezone).toEqual("Europe/Prague");
});

test("Get daily weather data", async () => {
  axios.get.mockResolvedValue(weatherMockData);
  const weatherData = await getWeatherData(
    14.446459273258009,
    50.0596288,
    "Europe/Prague",
    "2024-11-03",
    "daily"
  );
  expect(weatherData).toEqual({
    time: "2024-11-03",
    temperature2mMax: 9.2,
    temperature2mMin: 1.0,
    sunrise: "2024-11-03T06:56",
    sunset: "2024-11-03T16:35",
    sunshineDuration: 22724.99,
    precipitationProbabilityMax: 0,
    windSpeed10mMax: 4.8,
  });
});

// TODO: tests hourly weather data
