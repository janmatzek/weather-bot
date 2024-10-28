import { findDates, findPlaces } from "./inputProcessing";
import { geocodeLocation } from "./geolocation";

const userInput =
  "This is a string containing some information which is relevant for June 23rd 2024. It is especially important that we avoid Sao Paulo on that day.";

console.log(findPlaces(userInput));
console.log(findDates(userInput));
// console.log(await geocodeLocation("Prague"));
