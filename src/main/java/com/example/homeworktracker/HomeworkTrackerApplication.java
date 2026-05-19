package com.example.homeworktracker;

import java.awt.Desktop;
import java.net.URI;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class HomeworkTrackerApplication {
    public static void main(String[] args) {
        SpringApplication.run(HomeworkTrackerApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void openBrowser() {
        System.out.println("🚀 Application started! Opening browser...");

        new Thread(() -> {
            try {
                // Wait a moment for the server to be fully ready
                Thread.sleep(500);

                String url = "http://localhost:8080";
                System.out.println("📱 Attempting to open: " + url);

                if (Desktop.isDesktopSupported()) {
                    Desktop desktop = Desktop.getDesktop();
                    if (desktop.isSupported(Desktop.Action.BROWSE)) {
                        desktop.browse(new URI(url));
                        System.out.println("✅ Browser opened successfully!");
                    } else {
                        System.out.println("⚠️  Desktop.browse() is not supported on this system");
                    }
                } else {
                    System.out.println("⚠️  Desktop class is not supported on this system");
                }
            } catch (Exception e) {
                System.err.println("❌ Could not open browser: " + e.getMessage());
                e.printStackTrace();
                System.out.println("📍 Visit the app manually at: http://localhost:8080");
            }
        }).start();
    }
}
