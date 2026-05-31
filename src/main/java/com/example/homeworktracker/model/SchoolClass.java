package com.example.homeworktracker.model;

import java.util.UUID;

public class SchoolClass {
  private String id;
  private String className;
  private String teacherName;

  // Constructor no parameters for JSON deserialization
  public SchoolClass() {
    this.id = UUID.randomUUID().toString();
  }

  // Constructor with parameters
  public SchoolClass(String className, String teacherName) {
    this.id = UUID.randomUUID().toString();
    this.className = className;
    this.teacherName = teacherName;
  }

  // Getters and setters
  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getClassName() {
    return className;
  }

  public void setClassName(String className) {
    this.className = className;
  }

  public String getTeacherName() {
    return teacherName;
  }

  public void setTeacherName(String teacherName) {
    this.teacherName = teacherName;
  }
}
