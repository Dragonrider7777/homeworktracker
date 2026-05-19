let currentAssignments = [];
let currentFilter = "active";
let editingId = null;

window.addEventListener("DOMContentLoaded", loadAssignments);

// ---------- LOAD ----------

async function loadAssignments() {
  const list = document.getElementById("list");
  list.innerHTML = "<li>Loading...</li>";

  try {
    const res = await fetch("/api/assignments");
    currentAssignments = await res.json();
    updateActiveFilterButton();
    renderAssignments();
  } catch (e) {
    console.error(e);
    list.innerHTML = `
      <div class="empty-state">
      <div class="empty-state-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <div class="empty-state-title">
        Could not load assignments
      </div>

      <div class="empty-state-text">
        ${e.message}
      </div>
    </div>
  `;
  }
}

// ---------- RENDER ----------

function renderAssignments() {
  const list = document.getElementById("list");
  const summary = document.getElementById("list-summary");

  list.innerHTML = "";

  const filtered = currentAssignments.filter(matchesFilter);

  const completedHidden = getCompletedCount(currentAssignments);

  if (currentFilter === "active" && completedHidden > 0) {
    summary.textContent = `${completedHidden} completed assignment(s) hidden`;
  } else {
    summary.textContent = "";
  }

  if (!filtered.length) {
    renderEmptyState(currentFilter);
    return;
  }

  filtered.forEach((assignment) => {
    const li = document.createElement("li");
    li.classList.add("assignment-card");

    li.classList.add(getStateClass(assignment));

    const cardContent = document.createElement("div");
    cardContent.classList.add("assignment-content");

    const title = document.createElement("div");
    title.classList.add("assignment-title", "assignment-strikethrough");
    title.textContent = assignment.title;

    const details = document.createElement("div");
    details.classList.add("assignment-details");
    details.textContent = `${assignment.course} • Due: ${formatDate(assignment.dueDate)}`;

    details.innerHTML = `
      <span>${assignment.course}</span>
      <span>•</span>
      <span>Due ${formatDate(assignment.dueDate)}</span>
    `;

    const badge = document.createElement("span");
    badge.classList.add("status-badge", getStateClass(assignment));
    badge.textContent = formatStatus(assignment.status);

    const actions = document.createElement("div");
    actions.classList.add("assignment-actions");

    const doneBtn = document.createElement("button");
    doneBtn.classList.add("assignment-btn");

    if (assignment.completed) {
      doneBtn.textContent = "Undo";
      doneBtn.addEventListener("click", () => markTodo(assignment.id));
    } else {
      doneBtn.textContent = "Done";
      doneBtn.addEventListener("click", () => markDone(assignment.id));
    }

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => startEdit(assignment));
    editBtn.classList.add("assignment-btn");

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.addEventListener("click", () => deleteAssignment(assignment.id));
    delBtn.classList.add("assignment-btn", "delete-btn");

    actions.appendChild(doneBtn);
    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    cardContent.appendChild(title);
    cardContent.appendChild(details);
    cardContent.appendChild(badge);

    li.appendChild(cardContent);
    li.appendChild(actions);

    list.appendChild(li);
  });
}

// ---------- ADD ----------

