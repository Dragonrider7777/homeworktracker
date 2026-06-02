package com.example.homeworktracker.storage;

import java.io.FileReader;
import java.io.FileWriter;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;
import com.example.homeworktracker.model.SchoolClass;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;

@Component
public class SchoolClassStorage {
  private static final String FILE_PATH = "classes.json";

  private final Gson gson = new GsonBuilder().setPrettyPrinting().create();

  // Methods to load and save school classes
  // Similar to AssignmentStorage but for SchoolClass objects
  public List<SchoolClass> loadSchoolClasses() {
    // Load school classes from JSON file
    try (FileReader reader = new FileReader(FILE_PATH)) {
      // Use TypeToken to specify the type for deserialization
      // This is necessary because of Java's type erasure with generics
      Type listType = new TypeToken<ArrayList<SchoolClass>>() {}.getType();

      // Deserialize the JSON into a list of SchoolClass objects
      // If the file is empty or doesn't exist, gson.fromJson will return null, so we
      // handle that
      // case by returning an empty list
      List<SchoolClass> schoolClasses = gson.fromJson(reader, listType);
      return schoolClasses == null ? new ArrayList<>() : schoolClasses;
    } catch (Exception e) {
      // File doesn't exist yet or is empty
      return new ArrayList<>();
    }
  }

  public void saveSchoolClasses(List<SchoolClass> schoolClasses) {
    System.out.println("Saving " + schoolClasses.size() + " school classes");

    try (FileWriter writer = new FileWriter(FILE_PATH)) {
      gson.toJson(schoolClasses, writer);
    } catch (Exception e) {
      System.out.println("Could not save school classes: " + e.getMessage());
    }
  }
}
