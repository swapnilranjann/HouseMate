import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [primaryColor, setPrimaryColor] = useState(localStorage.getItem('house_theme_color') || '#C2410C');

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', primaryColor);
    
    // Convert hex to rgb for variable opacity usage
    const rgb = hexToRgb(primaryColor);
    if (rgb) {
        document.documentElement.style.setProperty('--primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }

    // Rough calculation for hover (darker)
    const hoverColor = adjustColor(primaryColor, -20);
    document.documentElement.style.setProperty('--primary-hover', hoverColor);
    localStorage.setItem('house_theme_color', primaryColor);
  }, [primaryColor]);

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  function adjustColor(hex, amt) {
    let usePound = false;
    if (hex[0] === "#") {
      hex = hex.slice(1);
      usePound = true;
    }
    let num = parseInt(hex, 16);
    let r = (num >> 16) + amt;
    if (r > 255) r = 255; else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amt;
    if (b > 255) b = 255; else if (b < 0) b = 0;
    let g = (num & 0x0000FF) + amt;
    if (g > 255) g = 255; else if (g < 0) g = 0;
    
    // Fix: correct order is R-G-B
    const newHex = (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
    return (usePound ? "#" : "") + newHex;
  }

  return (
    <ThemeContext.Provider value={{ primaryColor, setPrimaryColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
