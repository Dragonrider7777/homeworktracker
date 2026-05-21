const pageSections = {
  home: document.getElementById("home-page"),
  classes: document.getElementById("classes-page")
};

const navLinks = document.querySelectorAll(".nav-link");

function getPageName(path) {
  const normalized = path.replace(/\/+$/, "") || "/";

  if (normalized === "/" || normalized === "/index.html") {
    return "home";
  }
  if (normalized === "/classes" || normalized === "/classes.html") {
    return "classes";
  }
  return "home";
}

function setActiveNav(page) {
  navLinks.forEach((link) => {
    const isActive = link.dataset.page === page;
    link.classList.toggle("active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

function showPage(page, updateHistory = true) {
  Object.entries(pageSections).forEach(([name, section]) => {
    section.classList.toggle("hidden", name !== page);
  });

  setActiveNav(page);

  if (!updateHistory) {
    return;
  }

  const targetPath = page === "home" ? "/" : "/classes";
  if (window.location.pathname !== targetPath) {
    window.history.pushState({ page }, "", targetPath);
  }
}

function handleNavClick(event) {
  const link = event.currentTarget;
  const page = link.dataset.page;

  if (!page) {
    return;
  }

  event.preventDefault();
  showPage(page);
}

window.addEventListener("DOMContentLoaded", () => {
  navLinks.forEach((link) => link.addEventListener("click", handleNavClick));
  showPage(getPageName(window.location.pathname), false);
});

window.addEventListener("popstate", () => {
  showPage(getPageName(window.location.pathname), false);
});
