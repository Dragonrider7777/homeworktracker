import { FaCalendarAlt, FaChartBar, FaCog, FaHome } from "react-icons/fa";

function Sidebar() {
  return (
    <aside className="sidebar">
      <div class="sidebar-container">
        <nav className="sidebar-nav">
          <a className="sidebar-link active" href="#">
            <FaHome /> Assignments
          </a>

          <a className="sidebar-link" href="#">
            <FaCalendarAlt /> Calendar
          </a>

          <a className="sidebar-link" href="#">
            <FaChartBar /> Stats
          </a>

          <a className="sidebar-link" href="#">
            <FaCog /> Settings
          </a>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
