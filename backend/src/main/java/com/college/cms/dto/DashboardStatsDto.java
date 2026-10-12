package com.college.cms.dto;

import com.college.cms.model.Student;
import java.util.List;
import java.util.Map;

public class DashboardStatsDto {
    private long totalStudents;
    private long totalFaculty;
    private long totalCourses;
    private double overallAttendanceRate;
    private long todayPresentCount;
    private long todayAbsentCount;
    private Map<String, Long> departmentDistribution;
    private List<Student> recentStudents;

    public DashboardStatsDto() {}

    public DashboardStatsDto(long totalStudents, long totalFaculty, long totalCourses, 
                             double overallAttendanceRate, long todayPresentCount, long todayAbsentCount, 
                             Map<String, Long> departmentDistribution, List<Student> recentStudents) {
        this.totalStudents = totalStudents;
        this.totalFaculty = totalFaculty;
        this.totalCourses = totalCourses;
        this.overallAttendanceRate = overallAttendanceRate;
        this.todayPresentCount = todayPresentCount;
        this.todayAbsentCount = todayAbsentCount;
        this.departmentDistribution = departmentDistribution;
        this.recentStudents = recentStudents;
    }

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

    public long getTotalFaculty() { return totalFaculty; }
    public void setTotalFaculty(long totalFaculty) { this.totalFaculty = totalFaculty; }

    public long getTotalCourses() { return totalCourses; }
    public void setTotalCourses(long totalCourses) { this.totalCourses = totalCourses; }

    public double getOverallAttendanceRate() { return overallAttendanceRate; }
    public void setOverallAttendanceRate(double overallAttendanceRate) { this.overallAttendanceRate = overallAttendanceRate; }

    public long getTodayPresentCount() { return todayPresentCount; }
    public void setTodayPresentCount(long todayPresentCount) { this.todayPresentCount = todayPresentCount; }

    public long getTodayAbsentCount() { return todayAbsentCount; }
    public void setTodayAbsentCount(long todayAbsentCount) { this.todayAbsentCount = todayAbsentCount; }

    public Map<String, Long> getDepartmentDistribution() { return departmentDistribution; }
    public void setDepartmentDistribution(Map<String, Long> departmentDistribution) { this.departmentDistribution = departmentDistribution; }

    public List<Student> getRecentStudents() { return recentStudents; }
    public void setRecentStudents(List<Student> recentStudents) { this.recentStudents = recentStudents; }
}
