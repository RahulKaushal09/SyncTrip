import React, { useState, useEffect } from "react";
import axios from "axios";
import * as cheerio from "cheerio";

const WeatherComponent = ({ locationQuery }) => {
    const [temperature, setTemperature] = useState(null);
    const [loading, setLoading] = useState(false);
    //   const locationQuery = "manali";

    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);

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
                            // "User-Agent":
                            //     "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
                        },
                    }
                );

                // Extract placeId from the response
                console.log("Location response:", locationResponse.data);

                const placeId =
                    locationResponse.data.dal.getSunV3LocationSearchUrlConfig.data
                        .location.placeId[0];

                if (!placeId) {
                    console.error("Place ID not found");
                    setLoading(false);
                    return;
                }

                // Step 2: Fetch weather details
                const weatherResponse = await axios.get(
                    `https://weather.com/en-IN/weather/tenday/l/${placeId}`,
                    {
                        headers: {
                            Cookie: "usprivacy=1---; ...", // Add required cookies
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

                setTemperature(tempText || "Temperature not found");
            } catch (error) {
                console.error("Error fetching weather data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, []);

    return (
        <div>
            <h2>Weather in Manali</h2>
            {loading ? <p>Loading...</p> : <p>Temperature: {temperature}</p>}
        </div>
    );
};

export default WeatherComponent;
