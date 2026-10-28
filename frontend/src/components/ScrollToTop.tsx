import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname, state } = useLocation();

    useEffect(() => {
        const typedState = state as { scrollPosition?: number } | null;

        if (typedState?.scrollPosition !== undefined) {
            window.scrollTo({ top: typedState.scrollPosition, left: 0, behavior: "instant" });
        } else {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        }
    }, [pathname, state]);

    return null;
}
