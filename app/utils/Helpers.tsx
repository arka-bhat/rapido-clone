import { Href, Router, router } from "expo-router";

export const resetAndNavigate = (newPath: Href) => {
    if (router.canGoBack()) {
        router.dismissAll();
    }
    router.replace(newPath);
};
