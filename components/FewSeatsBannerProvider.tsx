"use client";
import { useState, useCallback, ReactNode, createContext, useContext } from "react";
import { NavbarDemo } from "@/components/navbar";

// Create context for the trigger function
const FewSeatsContext = createContext<(() => void) | null>(null);

// Hook to use the context
export const useFewSeatsTrigger = () => {
  const context = useContext(FewSeatsContext);
  if (!context) {
    throw new Error('useFewSeatsTrigger must be used within FewSeatsBannerProvider');
  }
  return context;
};

export default function FewSeatsBannerProvider({ children }: { children: ReactNode }) {
  const [showFewSeatsBanner, setShowFewSeatsBanner] = useState(false);

  const triggerFewSeatsBanner = useCallback(() => {
    setShowFewSeatsBanner(true);
    setTimeout(() => setShowFewSeatsBanner(false), 3000);
  }, []);

  return (
    <FewSeatsContext.Provider value={triggerFewSeatsBanner}>
      {showFewSeatsBanner && (
        <div className="w-full flex justify-center items-center bg-yellow-400 text-black font-bold py-2 animate-pulse z-50">
          Few seats left for Early Bird!
        </div>
      )}
      <NavbarDemo />
      {children}
    </FewSeatsContext.Provider>
  );
} 