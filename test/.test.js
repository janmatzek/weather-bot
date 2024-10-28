const { findDates, findPlaces } = require("../src/inputProcessing");
const { test, expect } = require("@jest/globals");

const textInput =
  "This is a string containing some information which is relevant for June 23rd 2024. It is especially important that we avoid Sao Paulo on that day.";

test("Find date in string", () => {
  expect(findDates(textInput)).toEqual(["2024-06-22"]);
});

test("Find place in string", () => {
  expect(findPlaces(textInput)).toEqual(["Sao Paulo"]);
});
