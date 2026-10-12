package com.college.cms.config;

import com.college.cms.model.*;
import com.college.cms.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final AdminRepository adminRepository;
    private final StudentRepository studentRepository;
    private final FacultyRepository facultyRepository;
    private final CourseRepository courseRepository;
    private final AttendanceRepository attendanceRepository;
    private final MarkRepository markRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public DataSeeder(AdminRepository adminRepository,
                      StudentRepository studentRepository,
                      FacultyRepository facultyRepository,
                      CourseRepository courseRepository,
                      AttendanceRepository attendanceRepository,
                      MarkRepository markRepository) {
        this.adminRepository = adminRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.courseRepository = courseRepository;
        this.attendanceRepository = attendanceRepository;
        this.markRepository = markRepository;
    }

    @Override
    public void run(String... args) {
        seedAdmin();
        seedFaculty();
        seedCourses();
        seedStudents();
        seedAttendance();
        seedMarks();
    }

    private void seedAdmin() {
        if (adminRepository.count() == 0) {
            log.info("Seeding default Administrator...");
            Admin admin = new Admin(
                    "admin",
                    passwordEncoder.encode("admin123"),
                    "Dr. Arthur Vance",
                    "admin@apexcollege.edu",
                    "Chief Administrator"
            );
            adminRepository.save(admin);
            log.info("Default admin created: username 'admin', password 'admin123'");
        }
    }

    private void seedFaculty() {
        if (facultyRepository.count() == 0) {
            log.info("Seeding Faculty members...");
            List<Faculty> facultyList = Arrays.asList(
                    new Faculty("FAC-101", "Dr. Sarah Connor", "sconnor@apexcollege.edu", "+1 (555) 234-5678", "Computer Science", "Professor & HOD", "Ph.D. in Computer Science (MIT)", "2018-08-15", "ACTIVE"),
                    new Faculty("FAC-102", "Prof. Alan Turing", "aturing@apexcollege.edu", "+1 (555) 345-6789", "Computer Science", "Associate Professor", "Ph.D. in Mathematics & CS", "2019-01-10", "ACTIVE"),
                    new Faculty("FAC-103", "Dr. Margaret Hamilton", "mhamilton@apexcollege.edu", "+1 (555) 456-7890", "Electronics & Communication", "Professor", "Ph.D. in Software & Systems", "2017-06-01", "ACTIVE"),
                    new Faculty("FAC-104", "Dr. Nikola Tesla", "ntesla@apexcollege.edu", "+1 (555) 567-8901", "Electronics & Communication", "Associate Professor", "M.Tech in Electrical Engineering", "2020-09-12", "ACTIVE"),
                    new Faculty("FAC-105", "Prof. Leonardo DaVinci", "ldavinci@apexcollege.edu", "+1 (555) 678-9012", "Mechanical Engineering", "Professor & HOD", "Ph.D. in Mechanical Systems", "2016-04-20", "ACTIVE"),
                    new Faculty("FAC-106", "Dr. Grace Hopper", "ghopper@apexcollege.edu", "+1 (555) 789-0123", "Business Administration", "Professor", "Ph.D. in Information Systems & Mgmt", "2019-11-05", "ACTIVE")
            );
            facultyRepository.saveAll(facultyList);
        }
    }

    private void seedCourses() {
        if (courseRepository.count() == 0) {
            log.info("Seeding Courses...");
            List<Course> courses = Arrays.asList(
                    new Course("CS101", "Introduction to Programming", "Computer Science", 4, 1, "Dr. Sarah Connor", "Fundamental algorithms and syntax in modern software development."),
                    new Course("CS201", "Data Structures & Algorithms", "Computer Science", 4, 3, "Prof. Alan Turing", "Trees, graphs, dynamic programming, and complexity analysis."),
                    new Course("CS301", "Database Management Systems", "Computer Science", 3, 5, "Dr. Sarah Connor", "Relational calculus, SQL, ACID properties, NoSQL, and document stores."),
                    new Course("EC101", "Digital Electronics", "Electronics & Communication", 4, 2, "Dr. Margaret Hamilton", "Boolean algebra, logic gates, sequential and combinational circuits."),
                    new Course("EC201", "Microprocessors & Embedded Systems", "Electronics & Communication", 4, 4, "Dr. Nikola Tesla", "8086, ARM architectures, peripheral interfacing, and assembly."),
                    new Course("ME101", "Engineering Thermodynamics", "Mechanical Engineering", 4, 2, "Prof. Leonardo DaVinci", "Laws of thermodynamics, heat transfer, and energy cycles."),
                    new Course("ME201", "Fluid Mechanics & Machinery", "Mechanical Engineering", 3, 4, "Prof. Leonardo DaVinci", "Hydrodynamics, Navier-Stokes, turbines, and fluid pumps."),
                    new Course("BA101", "Principles of Management", "Business Administration", 3, 1, "Dr. Grace Hopper", "Organizational behavior, strategic planning, and leadership.")
            );
            courseRepository.saveAll(courses);
        }
    }

    private void seedStudents() {
        if (studentRepository.count() == 0) {
            log.info("Seeding Students...");
            List<Student> students = Arrays.asList(
                    new Student("STU-2024-001", "Alex Rivera", "alex.rivera@apexcollege.edu", "+1 (555) 111-2233", "Computer Science", "B.Tech Computer Science", "3rd Year", 5, "2003-05-14", "Male", "742 Evergreen Terrace, Sector 4", "ACTIVE"),
                    new Student("STU-2024-002", "Sophia Chen", "sophia.chen@apexcollege.edu", "+1 (555) 222-3344", "Computer Science", "B.Tech Computer Science", "2nd Year", 3, "2004-09-22", "Female", "128 Innovation Way, Tech Park", "ACTIVE"),
                    new Student("STU-2024-003", "Marcus Johnson", "marcus.j@apexcollege.edu", "+1 (555) 333-4455", "Electronics & Communication", "B.Tech Electronics & Comm", "3rd Year", 5, "2003-11-08", "Male", "45 Horizon Boulevard, Suite 12", "ACTIVE"),
                    new Student("STU-2024-004", "Emma Watson", "emma.w@apexcollege.edu", "+1 (555) 444-5566", "Mechanical Engineering", "B.Tech Mechanical Engineering", "4th Year", 7, "2002-04-19", "Female", "89 Oakridge Drive, Campus Hills", "ACTIVE"),
                    new Student("STU-2024-005", "David Patel", "david.patel@apexcollege.edu", "+1 (555) 555-6677", "Business Administration", "Bachelor of Business Admin", "1st Year", 1, "2005-02-17", "Male", "310 University Avenue, Apt 4B", "ACTIVE"),
                    new Student("STU-2024-006", "Olivia Martinez", "olivia.m@apexcollege.edu", "+1 (555) 666-7788", "Computer Science", "B.Tech Computer Science", "4th Year", 7, "2002-08-30", "Female", "512 Pinecrest Road, North Gate", "ACTIVE"),
                    new Student("STU-2024-007", "Liam O'Connor", "liam.oc@apexcollege.edu", "+1 (555) 777-8899", "Electronics & Communication", "B.Tech Electronics & Comm", "2nd Year", 3, "2004-12-05", "Male", "67 Cedar Court, West End", "ACTIVE"),
                    new Student("STU-2024-008", "Chloe Kim", "chloe.kim@apexcollege.edu", "+1 (555) 888-9900", "Mechanical Engineering", "B.Tech Mechanical Engineering", "2nd Year", 3, "2004-07-11", "Female", "204 Sunset View, Hilltop", "ACTIVE"),
                    new Student("STU-2024-009", "James Wilson", "james.w@apexcollege.edu", "+1 (555) 999-0011", "Business Administration", "Bachelor of Business Admin", "3rd Year", 5, "2003-03-25", "Male", "88 Market Square, Downtown", "ACTIVE"),
                    new Student("STU-2024-010", "Aria Sharma", "aria.sharma@apexcollege.edu", "+1 (555) 123-4567", "Computer Science", "B.Tech Computer Science", "1st Year", 1, "2005-10-14", "Female", "15 Meadowlark Lane", "ACTIVE")
            );
            studentRepository.saveAll(students);
        }
    }

    private void seedAttendance() {
        if (attendanceRepository.count() == 0) {
            log.info("Seeding Attendance records...");
            String today = LocalDate.now().toString();
            String yesterday = LocalDate.now().minusDays(1).toString();

            List<Attendance> records = Arrays.asList(
                    new Attendance("STU-2024-001", "Alex Rivera", today, "CS201", "Data Structures & Algorithms", "Computer Science", "PRESENT", "On time"),
                    new Attendance("STU-2024-002", "Sophia Chen", today, "CS201", "Data Structures & Algorithms", "Computer Science", "PRESENT", "Active participation"),
                    new Attendance("STU-2024-006", "Olivia Martinez", today, "CS201", "Data Structures & Algorithms", "Computer Science", "PRESENT", "On time"),
                    new Attendance("STU-2024-010", "Aria Sharma", today, "CS201", "Data Structures & Algorithms", "Computer Science", "ABSENT", "Medical leave"),
                    new Attendance("STU-2024-003", "Marcus Johnson", today, "EC201", "Microprocessors & Embedded Systems", "Electronics & Communication", "PRESENT", "On time"),
                    new Attendance("STU-2024-007", "Liam O'Connor", today, "EC201", "Microprocessors & Embedded Systems", "Electronics & Communication", "LATE", "10 mins late"),
                    new Attendance("STU-2024-004", "Emma Watson", today, "ME201", "Fluid Mechanics & Machinery", "Mechanical Engineering", "PRESENT", "On time"),
                    new Attendance("STU-2024-008", "Chloe Kim", today, "ME201", "Fluid Mechanics & Machinery", "Mechanical Engineering", "PRESENT", "On time"),
                    new Attendance("STU-2024-005", "David Patel", today, "BA101", "Principles of Management", "Business Administration", "PRESENT", "On time"),
                    new Attendance("STU-2024-009", "James Wilson", today, "BA101", "Principles of Management", "Business Administration", "ABSENT", "Unexcused absence"),
                    
                    // Historical for STU-2024-001
                    new Attendance("STU-2024-001", "Alex Rivera", yesterday, "CS301", "Database Management Systems", "Computer Science", "PRESENT", "Regular"),
                    new Attendance("STU-2024-002", "Sophia Chen", yesterday, "CS301", "Database Management Systems", "Computer Science", "PRESENT", "Regular")
            );
            attendanceRepository.saveAll(records);
        }
    }

    private void seedMarks() {
        if (markRepository.count() == 0) {
            log.info("Seeding Marks & Grades...");
            List<Mark> marks = Arrays.asList(
                    new Mark("STU-2024-001", "Alex Rivera", "CS201", "Data Structures & Algorithms", "Midterm Exam", 100, 92.5, "A+", 3, "2024-2025", "Excellent analytical thinking"),
                    new Mark("STU-2024-001", "Alex Rivera", "CS301", "Database Management Systems", "Final Exam", 100, 88.0, "A", 5, "2024-2025", "Strong SQL queries and ER modeling"),
                    new Mark("STU-2024-002", "Sophia Chen", "CS201", "Data Structures & Algorithms", "Midterm Exam", 100, 96.0, "A+", 3, "2024-2025", "Top scorer in cohort"),
                    new Mark("STU-2024-003", "Marcus Johnson", "EC201", "Microprocessors & Embedded Systems", "Midterm Exam", 100, 78.5, "B+", 5, "2024-2025", "Good laboratory execution"),
                    new Mark("STU-2024-004", "Emma Watson", "ME201", "Fluid Mechanics & Machinery", "Midterm Exam", 100, 85.0, "A", 7, "2024-2025", "Solid problem solving"),
                    new Mark("STU-2024-005", "David Patel", "BA101", "Principles of Management", "Assignment 1", 50, 44.0, "A", 1, "2024-2025", "Well researched case study"),
                    new Mark("STU-2024-006", "Olivia Martinez", "CS301", "Database Management Systems", "Final Exam", 100, 91.0, "A+", 7, "2024-2025", "Distinction in database architecture"),
                    new Mark("STU-2024-007", "Liam O'Connor", "EC101", "Digital Electronics", "Midterm Exam", 100, 68.0, "B", 3, "2024-2025", "Satisfactory logic design")
            );
            markRepository.saveAll(marks);
        }
    }
}
