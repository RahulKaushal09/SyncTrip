import { encryptData, decryptData } from "./securityStorage.js"; // Assuming you have an encryption service

const CACHE_KEY = process.env.REACT_APP_CACHE_KEY || 'cached_locations';
const CACHE_EXPIRY_KEY = process.env.REACT_APP_CACHE_EXPIRY_KEY || 'cached_locations_expiry';
const CACHE_TTL_DAYS = 30;

export const getLimitByDevice = () => (window.innerWidth <= 768 ? 8 : 12);
export const getLocationById = async (locationId) => {
    if (!locationId) return null;

    const now = new Date();
    const encrypted = localStorage.getItem(CACHE_KEY);
    const expiryEncrypted = localStorage.getItem(CACHE_EXPIRY_KEY);

    let locations = [];

    if (encrypted && expiryEncrypted) {
        const expiry = decryptData(expiryEncrypted);
        if (expiry && new Date(expiry) > now) {
            const parsed = decryptData(encrypted);
            if (parsed && Array.isArray(parsed)) {
                locations = parsed;
            }
        }
    }

    const found = locations.find(loc => loc._id === locationId);
    if (found) return found;

    const res = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/locations/getById`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: locationId }),
    });

    if (!res.ok) throw new Error("Failed to fetch location");
    const newLocation = await res.json();

    // Merge into cache only if not present
    const updated = mergeLocationsIntoCache([newLocation]);
    return updated.find(loc => loc._id === locationId);
};
// export const getLocationById = async (locationId) => {
//     if (!locationId) return null;

//     const now = new Date();

//     try {
//         const encryptedData = localStorage.getItem(cacheKey);
//         const encryptedExpiry = localStorage.getItem(cacheExpiryKey);

//         let locations = [];

//         if (encryptedData && encryptedExpiry) {
//             const expiryDate = decryptData(encryptedExpiry);

//             if (expiryDate && new Date(expiryDate) > now) {
//                 const parsedLocations = decryptData(encryptedData);
//                 if (parsedLocations && Array.isArray(parsedLocations)) {
//                     locations = parsedLocations;
//                 }
//             }
//         }

//         // If cache is empty or expired, fetch new data
//         if (locations.length === 0) {
//             const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/locations/getalllocations`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ limit: 100 }),
//             });

//             if (!response.ok) throw new Error("Failed to fetch locations");

//             const data = await response.json();
//             locations = data.locations || data;

//             const expiryDate = new Date(now.getTime() + CACHE_TTL_DAYS * 24 * 60 * 60 * 1000);
//             localStorage.setItem(cacheKey, encryptData(locations));
//             localStorage.setItem(cacheExpiryKey, encryptData(expiryDate.toISOString()));
//         }

//         // Find and return the location by ID
//         const location = locations.find(loc => loc._id === locationId);
//         return location || null;
//     } catch (err) {
//         console.error("Error fetching location by ID:", err);
//         return null;
//     }
// };

export const fetchLocations = async (skip = 0, limit = 12) => {
    const now = new Date();
    const encrypted = localStorage.getItem(process.env.REACT_APP_CACHE_KEY || 'cached_locations');
    const expiryEncrypted = localStorage.getItem(process.env.REACT_APP_CACHE_EXPIRY_KEY || 'cached_locations_expiry');

    let cachedLocations = [];
    if (encrypted && expiryEncrypted) {
        const expiry = decryptData(expiryEncrypted);
        if (expiry && new Date(expiry) > now) {
            cachedLocations = decryptData(encrypted) || [];

            // ✅ If requested range exists in cache, return only that slice
            if (cachedLocations.length >= skip + limit) {
                return {
                    locations: cachedLocations.slice(skip, skip + limit),
                    hasMore: cachedLocations.length > skip + limit,
                    fromCache: true
                };
            }
        }
    }

    // ✅ Else fallback to API call
    const response = await fetch(`${process.env.REACT_APP_BACKEND_BASE_URL}/api/locations/getalllocations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skip, limit })
    });

    if (!response.ok) throw new Error("Failed to fetch locations");

    const data = await response.json();
    return { locations: data.locations || data, hasMore: data.hasMore || false, fromCache: false };
};
export const AllfetchLocations = async (skip = 0, limit = 100) => {
    var allLocations = await fetchLocations(skip, limit);

    allLocations = mergeLocationsIntoCache(allLocations.locations);
    return allLocations;

};
export const mergeLocationsIntoCache = (newLocations) => {
    const now = new Date();
    const existingEncrypted = localStorage.getItem(CACHE_KEY);
    const existingExpiryEncrypted = localStorage.getItem(CACHE_EXPIRY_KEY);
    let mergedLocations = [];

    if (existingEncrypted && existingExpiryEncrypted) {
        const existing = decryptData(existingEncrypted);
        mergedLocations = Array.isArray(existing) ? existing : [];
    }

    const combined = [
        ...mergedLocations,
        ...newLocations.filter(
            newLoc => !mergedLocations.find(oldLoc => oldLoc._id === newLoc._id)
        ),
    ];

    const expiryDate = new Date(now.getTime() + CACHE_TTL_DAYS * 24 * 60 * 60 * 1000);
    localStorage.setItem(CACHE_KEY, encryptData(combined));
    localStorage.setItem(CACHE_EXPIRY_KEY, encryptData(expiryDate.toISOString()));

    return combined;
};