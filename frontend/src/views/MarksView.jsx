import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Save, 
  Search, 
  Filter, 
  CheckCircle, 
  TrendingUp, 
  BookOpen, 
  Layers,
  Edit2
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';

const EXAM_TYPES = ['Midterm Exam', 'Final Exam', 'Assignment 1', 'Quiz 1'];

export const MarksView = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('CS201');
  const [selectedExam, setSelectedExam] = useState('Midterm Exam');
  const [students, setStudents] = useState([]);
  const [marksMap, setMarksMap] = useState({}); // studentId -> { marksObtained, maxMarks, grade, remarks }
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await api.courses.getAll({});
        setCourses(data);
        if (data.length > 0 && !selectedCourse) {
          setSelectedCourse(data[0].courseCode);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadCourses();
  }, []);

  const calculateGrade = (obtained, max) => {
    if (!max || max <= 0) return 'N/A';
    const pct = (obtained / max) * 100;
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B+';
    if (pct >= 60) return 'B';
    if (pct >= 50) return 'C';
    if (pct >= 40) return 'D';
    return 'F';
  };

  const loadStudentsAndMarks = async () => {
    setLoading(true);
    try {
      const course = courses.find((c) => c.courseCode === selectedCourse);
      const dept = course ? course.department : '';

      // 1. Get students for course's department
      const studentData = await api.students.getAll({ department: dept });
      setStudents(studentData);

      // 2. Get marks for this course & exam
      const existingMarks = await api.marks.getAll({
        courseCode: selectedCourse,
        examType: selectedExam
      });

      const map = {};
      studentData.forEach((s) => {
        const found = existingMarks.find((m) => m.studentId === s.studentId);
        if (found) {
          map[s.studentId] = {
            marksObtained: found.marksObtained,
            maxMarks: found.maxMarks || 100,
            grade: found.grade,
            remarks: found.remarks || ''
          };
        } else {
          map[s.studentId] = {
            marksObtained: 0,
            maxMarks: 100,
            grade: 'F',
            remarks: ''
          };
        }
      });
      setMarksMap(map);
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to load grade evaluation sheet', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courses.length > 0) {
      loadStudentsAndMarks();
    }
  }, [selectedCourse, selectedExam, courses]);

  const handleScoreChange = (studentId, value) => {
    const num = Math.max(0, Math.min(100, parseFloat(value) || 0));
    setMarksMap((prev) => {
      const current = prev[studentId] || { maxMarks: 100 };
      const grade = calculateGrade(num, current.maxMarks || 100);
      return {
        ...prev,
        [studentId]: {
          ...current,
          marksObtained: num,
          grade
        }
      };
    });
  };

  const handleRemarksChange = (studentId, remarks) => {
    setMarksMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks
      }
    }));
  };

  const handleSaveMarks = async () => {
    setSaving(true);
    try {
      const course = courses.find((c) => c.courseCode === selectedCourse);
      const list = students.map((s) => {
        const item = marksMap[s.studentId] || { marksObtained: 0, maxMarks: 100 };
        return {
          studentId: s.studentId,
          studentName: s.name,
          courseCode: selectedCourse,
          courseName: course?.courseName || '',
          examType: selectedExam,
          maxMarks: item.maxMarks || 100,
          marksObtained: item.marksObtained || 0,
          grade: calculateGrade(item.marksObtained || 0, item.maxMarks || 100),
          semester: s.semester || 1,
          academicYear: '2024-2025',
          remarks: item.remarks || ''
        };
      });

      await api.marks.saveBatch(list);
      addToast(`Evaluation records recorded for ${selectedExam} (${selectedCourse})`, 'success');
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to save examination scores', 'error');
    } finally {
      setSaving(false);
    }
  };

  const getGradeBadge = (grade) => {
    if (grade === 'A+' || grade === 'A') return 'badge-success';
    if (grade === 'B+' || grade === 'B') return 'badge-primary';
    if (grade === 'C' || grade === 'D') return 'badge-warning';
    return 'badge-danger';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
            Academic Marks & Gradebook
          </h2>
          <p style={{ fontSize: '0.86rem', color: '#64748b' }}>
            Record test scores, compute letter grades, and maintain academic transcripts
          </p>
        </div>

        <button 
          onClick={handleSaveMarks} 
          className="btn btn-primary"
          disabled={saving || loading || students.length === 0}
        >
          <Save size={16} />
          <span>{saving ? 'Recording Scores...' : 'Save Gradebook'}</span>
        </button>
      </div>

      {/* Filter and Assessment Controls */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
          alignItems: 'center'
        }}>
          <div>
            <label className="form-label">Subject & Course</label>
            <select
              className="form-select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              {courses.map((c) => (
                <option key={c.courseCode} value={c.courseCode}>
                  {c.courseCode} — {c.courseName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Assessment / Exam Type</label>
            <select
              className="form-select"
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
            >
              {EXAM_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type} (Max: 100)
                </option>
              ))}
            </select>
          </div>

          {/* Quick Grading Scale Reference */}
          <div style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            padding: '10px 14px',
            fontSize: '0.78rem',
            color: '#475569'
          }}>
            <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>Grading Scale:</div>
            <div>A+ (≥90) • A (≥80) • B+ (≥70) • B (≥60) • C (≥50) • F (&lt;40)</div>
          </div>
        </div>
      </div>

      {/* Marks Grade Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 140 }}>Roll ID</th>
                <th>Student Name</th>
                <th>Department</th>
                <th style={{ width: 140 }}>Score (out of 100)</th>
                <th style={{ width: 100, textAlign: 'center' }}>Grade</th>
                <th>Instructor Notes / Feedback</th>
              </tr>
            </thead>
            <tbody>
              {students && students.length > 0 ? (
                students.map((student) => {
                  const entry = marksMap[student.studentId] || { marksObtained: 0, grade: 'F', remarks: '' };

                  return (
                    <tr key={student.studentId}>
                      <td>
                        <span className="badge badge-primary" style={{ fontFamily: 'monospace' }}>
                          {student.studentId}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{student.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{student.email}</div>
                      </td>
                      <td>{student.department}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            step="0.5"
                            className="form-input"
                            style={{ width: 85, padding: '6px 10px', fontWeight: 600 }}
                            value={entry.marksObtained}
                            onChange={(e) => handleScoreChange(student.studentId, e.target.value)}
                          />
                          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>/ 100</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <span className={`badge ${getGradeBadge(entry.grade)}`} style={{ fontSize: '0.84rem', minWidth: 36, justifyContent: 'center' }}>
                          {entry.grade}
                        </span>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '6px 10px', fontSize: '0.84rem' }}
                          placeholder="Feedback or commendation"
                          value={entry.remarks}
                          onChange={(e) => handleRemarksChange(student.studentId, e.target.value)}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    {loading ? 'Loading gradebook data...' : 'No students found for this subject.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
