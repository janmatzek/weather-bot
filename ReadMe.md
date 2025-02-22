# Weather bot

This is a repository for the back and of the _"WeatherBot"_ app.
It uses [Compromise](https://compromise.cool) to parse out dates and city names from a text input.

-   The city is geocoded using the [Nominatim API](https://nominatim.org/).
-   For retrieved geographical coordinates, timezone information is retrieved from [Geotimezone.com](https://www.geotimezone.com/)
-   Weather forecast is fetched for the requested day and place using the [Open Meteo API](https://open-meteo.com/)
-   Structured weather data is converted to human friendly text using [Gemini](https://gemini.google.com/)
