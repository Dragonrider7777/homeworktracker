import { Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AssignmentsPage from "./pages/AssignmentsPage";
import CalendarPage from "./pages/CalendarPage";
import SettingsPage from "./pages/SettingsPage";
import StatsPage from "./pages/StatsPage";

function App() {
  return (
    <>
      <Sidebar />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<AssignmentsPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
