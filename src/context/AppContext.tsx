import React, { createContext, useState, useContext } from "react";

import { useDrawingData } from "@/hooks/useDrawingData";
import type {
  Discipline,
  Metadata,
  NormalizedDrawing,
  Revision,
  OverlayLayer,
} from "@/type";

interface AppContextType {
  metadata: Metadata | null;
  normalizedData: NormalizedDrawing[];
  loading: boolean;
  error: Error | null;
  selectedDrawing: NormalizedDrawing | null;
  setSelectedDrawing: (drawing: NormalizedDrawing | null) => void;
  selectedDiscipline: Discipline | null;
  setSelectedDiscipline: (discipline: Discipline | null) => void;
  selectedRevision: Revision | null;
  setSelectedRevision: (revision: Revision | null) => void;
  isSidebarVisible: boolean;
  toggleSidebar: () => void;
  isCompareMode: boolean;
  setIsCompareMode: (mode: boolean) => void;
  isMultiDisciplineMode: boolean;
  setIsMultiDisciplineMode: (mode: boolean) => void;
  overlayLayers: OverlayLayer[];
  setOverlayLayers: (layers: OverlayLayer[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { metadata, normalizedData, loading, error } = useDrawingData();
  const [selectedDrawing, setSelectedDrawing] =
    useState<NormalizedDrawing | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] =
    useState<Discipline | null>(null);
  const [selectedRevision, setSelectedRevision] = useState<Revision | null>(
    null,
  );
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(true);
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [isMultiDisciplineMode, setIsMultiDisciplineMode] =
    useState<boolean>(false);
  const [overlayLayers, setOverlayLayers] = useState<OverlayLayer[]>([]);

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  return (
    <AppContext.Provider
      value={{
        metadata,
        normalizedData,
        loading,
        error,
        selectedDrawing,
        setSelectedDrawing,
        selectedDiscipline,
        setSelectedDiscipline,
        selectedRevision,
        setSelectedRevision,
        isSidebarVisible,
        toggleSidebar,
        isCompareMode,
        setIsCompareMode,
        isMultiDisciplineMode,
        setIsMultiDisciplineMode,
        overlayLayers,
        setOverlayLayers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
};
