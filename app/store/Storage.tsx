// import { MMKV } from "react-native-mmkv";

// export const tokenStorage = new MMKV({
//     id: "token-storage",
//     encryptionKey: "secret",
// });

// export const storage = new MMKV({
//     id: "app-storage",
//     encryptionKey: "secret",
// });

// export const mmkvStorage = {
//     setItem: (key: string, value: boolean | string | number | ArrayBuffer) => {
//         storage.set(key, value);
//     },
//     getItem: (key: string) => {
//         return storage.getString(key) ?? null;
//     },
//     removeItem: (key: string) => {
//         storage.delete(key);
//     },
// };

import * as SecureStore from "expo-secure-store";

const TOKEN_KEYS = ["access_token", "refresh_token"]; // Add all token keys here

export const tokenStorage = {
    getString: async (key: string) => {
        try {
            return await SecureStore.getItemAsync(key);
        } catch (error) {
            console.error("Error getting token:", error);
            return null;
        }
    },
    set: async (key: string, value: string) => {
        try {
            await SecureStore.setItemAsync(key, value);
        } catch (error) {
            console.error("Error setting token:", error);
        }
    },
    clearAll: async () => {
        try {
            const deletePromises = TOKEN_KEYS.map((key) => SecureStore.deleteItemAsync(key));
            await Promise.all(deletePromises);
        } catch (error) {
            console.error("Error clearing tokens:", error);
        }
    },
};

export const secureStorage = {
    setItem: async (key: string, value: string) => {
        await SecureStore.setItemAsync(key, value);
    },
    getItem: async (key: string) => {
        return await SecureStore.getItemAsync(key);
    },
    removeItem: async (key: string) => {
        await SecureStore.deleteItemAsync(key);
    },
};
