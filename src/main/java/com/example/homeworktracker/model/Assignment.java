package com.example.homeworktracker.model;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

public class Assignment {
    private String id;
    private String title;
    private String course;
    private LocalDate dueDate;
    private String source;
    private boolean completed;

    // Blank constructor for JSON deserialization
    public Assignment() {
        this.id = UUID.randomUUID().toString();
        this.source = "MANUAL";
    }

    // Constructor with parameters
    public Assignment(String title, String course, LocalDate dueDate, String source) {
        this.id = UUID.randomUUID().toString();
        this.title = title;
        this.course = course;
        this.dueDate = dueDate;
        this.source = source == null || source.isBlank() ? "MANUAL" : source;
        this.completed = false;
    }

    // Get days until assignment due date
    public long getDaysLeft() {
        if (dueDate == null) {
            return 0;
        }
        return ChronoUnit.DAYS.between(LocalDate.now(), dueDate);
    }

    public AssignmentStatus getStatus() {
        if (completed) {
            return AssignmentStatus.COMPLETED;
        }
        if (dueDate == null) {
            return AssignmentStatus.NO_DUE_DATE;
        }

        long daysLeft = getDaysLeft();

        if (daysLeft < 0) {
            return AssignmentStatus.OVERDUE;
        } else if (daysLeft <= 3) {
            return AssignmentStatus.DUE_SOON;
        } else {
            return AssignmentStatus.UPCOMING;
        }
    }

    public Priority getPriority() {
        if (completed)
            return Priority.LOW;
        if (dueDate == null)
            return Priority.LOW;

        long daysLeft = getDaysLeft();

        if (daysLeft < 0) {
            return Priority.CRITICAL;
        } else if (daysLeft <= 1) {
            return Priority.HIGH;
        } else if (daysLeft <= 3) {
            return Priority.MEDIUM;
        } else {
            return Priority.LOW;
        }
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCourse() {
        return course;
    }

    public void setCourse(String course) {
        this.course = course;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}