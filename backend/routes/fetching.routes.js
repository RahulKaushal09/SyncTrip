const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const router = express.Router();

// const app = express();
// const PORT = 3000;

router.get("/getweather", async (req, res) => {
    const locationQuery = "manali";

    try {
        // Step 1: Get location data
        const locationResponse = await axios.post(
            "https://weather.com/api/v1/p/redux-dal",
            [
                {
                    name: "getSunV3LocationSearchUrlConfig",
                    params: {
                        query: locationQuery,
                        language: "en-IN",
                        locationType: "locale",
                    },
                },
            ],
            {
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
                },
            }
        );
        console.log("Location response:", locationResponse.data);
        // Extract placeId from the response
        const placeId =
            locationResponse.data.dal.getSunV3LocationSearchUrlConfig.data.location
                .placeId[0];

        if (!placeId) {
            return res.status(404).json({ error: "Place ID not found" });
        }

        // Step 2: Fetch weather details
        const weatherResponse = await axios.get(
            `https://weather.com/en-IN/weather/tenday/l/${placeId}`,
            {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
                    Accept:
                        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                    "Accept-Encoding": "gzip, deflate, br, zstd",
                    "Accept-Language": "en-US,en;q=0.9",
                    Referer: "https://weather.com/",
                },
            }
        );

        // Step 3: Extract temperature using Cheerio
        const $ = cheerio.load(weatherResponse.data);
        const tempElement = $(".temperature-class-selector"); // Replace with actual class name
        const tempText = tempElement.text().trim();

        res.json({ temperature: tempText || "Temperature not found" });
    } catch (error) {
        console.error("Error fetching weather data:", error);
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
});

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

module.exports = router;
