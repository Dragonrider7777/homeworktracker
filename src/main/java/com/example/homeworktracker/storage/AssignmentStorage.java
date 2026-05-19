package com.example.homeworktracker.storage;

import java.io.FileReader;
import java.io.FileWriter;
import java.lang.reflect.Type;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;
import com.example.homeworktracker.model.Assignment;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializer;
import com.google.gson.reflect.TypeToken;

@Component
public class AssignmentStorage {

    private static final String FILE_PATH = "assignments.json";

    private final Gson gson = new GsonBuilder()
            // Handle LocalDate serialization
            .registerTypeAdapter(LocalDate.class,
                    (JsonSerializer<LocalDate>) (date, type,
                            context) -> new JsonPrimitive(date.toString()))
            // Handle LocalDate deserialization
            .registerTypeAdapter(LocalDate.class, (JsonDeserializer<LocalDate>) (json, type,
                    context) -> LocalDate.parse(json.getAsString()))
            .setPrettyPrinting().create();

    public List<Assignment> loadAssignments() {
        try (FileReader reader = new FileReader(FILE_PATH)) {
            Type listType = new TypeToken<ArrayList<Assignment>>() {}.getType();
            List<Assignment> assignments = gson.fromJson(reader, listType);

            return assignments == null ? new ArrayList<>() : assignments;

        } catch (Exception e) {
            // File doesn't exist yet or is empty
            return new ArrayList<>();
        }
    }

    public void saveAssignments(List<Assignment> assignments) {
        System.out.println("Saving " + assignments.size() + " assignments");

        try (FileWriter writer = new FileWriter(FILE_PATH)) {
            gson.toJson(assignments, writer);

        } catch (Exception e) {
            System.out.println("Could not save assignments: " + e.getMessage());
        }
    }
}
