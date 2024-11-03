"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const inputProcessing_1 = require("./inputProcessing");
const geolocation_1 = require("./geolocation");
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.post("/test", async (req, res, next) => {
    try {
        const userInput = "This is a string containing some information which is relevant for June 23rd 2024. It is especially important that we avoid Sao Paulo on that day.";
        console.log((0, inputProcessing_1.findPlaces)(userInput));
        console.log((0, inputProcessing_1.findDates)(userInput));
        console.log(await (0, geolocation_1.geocodeLocation)("Prague"));
        res.json({ message: "Test successful" });
    }
    catch (error) {
        next(error);
    }
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});
app.listen(port, () => {
    console.log(`🦊 Server running at http://localhost:${port}`);
});
