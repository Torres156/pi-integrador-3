import { createContext, useEffect, useState } from "react";

export const themeContext = createContext();
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(null);

    useEffect(() => {
        if (theme !== null) return;
        const storedTheme = localStorage.getItem("theme") ?? "default";
        setTheme((prev) => prev ?? storedTheme);        
    }, [])

    useEffect(() => {
        if (!theme)
            return;
                
        if (theme === 'dark') {
            document.documentElement.setAttribute("data-theme", theme);
            localStorage.setItem("theme", theme);
            return;
        }               

        document.documentElement.removeAttribute("data-theme");
        localStorage.removeItem("theme");

    }, [theme])

    return <themeContext.Provider value={{theme, setTheme}}>{children}</themeContext.Provider>
}
