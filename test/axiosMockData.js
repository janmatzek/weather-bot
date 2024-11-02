export const geocodeMockData = {
  data: [
    {
      place_id: 116139408,
      licence:
        "Data © OpenStreetMap contributors, ODbL 1.0. http://osm.org/copyright",
      osm_type: "relation",
      osm_id: 439840,
      lat: "50.0596288",
      lon: "14.446459273258009",
      class: "boundary",
      type: "administrative",
      place_rank: 16,
      importance: 0.7966059304592609,
      addresstype: "suburb",
      name: "Praha",
      display_name: "Praha, obvod Praha 4, Hlavní město Praha, Praha, Česko",
      address: {
        suburb: "Praha",
        city_district: "obvod Praha 4",
        city: "Hlavní město Praha",
        "ISO3166-2-lvl6": "CZ-10",
        state: "Praha",
        country: "Česko",
        country_code: "cz",
      },
      boundingbox: ["49.9419006", "50.1774301", "14.2244355", "14.7067867"],
    },
  ],
};

export const timezoneMockData = {
  data: {
    longitude: 14.446459273258009,
    latitude: 50.0596288,
    location: "Czechia",
    country_iso: "CZ",
    iana_timezone: "Europe/Prague",
    timezone_abbreviation: "CET",
    dst_abbreviation: "CEST",
    offset: "UTC+1",
    dst_offset: "UTC+2",
    current_local_datetime: "2024-11-02T17:21:06.164",
    current_utc_datetime: "2024-11-02T16:21:06.164Z",
  },
};

export const weatherMockData = {
  data: {
    latitude: 50.06,
    longitude: 14.439999,
    generationtime_ms: 0.06103515625,
    utc_offset_seconds: 3600,
    timezone: "Europe/Paris",
    timezone_abbreviation: "CET",
    elevation: 231.0,
    daily_units: {
      time: "iso8601",
      temperature_2m_max: "°C",
      temperature_2m_min: "°C",
      sunrise: "iso8601",
      sunset: "iso8601",
      sunshine_duration: "s",
      precipitation_probability_max: "%",
      wind_speed_10m_max: "km/h",
    },
    daily: {
      time: ["2024-11-03"],
      temperature_2m_max: [9.2],
      temperature_2m_min: [1.0],
      sunrise: ["2024-11-03T06:56"],
      sunset: ["2024-11-03T16:35"],
      sunshine_duration: [22724.99],
      precipitation_probability_max: [0],
      wind_speed_10m_max: [4.8],
    },
  },
};
