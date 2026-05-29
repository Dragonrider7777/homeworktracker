import { FaCalendarAlt, FaChartBar, FaCog, FaHome } from "react-icons/fa";
import { NavLink } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-container">
        <nav className="sidebar-nav">
          <NavLink to="/" className="sidebar-link">
            <FaHome /> Assignments
          </NavLink>

          <NavLink to="/calendar" className="sidebar-link">
            <FaCalendarAlt /> Calendar
          </NavLink>

          <NavLink to="/stats" className="sidebar-link">
            <FaChartBar /> Stats
          </NavLink>

          <NavLink to="/settings" className="sidebar-link">
            <FaCog /> Settings
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
