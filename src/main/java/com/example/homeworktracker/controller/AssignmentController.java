package com.example.homeworktracker.controller;

import com.example.homeworktracker.model.Assignment;
import com.example.homeworktracker.service.AssignmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    private final AssignmentService assignmentService;

    public AssignmentController(AssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    @GetMapping
    public List<Assignment> getAllAssignments() {
        return assignmentService.getAllAssignments();
    }

    @PostMapping
    public Assignment addAssignment(@RequestBody Assignment assignment) {
        return assignmentService.addAssignment(assignment);
    }

    @PatchMapping("/{id}/done")
    public boolean markDone(@PathVariable String id) {
        return assignmentService.markCompleted(id);
    }

    @PatchMapping("/{id}/todo")
    public boolean markTodo(@PathVariable String id) {
        return assignmentService.markTodo(id);
    }

    @DeleteMapping("/{id}")
    public boolean deleteAssignment(@PathVariable String id) {
        return assignmentService.deleteAssignment(id);
    }

    @PutMapping("/{id}")
    public Assignment updateAssignment(
            @PathVariable String id,
            @RequestBody Assignment assignment) {
        return assignmentService.updateAssignment(id, assignment);
    }
}