import express, { Request, Response, NextFunction } from "express";
import { findDates, findPlaces } from "./inputProcessing";
import { geocodeLocation, getTimezone, getWeatherData } from "./weatherAndGeo";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.post(
  "/test-dates",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userInput =
        "What will the weather be like in Prague on November 4th?";
      const dates = findDates(userInput);
      res.json({ dates });
    } catch (error) {
      next(error);
    }
  }
);
app.post("/test", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userInput =
      "What will the weather be like in Prague on November 4th?";

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

    res.json({ message: "Test successful" });
  } catch (error) {
    next(error);
  }
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`🦊 Server running at http://localhost:${port}`);
});
