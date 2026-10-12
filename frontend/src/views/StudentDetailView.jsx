import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  GraduationCap, 
  Mail, 
  Phone, 
  Building2, 
  BookOpen, 
  Calendar, 
  MapPin, 
  Award, 
  CalendarCheck, 
  Printer, 
  Edit2,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';

export const StudentDetailView = ({ student, onBack, onEdit }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [marksRecords, setMarksRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    if (!student || !student.studentId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const [att, mrk] = await Promise.all([
          api.attendance.getByStudent(student.studentId),
          api.marks.getByStudent(student.studentId)
        ]);
        setAttendanceRecords(att);
        setMarksRecords(mrk);
      } catch (err) {
        console.error(err);
        addToast('Failed to load full student transcripts', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [student]);

  if (!student) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <button onClick={onBack} className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to Directory
        </button>
      </div>
    );
  }

  // Calculate student attendance metrics
  const totalClasses = attendanceRecords.length;
  const presentCount = attendanceRecords.filter((a) => a.status === 'PRESENT').length;
  const absentCount = attendanceRecords.filter((a) => a.status === 'ABSENT').length;
  const lateCount = attendanceRecords.filter((a) => a.status === 'LATE').length;
  const attendanceRate = totalClasses > 0 ? Math.round(((presentCount + lateCount) / totalClasses) * 100) : 0;

  // Calculate GPA / Average Marks
  const totalMarksEarned = marksRecords.reduce((acc, m) => acc + (m.marksObtained || 0), 0);
  const totalMaxMarks = marksRecords.reduce((acc, m) => acc + (m.maxMarks || 100), 0);
  const averagePercentage = totalMaxMarks > 0 ? Math.round((totalMarksEarned / totalMaxMarks) * 100) : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Navigation & Header Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <button onClick={onBack} className="btn btn-secondary">
          <ArrowLeft size={16} />
          <span>Back to Students Directory</span>
        </button>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handlePrint} className="btn btn-secondary">
            <Printer size={16} />
            <span>Print Student Dossier</span>
          </button>
          <button onClick={() => onEdit(student)} className="btn btn-primary">
            <Edit2 size={16} />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      {/* Hero Profile Banner */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f0f7ff 100%)',
        border: '1px solid #bfdbfe',
        padding: '28px 32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div style={{
            width: 84,
            height: 84,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.2rem',
            fontWeight: 800,
            boxShadow: '0 8px 16px rgba(37, 99, 235, 0.25)'
          }}>
            {student.name.charAt(0)}
          </div>

          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                {student.name}
              </h2>
              <span className="badge badge-primary" style={{ fontFamily: 'monospace', fontSize: '0.86rem' }}>
                {student.studentId}
              </span>
              <span className="badge badge-success">
                <CheckCircle size={13} />
                {student.status || 'ACTIVE'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap', fontSize: '0.88rem', color: '#475569' }}>
              <span style={{ fontWeight: 600, color: 'var(--primary-700)' }}>
                {student.department}
              </span>
              <span>•</span>
              <span>{student.course}</span>
              <span>•</span>
              <span className="badge badge-neutral">
                {student.year} (Semester {student.semester})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Information Cards Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 20
      }}>
        {/* Contact & Personal Metadata */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Personal & Contact Profile</div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Mail size={18} style={{ color: 'var(--primary-600)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Institutional Email</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>{student.email}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Phone size={18} style={{ color: 'var(--primary-600)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Telephone Contact</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>{student.phone}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <Calendar size={18} style={{ color: 'var(--primary-600)' }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Date of Birth & Gender</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>
                  {student.dob || '—'} ({student.gender || 'Not specified'})
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
              <MapPin size={18} style={{ color: 'var(--primary-600)', marginTop: 2 }} />
              <div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Residential Address</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0f172a' }}>
                  {student.address || 'Campus Dormitory / Resident on Record'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Academic Performance KPI Card */}
        <div className="card">
          <div className="card-header">
            <div className="card-title">Academic & Attendance standing</div>
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 14
            }}>
              <div style={{
                backgroundColor: '#eff6ff',
                padding: '14px',
                borderRadius: 10,
                textAlign: 'center',
                border: '1px solid #bfdbfe'
              }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1d4ed8' }}>
                  {attendanceRate}%
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1e40af' }}>
                  Attendance Rate
                </div>
              </div>

              <div style={{
                backgroundColor: '#ecfdf5',
                padding: '14px',
                borderRadius: 10,
                textAlign: 'center',
                border: '1px solid #a7f3d0'
              }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#047857' }}>
                  {averagePercentage}%
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#065f46' }}>
                  Evaluation Average
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: 8 }}>
              • Total Sessions Recorded: <strong>{totalClasses}</strong> ({presentCount} Present, {absentCount} Absent, {lateCount} Late)<br />
              • Recorded Assessments: <strong>{marksRecords.length}</strong> modules
            </div>
          </div>
        </div>
      </div>

      {/* Attendance History Section */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Class Attendance History</div>
          <div className="card-subtitle">Session by session check-in logs</div>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Course Code</th>
                <th>Course Name</th>
                <th>Attendance Status</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords && attendanceRecords.length > 0 ? (
                attendanceRecords.map((att) => (
                  <tr key={att.id || att.date + att.courseCode}>
                    <td><strong>{att.date}</strong></td>
                    <td>
                      <span className="badge badge-primary">{att.courseCode}</span>
                    </td>
                    <td>{att.courseName || '—'}</td>
                    <td>
                      <span className={`badge ${att.status === 'PRESENT' ? 'badge-success' : att.status === 'LATE' ? 'badge-warning' : 'badge-danger'}`}>
                        {att.status}
                      </span>
                    </td>
                    <td>{att.remarks || '—'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                    {loading ? 'Retrieving attendance records...' : 'No attendance entries logged for this student yet.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Examination Marks & Transcript Section */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Examinations & Grade Transcript</div>
          <div className="card-subtitle">Recorded evaluations and terminal grades</div>
        </div>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Exam / Assessment Type</th>
                <th>Marks Obtained</th>
                <th>Max Marks</th>
                <th>Percentage</th>
                <th>Final Grade</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {marksRecords && marksRecords.length > 0 ? (
                marksRecords.map((mark) => {
                  const pct = mark.maxMarks > 0 ? Math.round((mark.marksObtained / mark.maxMarks) * 100) : 0;
                  return (
                    <tr key={mark.id || mark.courseCode + mark.examType}>
                      <td>
                        <strong>{mark.courseCode}</strong>
                        {mark.courseName && <span style={{ fontSize: '0.8rem', color: '#64748b' }}> — {mark.courseName}</span>}
                      </td>
                      <td>{mark.examType}</td>
                      <td><strong style={{ color: '#0f172a' }}>{mark.marksObtained}</strong></td>
                      <td>{mark.maxMarks}</td>
                      <td>{pct}%</td>
                      <td>
                        <span className={`badge ${mark.grade === 'A+' || mark.grade === 'A' ? 'badge-success' : mark.grade === 'B+' || mark.grade === 'B' ? 'badge-primary' : 'badge-warning'}`} style={{ fontWeight: 700 }}>
                          {mark.grade}
                        </span>
                      </td>
                      <td>{mark.remarks || '—'}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                    {loading ? 'Retrieving exam records...' : 'No exam records recorded yet.'}
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
