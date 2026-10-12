import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  CalendarCheck, 
  Check, 
  X, 
  Clock, 
  Save, 
  Users, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';

export const AttendanceView = () => {
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedCourse, setSelectedCourse] = useState('CS201');
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({}); // studentId -> { status, remarks }
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { addToast } = useToast();

  // Load available courses
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

  // Fetch students and current date's attendance
  const loadRosterAndAttendance = async () => {
    if (!date) return;
    setLoading(true);
    try {
      // 1. Get courses info
      const course = courses.find((c) => c.courseCode === selectedCourse);
      const dept = course ? course.department : '';

      // 2. Get students in this department
      const studentData = await api.students.getAll({ department: dept });
      setStudents(studentData);

      // 3. Get existing attendance for this date & course
      const existingAttendance = await api.attendance.getByDate(date, selectedCourse);
      
      const map = {};
      // Initialize with existing or default
      studentData.forEach((s) => {
        const found = existingAttendance.find((a) => a.studentId === s.studentId);
        if (found) {
          map[s.studentId] = { status: found.status, remarks: found.remarks || '' };
        } else {
          map[s.studentId] = { status: 'PRESENT', remarks: '' };
        }
      });

      setAttendanceMap(map);
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to load attendance sheet', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courses.length > 0) {
      loadRosterAndAttendance();
    }
  }, [date, selectedCourse, courses]);

  const setStatus = (studentId, status) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status
      }
    }));
  };

  const setRemarks = (studentId, remarks) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        remarks
      }
    }));
  };

  const handleMarkAllPresent = () => {
    setAttendanceMap((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((id) => {
        next[id] = { ...next[id], status: 'PRESENT' };
      });
      return next;
    });
    addToast('Marked all students as PRESENT', 'info');
  };

  const handleSaveAttendance = async () => {
    setSaving(true);
    try {
      const course = courses.find((c) => c.courseCode === selectedCourse);
      const records = students.map((s) => ({
        studentId: s.studentId,
        studentName: s.name,
        date,
        courseCode: selectedCourse,
        courseName: course?.courseName || '',
        department: s.department,
        status: attendanceMap[s.studentId]?.status || 'PRESENT',
        remarks: attendanceMap[s.studentId]?.remarks || ''
      }));

      await api.attendance.recordBatch(records);
      addToast(`Attendance sheet saved for ${date} (${records.length} records)`, 'success');
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to save attendance', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Metrics
  const totalCount = students.length;
  const presentCount = Object.values(attendanceMap).filter((a) => a.status === 'PRESENT').length;
  const absentCount = Object.values(attendanceMap).filter((a) => a.status === 'ABSENT').length;
  const lateCount = Object.values(attendanceMap).filter((a) => a.status === 'LATE').length;
  const attendancePercentage = totalCount > 0 ? Math.round(((presentCount + lateCount) / totalCount) * 100) : 0;

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
            Daily Attendance Register
          </h2>
          <p style={{ fontSize: '0.86rem', color: '#64748b' }}>
            Take roll-call, mark present/absent/late, and record daily participation
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button 
            onClick={handleMarkAllPresent} 
            className="btn btn-secondary"
            disabled={loading || totalCount === 0}
          >
            <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
            <span>Mark All Present</span>
          </button>

          <button 
            onClick={handleSaveAttendance} 
            className="btn btn-primary"
            disabled={saving || loading || totalCount === 0}
          >
            <Save size={16} />
            <span>{saving ? 'Saving Records...' : 'Save Attendance'}</span>
          </button>
        </div>
      </div>

      {/* Date & Course Selection Bar */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 16,
          alignItems: 'center'
        }}>
          <div>
            <label className="form-label" style={{ marginBottom: 4 }}>Select Attendance Date</label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div>
            <label className="form-label" style={{ marginBottom: 4 }}>Select Course & Subject</label>
            <select
              className="form-select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              {courses.map((c) => (
                <option key={c.courseCode} value={c.courseCode}>
                  {c.courseCode} — {c.courseName} ({c.department})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Metrics Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 10,
            padding: '10px 14px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>PRESENT</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--success)' }}>{presentCount}</div>
            </div>
            <div style={{ width: 1, height: 24, backgroundColor: '#cbd5e1' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>ABSENT</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--danger)' }}>{absentCount}</div>
            </div>
            <div style={{ width: 1, height: 24, backgroundColor: '#cbd5e1' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>LATE</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--warning)' }}>{lateCount}</div>
            </div>
            <div style={{ width: 1, height: 24, backgroundColor: '#cbd5e1' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>PERCENT</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary-600)' }}>{attendancePercentage}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Student Roster Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ width: 130 }}>Roll ID</th>
                <th>Student Name</th>
                <th>Academic Cohort</th>
                <th style={{ textAlign: 'center', width: 260 }}>Attendance Status</th>
                <th>Remarks / Notes</th>
              </tr>
            </thead>
            <tbody>
              {students && students.length > 0 ? (
                students.map((student) => {
                  const currentStatus = attendanceMap[student.studentId]?.status || 'PRESENT';
                  const currentRemarks = attendanceMap[student.studentId]?.remarks || '';

                  return (
                    <tr key={student.studentId}>
                      <td>
                        <span className="badge badge-primary" style={{ fontFamily: 'monospace' }}>
                          {student.studentId}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0f172a' }}>{student.name}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{student.department}</div>
                      </td>
                      <td>
                        <span className="badge badge-neutral">
                          {student.year}
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <div style={{
                          display: 'inline-flex',
                          backgroundColor: '#f1f5f9',
                          borderRadius: 8,
                          padding: 3,
                          gap: 3
                        }}>
                          <button
                            type="button"
                            onClick={() => setStatus(student.studentId, 'PRESENT')}
                            style={{
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: 6,
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              backgroundColor: currentStatus === 'PRESENT' ? 'var(--success)' : 'transparent',
                              color: currentStatus === 'PRESENT' ? '#ffffff' : '#475569',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => setStatus(student.studentId, 'ABSENT')}
                            style={{
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: 6,
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              backgroundColor: currentStatus === 'ABSENT' ? 'var(--danger)' : 'transparent',
                              color: currentStatus === 'ABSENT' ? '#ffffff' : '#475569',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            Absent
                          </button>
                          <button
                            type="button"
                            onClick={() => setStatus(student.studentId, 'LATE')}
                            style={{
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: 6,
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              backgroundColor: currentStatus === 'LATE' ? 'var(--warning)' : 'transparent',
                              color: currentStatus === 'LATE' ? '#ffffff' : '#475569',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            Late
                          </button>
                        </div>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-input"
                          style={{ padding: '6px 10px', fontSize: '0.84rem' }}
                          placeholder="e.g. excused, arrived 10 mins late"
                          value={currentRemarks}
                          onChange={(e) => setRemarks(student.studentId, e.target.value)}
                        />
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    {loading ? 'Compiling attendance sheet...' : 'No enrolled students found for this course.'}
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
