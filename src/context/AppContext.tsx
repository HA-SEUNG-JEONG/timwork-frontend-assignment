import React, { createContext, useState, useContext } from "react";

import { useDrawingData } from "../hooks/useDrawingData";
import type {
	Discipline,
	Metadata,
	NormalizedDrawing,
	Revision,
} from "../type";

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
	// 사이드바 관련
	isSidebarVisible: boolean;
	toggleSidebar: () => void;
	// 리비전 비교 모드
	isCompareMode: boolean;
	setIsCompareMode: (isCompare: boolean) => void;
	compareRevisionA: Revision | null;
	setCompareRevisionA: (revision: Revision | null) => void;
	compareRevisionB: Revision | null;
	setCompareRevisionB: (revision: Revision | null) => void;
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

	// 리비전 비교 모드
	const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
	const [compareRevisionA, setCompareRevisionA] = useState<Revision | null>(
		null,
	);
	const [compareRevisionB, setCompareRevisionB] = useState<Revision | null>(
		null,
	);

	// 사이드바 토글
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
				compareRevisionA,
				setCompareRevisionA,
				compareRevisionB,
				setCompareRevisionB,
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
