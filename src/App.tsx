import { TreeView } from "./components/Navigation/TreeView";
import { DrawingViewer } from "./components/Drawing/DrawingViewer";
import { AppProvider, useAppContext } from "./context/AppContext";

function AppContent() {
	const { isSidebarVisible } = useAppContext();

	return (
		<div className="flex h-screen">
			{isSidebarVisible && <TreeView />}
			<DrawingViewer />
		</div>
	);
}

function App() {
	return (
		<AppProvider>
			<AppContent />
		</AppProvider>
	);
}

export default App;
