// src/context/AppContext.tsx
import React, { createContext, useState, useContext } from "react";
import type { Metadata, NormalizedDrawing, Discipline, Revision } from "./type";
import { useDrawingData } from "../hooks/useDrawingData";
// import type { Metadata,NormalizedDrawing } from "../type";

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
