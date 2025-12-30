import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { restaurantInfo } from "@/data/menuData";
import { getOpenState, formatNextOpenTime, getMinutesUntilOpen } from "@/utils/openState";

interface OpenStateContextType {
  isOpen: boolean;
  nextOpenDateTime: Date | null;
  currentWindowEnd: Date | null;
  nextOpenTimeFormatted: { time: string; day?: string } | null;
  minutesUntilOpen: number;
  showClosedPopup: boolean;
  hasShownClosedPopup: boolean;
  triggerClosedPopup: () => void;
  dismissClosedPopup: () => void;
  openInfoModal: () => void;
}

const OpenStateContext = createContext<OpenStateContextType | undefined>(undefined);

interface OpenStateProviderProps {
  children: ReactNode;
  onOpenInfo?: () => void;
}

export function OpenStateProvider({ children, onOpenInfo }: OpenStateProviderProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [nextOpenDateTime, setNextOpenDateTime] = useState<Date | null>(null);
  const [currentWindowEnd, setCurrentWindowEnd] = useState<Date | null>(null);
  const [showClosedPopup, setShowClosedPopup] = useState(false);
  const [hasShownClosedPopup, setHasShownClosedPopup] = useState(false);
  const [minutesUntilOpen, setMinutesUntilOpen] = useState(0);

  const updateOpenState = useCallback(() => {
    const now = new Date();
    const state = getOpenState(restaurantInfo.weeklyHours, now);
    
    setIsOpen(state.isOpen);
    setNextOpenDateTime(state.nextOpenDateTime);
    setCurrentWindowEnd(state.currentWindowEnd);
    
    if (state.nextOpenDateTime) {
      setMinutesUntilOpen(getMinutesUntilOpen(state.nextOpenDateTime, now));
    } else {
      setMinutesUntilOpen(0);
    }
  }, []);

  // Initial check and periodic updates
  useEffect(() => {
    updateOpenState();
    
    // Update every 60 seconds
    const interval = setInterval(updateOpenState, 60000);
    
    return () => clearInterval(interval);
  }, [updateOpenState]);

  // Reset session flag when store opens
  useEffect(() => {
    if (isOpen) {
      setHasShownClosedPopup(false);
      setShowClosedPopup(false);
    }
  }, [isOpen]);

  const triggerClosedPopup = useCallback(() => {
    if (!isOpen && !hasShownClosedPopup) {
      setShowClosedPopup(true);
      setHasShownClosedPopup(true);
    }
  }, [isOpen, hasShownClosedPopup]);

  const dismissClosedPopup = useCallback(() => {
    setShowClosedPopup(false);
  }, []);

  const openInfoModal = useCallback(() => {
    setShowClosedPopup(false);
    onOpenInfo?.();
  }, [onOpenInfo]);

  const nextOpenTimeFormatted = nextOpenDateTime
    ? formatNextOpenTime(nextOpenDateTime)
    : null;

  return (
    <OpenStateContext.Provider
      value={{
        isOpen,
        nextOpenDateTime,
        currentWindowEnd,
        nextOpenTimeFormatted,
        minutesUntilOpen,
        showClosedPopup,
        hasShownClosedPopup,
        triggerClosedPopup,
        dismissClosedPopup,
        openInfoModal,
      }}
    >
      {children}
    </OpenStateContext.Provider>
  );
}

export function useOpenState() {
  const context = useContext(OpenStateContext);
  if (!context) {
    throw new Error("useOpenState must be used within an OpenStateProvider");
  }
  return context;
}
