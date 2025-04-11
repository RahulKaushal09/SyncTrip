import { encryptData, decryptData } from "./securityStorage.js"; // Assuming you have an encryption service

const cacheKey = "cached_locations";
const cacheExpiryKey = "cached_locations_expiry";
const CACHE_TTL_DAYS = 7;

export const getLocationById = async (locationId) => {
    if (!locationId) return null;

    const now = new Date();

    try {
        const encryptedData = localStorage.getItem(cacheKey);
        const encryptedExpiry = localStorage.getItem(cacheExpiryKey);

        let locations = [];

        if (encryptedData && encryptedExpiry) {
            const expiryDate = decryptData(encryptedExpiry);

            if (expiryDate && new Date(expiryDate) > now) {
                const parsedLocations = decryptData(encryptedData);
                if (parsedLocations && Array.isArray(parsedLocations)) {
                    locations = parsedLocations;
                }
            }
        }

        // If cache is empty or expired, fetch new data
        if (locations.length === 0) {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/locations/getalllocations`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ limit: 100 }),
            });

            if (!response.ok) throw new Error("Failed to fetch locations");

            const data = await response.json();
            locations = data.locations || data;

            const expiryDate = new Date(now.getTime() + CACHE_TTL_DAYS * 24 * 60 * 60 * 1000);
            localStorage.setItem(cacheKey, encryptData(locations));
            localStorage.setItem(cacheExpiryKey, encryptData(expiryDate.toISOString()));
        }

        // Find and return the location by ID
        const location = locations.find(loc => loc._id === locationId);
        return location || null;
    } catch (err) {
        console.error("Error fetching location by ID:", err);
        return null;
    }
};
