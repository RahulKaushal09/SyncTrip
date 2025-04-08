import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.REACT_APP_LOCAL_ENCRYPTION_KEY || "your-strong-default-key";

export const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decryptData = (cipherText) => {
    try {
        const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decrypted);
    } catch (err) {
        console.error("Decryption failed", err);
        return null;
    }
};