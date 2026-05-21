# Homework Tracker

A full-stack homework assignment tracker built with Spring Boot, Maven, HTML, CSS, and JavaScript.

## Features

- Add assignments
- Edit assignments
- Delete assignments
- Mark assignments as done or undo
- Filter by active, overdue, due soon, and completed
- Color-coded assignment status
- JSON file persistence
- Responsive UI

## Tech Stack

- Java
- Spring Boot
- Maven
- HTML
- CSS
- JavaScript

## How to Run

1. Clone the repository
2. Open the project in VS Code
3. Run:

```bash
mvn spring-boot:run
```

4. Open: http://localhost:8080

## Notes

- Assignments are persisted to `data/assignments.json` in the application working directory.
- The home page is available at `/` and the classes page is available at `/classes`.
- Static assets are served from `src/main/resources/static`.
- The app now uses a single page shell at `/` with client-side destination switching for Home and Classes.
