import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname, state } = useLocation();

    useEffect(() => {
        const typedState = state as { scrollPosition?: number } | null;

        if (typedState?.scrollPosition !== undefined) {
            window.scrollTo(0, typedState.scrollPosition);
        } else {
            window.scrollTo(0, 0);
        }
    }, [pathname, state]);

    return null;
}
