import { createContext, useContext, type ReactNode } from "react";

interface ReadOnlyModeContextType {
  readOnlyMode: boolean;
}

const ReadOnlyModeContext = createContext<ReadOnlyModeContextType>({ readOnlyMode: false });

interface ReadOnlyModeProviderProps {
  children: ReactNode;
  readOnly?: boolean;
}

export function ReadOnlyModeProvider({ children, readOnly = false }: ReadOnlyModeProviderProps) {
  return (
    <ReadOnlyModeContext.Provider value={{ readOnlyMode: readOnly }}>
      {children}
    </ReadOnlyModeContext.Provider>
  );
}

export function useReadOnlyMode() {
  return useContext(ReadOnlyModeContext);
}