window.add = async function () {
  const title = document.getElementById("title").value.trim();
  const course = document.getElementById("course").value.trim();
  const dueDate = document.getElementById("dueDate").value || null;
  const source = document.getElementById("source").value.trim() || "MANUAL";

  if (!title) {
    alert("Title is required");
    return;
  }

  if (!course) {
    alert("Course is required");
    return;
  }

  const assignmentData = {
    title,
    course,
    dueDate,
    source
  };

  let response;

  if (editingId) {
    response = await fetch(`/api/assignments/${editingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(assignmentData)
    });
  } else {
    response = await fetch("/api/assignments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(assignmentData)
    });
  }

  if (!response.ok) {
    const errorText = await response.text();
    alert("Could not save assignment: " + errorText);
    return;
  }

  const wasEditing = editingId !== null;

  clearInputs();
  setFormMode("add");

  await loadAssignments();

  showToast(wasEditing ? "Assignment updated" : "Assignment added", "success");
};

// ---------- EDIT ----------

function startEdit(assignment) {
  editingId = assignment.id;

  document.getElementById("title").value = assignment.title || "";
  document.getElementById("course").value = assignment.course || "";
  document.getElementById("dueDate").value = assignment.dueDate || "";
  document.getElementById("source").value = assignment.source || "";

  setFormMode("edit");
}

function setFormMode(mode) {
  const btn = document.getElementById("submit-btn");

  if (mode === "edit") {
    btn.textContent = "Save";
  } else {
    btn.textContent = "Add";
  }
}

// ---------- DELETE ----------

async function deleteAssignment(id) {
  const confirmed = confirm("Delete this assignment?");
  if (!confirmed) return;

  const response = await fetch(`/api/assignments/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    showToast("Could not delete assignment", "error");
    return;
  }

  await loadAssignments();
  showToast("Assignment deleted", "warning");
}

// ---------- STATUS ----------

async function markDone(id) {
  const response = await fetch(`/api/assignments/${id}/done`, {
    method: "PATCH"
  });

  if (!response.ok) {
    showToast("Could not mark assignment done", "error");
    return;
  }

  await loadAssignments();

  showToast(
    'Assignment completed <i class="fa-solid fa-circle-check"></i>',
    "success"
  );
}

async function markTodo(id) {
  const response = await fetch(`/api/assignments/${id}/todo`, {
    method: "PATCH"
  });

  if (!response.ok) {
    showToast("Could not restore assignment", "error");
    return;
  }

  await loadAssignments();

  showToast(
    'Assignment restored <i class="fa-solid fa-rotate-left"></i>',
    "warning"
  );
}

// Helper function to refresh the assignment list after performing an action
// Also checks for errors and displays an alert if the request failed
async function refreshAfterRequest(promise) {
  const response = await promise;

  if (!response.ok) {
    const errorText = await response.text();
    alert("Request failed: " + errorText);
    return;
  }

  await loadAssignments();
}

// ---------- UTIL ----------

// Function to clear the input fields and reset form state
function clearInputs() {
  ["title", "course", "dueDate", "source"].forEach((id) => {
    document.getElementById(id).value = "";
  });

  editingId = null;
  setFormMode("add");
}

// Formats date strings in a more readable way
function formatDate(str) {
  if (!str) return "No date";

  const d = new Date(str);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatStatus(status) {
  if (status === "DUE_SOON") return "Due Soon";
  if (status === "NO_DUE_DATE") return "No Due Date";
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function getCompletedCount(assignments) {
  return assignments.filter((assignment) => assignment.completed).length;
}

// Returns a CSS class based on the assignment's status
function getStateClass(assignment) {
  if (assignment.completed) return "completed";
  else if (assignment.status === "OVERDUE") return "overdue";
  else if (assignment.status === "DUE_SOON") return "due-soon";
  else if (assignment.status === "NO_DUE_DATE") return "no-date";
  return "upcoming";
}

function matchesFilter(assignment) {
  switch (currentFilter) {
    case "all":
      return true;
    case "active":
      return !assignment.completed;
    case "completed":
      return assignment.completed;
    case "overdue":
      return assignment.status === "OVERDUE";
    case "due-soon":
      return assignment.status === "DUE_SOON";
    default:
      return true;
  }
}

function showToast(message, type = "success") {
  const container = document.getElementById("toast-container");

  if (!container) {
    console.error("Toast container not found");
    return;
  }

  const toast = document.createElement("div");
  toast.classList.add("toast", type);
  toast.innerHTML = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ---------- FILTER ----------

window.setFilter = function (filter) {
  currentFilter = filter;
  updateActiveFilterButton();
  renderAssignments();
};

function updateActiveFilterButton() {
  const buttons = document.querySelectorAll(".filter-btn");
  buttons.forEach((btn) => {
    if (btn.dataset.filter === currentFilter) {
      btn.classList.add("active-filter");
    } else {
      btn.classList.remove("active-filter");
    }
  });
}

function renderEmptyState(filter) {
  const list = document.getElementById("list");

  const states = {
    all: {
      icon: "fa-book",
      title: "No assignments yet",
      text: "Add your first assignment to get started."
    },

    active: {
      icon: "fa-circle-check",
      title: "All caught up",
      text: "You have no active assignments."
    },

    completed: {
      icon: "fa-inbox",
      title: "No completed assignments",
      text: "Finished work will appear here."
    },

    overdue: {
      icon: "fa-clock",
      title: "No overdue assignments",
      text: "Nice work staying on schedule."
    },

    "due-soon": {
      icon: "fa-calendar",
      title: "Nothing due soon",
      text: "You have some breathing room."
    }
  };

  const state = states[filter] || states.all;

  list.innerHTML = `
    <li class="empty-wrapper">
      <div class="empty-state">

        <div class="empty-state-icon">
          <i class="fa-solid ${state.icon}"></i>
        </div>

        <div class="empty-state-title">
          ${state.title}
        </div>

        <div class="empty-state-text">
          ${state.text}
        </div>

      </div>
    </li>
  `;
}
