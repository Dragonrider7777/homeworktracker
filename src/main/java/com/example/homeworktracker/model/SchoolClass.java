package com.example.homeworktracker.model;

import java.util.UUID;

public class SchoolClass {
  private String id;
  private String name;
  private String teacherName;

  // Constructor no parameters for JSON deserialization
  public SchoolClass() {
    this.id = UUID.randomUUID().toString();
  }

  // Constructor with parameters
  public SchoolClass(String name, String teacherName) {
    this.id = UUID.randomUUID().toString();
    this.name = name;
    this.teacherName = teacherName;
  }

  // Getters and setters
  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getTeacherName() {
    return teacherName;
  }

  public void setTeacherName(String teacherName) {
    this.teacherName = teacherName;
  }
}
