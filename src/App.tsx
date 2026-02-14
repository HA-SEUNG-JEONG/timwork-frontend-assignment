import { AppProvider } from "./context/AppContext";
import { TreeView } from "./components/Navigation/TreeView";
import { DrawingViewer } from "./components/Drawing/DrawingViewer";

function App() {
    return (
        <AppProvider>
            <div className="flex h-screen">
                <TreeView />
                <DrawingViewer />
            </div>
        </AppProvider>
    );
}

export default App;
