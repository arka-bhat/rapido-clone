import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { secureStorage } from "./Storage";

type CustomLocation = {
    latitude: number;
    longitude: number;
    address: string;
    heading: number;
} | null;

interface CaptainStoreProps {
    captainUser: any;
    location: CustomLocation;
    onDuty: boolean;
    setCaptainUser: (data: any) => void;
    setOnDuty: (data: boolean) => void;
    setLocation: (data: CustomLocation) => void;
    clearCaptainData: () => void;
}

export const useCaptainStore = create<CaptainStoreProps>()(
    persist(
        (set) => ({
            captainUser: null,
            location: null,
            onDuty: false,
            setCaptainUser: (data) => set({ captainUser: data }),
            setLocation: (data) => set({ location: data }),
            setOnDuty: (data) => set({ onDuty: data }),
            clearCaptainData: () => set({ captainUser: null, location: null, onDuty: false }),
        }),
        {
            name: "captain-store",
            partialize: (state) => ({
                captainUser: state.captainUser,
            }),
            storage: createJSONStorage(() => secureStorage),
        }
    )
);
