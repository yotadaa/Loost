import { useEffect } from "react";


export const useCustomBackButton = (onBack) => {
    useEffect(() => {
        const handlePopState = (event) => {
            event.preventDefault();
            onBack();
        };

        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [onBack]);
};
