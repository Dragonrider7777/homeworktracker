function FilterBar({ currentFilter, setCurrentFilter }) {
  const filters = ["all", "active", "overdue", "due-soon", "completed"];

  return (
    <div id="filters">
      {filters.map((filter) => (
        <button
          key={filter}
          className={
            currentFilter === filter ? "active-filter filter-btn" : "filter-btn"
          }
          onClick={() => setCurrentFilter(filter)}
        >
          {filter === "due-soon"
            ? "Due Soon"
            : filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );
}

export default FilterBar;
