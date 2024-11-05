import express, { Request, Response, NextFunction } from "express";
import { findDates, findPlaces } from "./inputProcessing";
import { isDailyWeatherData } from "./utils";
import { getLogger } from "./logging";
import {
  geocodeLocation,
  getTimezone,
  getWeatherData,
  generateDailyWeatherForecastMessage,
} from "./weatherAndGeo";

const logger = getLogger();
logger.info("Starting server...");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.get("/", async (req: Request, res: Response) => {
  logger.info("Hello, world!");
  res.json({ message: "Hello, world!" });
}),
  app.post("/test", async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info("Received request on endpoint /test");
      const body = req.body;
      const userInput = body.userInput;
      console.log(userInput);

      const places = findPlaces(userInput);
      const place = places[0];
      console.log(place);

      const dates = findDates(userInput);
      const date = dates[0];
      console.log(date);

      const geocodedLocation = await geocodeLocation(place);
      console.log(geocodedLocation);

      const timezone = await getTimezone(
        geocodedLocation.latitude,
        geocodedLocation.longitude
      );
      console.log(timezone);

      const weatherData = await getWeatherData(
        geocodedLocation.latitude,
        geocodedLocation.longitude,
        timezone,
        date,
        "daily"
      );

      console.log(weatherData);
      if (isDailyWeatherData(weatherData)) {
        const weatherMessage = generateDailyWeatherForecastMessage(
          weatherData,
          geocodedLocation,
          date
        );

        console.log(weatherMessage);

        console.log("Sending response on endpoint /test");
        res.json({ message: weatherMessage });
      } else {
        throw new Error("Hourly weather data not supported yet");
      }
    } catch (error) {
      next(error);
    }
  });

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`🦊💻 Server running at http://localhost:${port}`);
});
