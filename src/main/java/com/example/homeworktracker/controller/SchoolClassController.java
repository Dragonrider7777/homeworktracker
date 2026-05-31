package com.example.homeworktracker.controller;

import java.util.List;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.homeworktracker.model.SchoolClass;
import com.example.homeworktracker.service.SchoolClassService;



@RestController
@RequestMapping("/api/classes")
public class SchoolClassController {
  private final SchoolClassService schoolClassService;

  public SchoolClassController(SchoolClassService schoolClassService) {
    this.schoolClassService = schoolClassService;
  }

  @GetMapping
  public List<SchoolClass> getAllSchoolClasses() {
    return schoolClassService.getAllSchoolClasses();
  }

  @PostMapping
  public SchoolClass addSchoolClass(@RequestBody SchoolClass schoolClass) {
    return schoolClassService.addSchoolClass(schoolClass);
  }

  @DeleteMapping("/{id}")
  public boolean deleteAssignment(@PathVariable String id) {
    return schoolClassService.deleteSchoolClass(id);
  }

  @PutMapping("/{id}")
  public SchoolClass updateSchoolClass(@PathVariable String id,
      @RequestBody SchoolClass schoolClass) {
    return schoolClassService.updateSchoolClass(id, schoolClass);
  }
}
