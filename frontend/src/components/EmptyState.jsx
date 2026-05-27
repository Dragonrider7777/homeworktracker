import {
  FaCheckCircle,
  FaClipboardList,
  FaClock,
  FaExclamationTriangle,
  FaInbox
} from "react-icons/fa";

function EmptyState({ filter }) {
  const emptyStates = {
    all: {
      icon: <FaInbox />,
      title: "No assignments yet",
      message:
        "Add your first assignment below to start tracking your homework."
    },
    active: {
      icon: <FaClipboardList />,
      title: "No active assignments",
      message: "You're all caught up. Nice work!"
    },
    overdue: {
      icon: <FaExclamationTriangle />,
      title: "No overdue assignments",
      message: "Nothing is late right now. Keep up the good work!"
    },
    "due-soon": {
      icon: <FaClock />,
      title: "No upcoming assignments",
      message: "You do not have any assignments due soon."
    },
    completed: {
      icon: <FaCheckCircle />,
      title: "No completed assignments",
      message: "Completed assignments will show up here."
    }
  };

  const state = emptyStates[filter];

  return (
    <li className="empty-state">
      <div className="empty-state-icon">{state.icon}</div>
      <h3>{state.title}</h3>
      <p>{state.message}</p>
    </li>
  );
}

export default EmptyState;
