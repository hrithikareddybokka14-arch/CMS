package com.college.cms.service;

import com.college.cms.exception.ResourceNotFoundException;
import com.college.cms.model.Faculty;
import com.college.cms.repository.FacultyRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FacultyService {

    private final FacultyRepository facultyRepository;

    public FacultyService(FacultyRepository facultyRepository) {
        this.facultyRepository = facultyRepository;
    }

    public List<Faculty> getAllFaculty(String search, String department) {
        List<Faculty> facultyList = facultyRepository.findAll();

        return facultyList.stream()
                .filter(f -> {
                    if (search != null && !search.trim().isEmpty()) {
                        String query = search.trim().toLowerCase();
                        boolean matchName = f.getName() != null && f.getName().toLowerCase().contains(query);
                        boolean matchId = f.getEmployeeId() != null && f.getEmployeeId().toLowerCase().contains(query);
                        boolean matchEmail = f.getEmail() != null && f.getEmail().toLowerCase().contains(query);
                        if (!matchName && !matchId && !matchEmail) return false;
                    }
                    if (department != null && !department.trim().isEmpty() && !department.equalsIgnoreCase("All")) {
                        if (f.getDepartment() == null || !f.getDepartment().equalsIgnoreCase(department.trim())) {
                            return false;
                        }
                    }
                    return true;
                })
                .collect(Collectors.toList());
    }

    public Faculty getFacultyById(String id) {
        return facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty not found with id: " + id));
    }

    public Faculty createFaculty(Faculty faculty) {
        if (facultyRepository.findByEmployeeId(faculty.getEmployeeId()).isPresent()) {
            throw new IllegalArgumentException("Employee ID already exists: " + faculty.getEmployeeId());
        }
        return facultyRepository.save(faculty);
    }

    public Faculty updateFaculty(String id, Faculty updatedData) {
        Faculty existing = getFacultyById(id);

        if (!existing.getEmployeeId().equals(updatedData.getEmployeeId())) {
            facultyRepository.findByEmployeeId(updatedData.getEmployeeId()).ifPresent(f -> {
                if (!f.getId().equals(id)) {
                    throw new IllegalArgumentException("Employee ID already exists: " + updatedData.getEmployeeId());
                }
            });
        }

        existing.setEmployeeId(updatedData.getEmployeeId());
        existing.setName(updatedData.getName());
        existing.setEmail(updatedData.getEmail());
        existing.setPhone(updatedData.getPhone());
        existing.setDepartment(updatedData.getDepartment());
        existing.setDesignation(updatedData.getDesignation());
        existing.setQualification(updatedData.getQualification());
        existing.setJoiningDate(updatedData.getJoiningDate());
        existing.setStatus(updatedData.getStatus());

        return facultyRepository.save(existing);
    }

    public void deleteFaculty(String id) {
        Faculty faculty = getFacultyById(id);
        facultyRepository.delete(faculty);
    }

    public long count() {
        return facultyRepository.count();
    }
}
