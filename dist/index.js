"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const weatherBot_1 = require("./weatherBot");
const userInput = "What will the weather be in Prague tomorrow?";
console.log((0, weatherBot_1.findPlaces)(userInput));
console.log((0, weatherBot_1.findDates)(userInput));
