package com.example.homeworktracker.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import com.example.homeworktracker.model.SchoolClass;
import com.example.homeworktracker.storage.SchoolClassStorage;

/**
 * Service class for managing school classes. It provides methods to add, update, delete, and
 * retreive school classes.
 */
@Service
public class SchoolClassService {
  private final List<SchoolClass> schoolClasses = new ArrayList<>();
  private final SchoolClassStorage schoolClassStorage;

  // Constructor that initializes the service with the provided SchoolClassStorage and loads the
  // selected classes
  public SchoolClassService(SchoolClassStorage schoolClassStorage) {
    this.schoolClassStorage = schoolClassStorage;
    this.schoolClasses.addAll(schoolClassStorage.loadSchoolClasses());
  }

  // Getter method that retreives all currently enrolled classes
  public List<SchoolClass> getAllSchoolClasses() {
    return schoolClasses.stream().toList();
  }

  /*
   * Method to add a new schoolClass. It first validates the schoolClass object to ensure that it
   * has a class name and teacher's name. If the schoolClass object doesn't have an ID, it generates
   * a new UUID for it. Finally, it adds the schoolClass to the list of schoolClasses and saves the
   * updated list to the storage.
   */
  public SchoolClass addSchoolClass(SchoolClass schoolClass) {
    validateSchoolClass(schoolClass);

    if (schoolClass.getId() == null || schoolClass.getId().isBlank()) {
      schoolClass.setId(UUID.randomUUID().toString());
    }

    schoolClasses.add(schoolClass);
    schoolClassStorage.saveSchoolClasses(schoolClasses);
    return schoolClass;
  }

  public boolean deleteSchoolClass(String id) {
    boolean removed = schoolClasses.removeIf(sC -> sC.getId().equals(id));

    if (removed) {
      schoolClassStorage.saveSchoolClasses(schoolClasses);
    }

    return removed;
  }

  public SchoolClass updateSchoolClass(String id, SchoolClass updated) {
    SchoolClass existing = findbyId(id);

    if (existing == null) {
      return null;
    }

    validateSchoolClass(updated);

    existing.setClassName(updated.getClassName());
    existing.setTeacherName(updated.getTeacherName());

    schoolClassStorage.saveSchoolClasses(schoolClasses);
    return existing;
  }

  private SchoolClass findbyId(String id) {
    return schoolClasses.stream().filter(sC -> sC.getId().equals(id)).findFirst().orElse(null);
  }

  /*
   * Method to validate a schoolClass object. It checks if the schoolClass has a valid class name
   * and teacher's name.
   */
  public void validateSchoolClass(SchoolClass schoolClass) {
    if (schoolClass.getClassName() == null || schoolClass.getClassName().isBlank()) {
      throw new IllegalArgumentException("Class name is required");
    }
    if (schoolClass.getTeacherName() == null || schoolClass.getTeacherName().isBlank()) {
      throw new IllegalArgumentException("Teacher's name is required");
    }
  }
}
