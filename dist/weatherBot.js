"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPlaces = findPlaces;
exports.findDates = findDates;
const compromise_1 = __importDefault(require("compromise"));
const compromise_dates_1 = __importDefault(require("compromise-dates"));
compromise_1.default.extend(compromise_dates_1.default);
function findPlaces(input) {
    const doc = (0, compromise_1.default)(input);
    const places = doc.places();
    return places.out("array")[0];
}
function findDates(input) {
    const doc = (0, compromise_1.default)(input);
    const dates = doc.dates().json();
    return dates[0].dates.start;
}