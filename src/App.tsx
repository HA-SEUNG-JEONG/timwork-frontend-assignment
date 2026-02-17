import { TreeView } from "@/components/Navigation/TreeView";
import { DrawingViewer } from "@/components/Drawing/views/DrawingViewer";
import { AppProvider, useAppContext } from "@/context/AppContext";

function AppContent() {
	const { isSidebarVisible, toggleSidebar } = useAppContext();

	return (
		<div className="flex h-screen">
			{isSidebarVisible ? (
				<TreeView />
			) : (
				<button
					onClick={toggleSidebar}
					className="fixed left-4 top-4 z-50 p-3 bg-white text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
					title="사이드바 표시"
					aria-label="사이드바 표시"
				>
					<svg
						className="w-6 h-6"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				</button>
			)}
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
