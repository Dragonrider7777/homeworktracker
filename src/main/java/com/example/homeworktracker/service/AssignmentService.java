package com.example.homeworktracker.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import com.example.homeworktracker.model.Assignment;
import com.example.homeworktracker.model.AssignmentStatus;
import com.example.homeworktracker.model.Priority;
import com.example.homeworktracker.storage.AssignmentStorage;

/**
 * Service class for managing assignments. It provides methods to add, update, delete, and retrieve
 * assignments. It also handles the business logic for sorting and filtering assignments based on
 * their status and priority.
 */

@Service
public class AssignmentService {
    private final List<Assignment> assignments = new ArrayList<>();
    private final AssignmentStorage assignmentStorage;

    // Constructor that initializes the service with the provided AssignmentStorage and loads
    // existing assignments
    public AssignmentService(AssignmentStorage assignmentStorage) {
        this.assignmentStorage = assignmentStorage;
        this.assignments.addAll(assignmentStorage.loadAssignments());
    }

    public List<Assignment> getAllAssignments() {
        return assignments.stream().sorted(this::compareAssignments).toList();
    }

    public List<Assignment> getActiveAssignments() {
        return getAllAssignments().stream().filter(a -> !a.isCompleted()).toList();
    }

    public List<Assignment> getCompletedAssignments() {
        return getAllAssignments().stream().filter(Assignment::isCompleted).toList();
    }

    public List<Assignment> getOverdueAssignments() {
        return getAllAssignments().stream().filter(a -> a.getStatus() == AssignmentStatus.OVERDUE)
                .toList();
    }

    public Assignment addAssignment(Assignment assignment) {
        validateAssignment(assignment);

        if (assignment.getId() == null || assignment.getId().isBlank()) {
            assignment.setId(UUID.randomUUID().toString());
        }

        if (assignment.getSource() == null || assignment.getSource().isBlank()) {
            assignment.setSource("MANUAL");
        }

        assignments.add(assignment);
        assignmentStorage.saveAssignments(assignments);
        return assignment;
    }

    public boolean markCompleted(String id) {
        Assignment assignment = findbyId(id);

        if (assignment == null) {
            return false;
        }

        assignment.setCompleted(true);
        assignmentStorage.saveAssignments(assignments);
        return true;
    }

    public boolean markTodo(String id) {
        Assignment assignment = findbyId(id);

        if (assignment == null) {
            return false;
        }

        assignment.setCompleted(false);
        assignmentStorage.saveAssignments(assignments);
        return true;
    }

    public boolean deleteAssignment(String id) {
        boolean removed = assignments.removeIf(a -> a.getId().equals(id));

        if (removed) {
            assignmentStorage.saveAssignments(assignments);
        }

        return removed;
    }

    public Assignment updateAssignment(String id, Assignment updated) {
        Assignment existing = findbyId(id);

        if (existing == null) {
            return null;
        }

        validateAssignment(updated);

        existing.setTitle(updated.getTitle());
        existing.setCourse(updated.getCourse());
        existing.setDueDate(updated.getDueDate());
        existing.setSource(updated.getSource());

        assignmentStorage.saveAssignments(assignments);
        return existing;
    }

    private Assignment findbyId(String id) {
        return assignments.stream().filter(a -> a.getId().equals(id)).findFirst().orElse(null);
    }

    private void validateAssignment(Assignment assignment) {
        if (assignment.getTitle() == null || assignment.getTitle().isBlank()) {
            throw new IllegalArgumentException("Assignment title is required");
        }
        if (assignment.getCourse() == null || assignment.getCourse().isBlank()) {
            throw new IllegalArgumentException("Assignment course is required");
        }
    }

    private int compareAssignments(Assignment a, Assignment b) {
        int priorityCompare =
                Integer.compare(getPriorityRank(a.getPriority()), getPriorityRank(b.getPriority()));

        if (priorityCompare != 0) {
            return priorityCompare;
        }

        Comparator<Assignment> dueDateComparator = Comparator.comparing(Assignment::getDueDate,
                Comparator.nullsLast(Comparator.naturalOrder()));

        return dueDateComparator.compare(a, b);
    }

    private int getPriorityRank(Priority priority) {
        return switch (priority) {
            case CRITICAL -> 1;
            case HIGH -> 2;
            case MEDIUM -> 3;
            case LOW -> 4;
        };
    }
}
