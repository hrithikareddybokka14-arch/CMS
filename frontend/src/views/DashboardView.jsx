import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  CalendarCheck, 
  TrendingUp, 
  UserPlus, 
  PlusCircle, 
  CheckCircle,
  Eye,
  Building,
  RefreshCw
} from 'lucide-react';
import { SummaryCard } from '../components/SummaryCard';
import { api } from '../services/api';
import { useToast } from '../components/Toast';

export const DashboardView = ({ onNavigate, onViewStudent }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await api.dashboard.getStats();
      setStats(data);
    } catch (err) {
      console.error(err);
      addToast('Error loading dashboard statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Top Banner & Refresh */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            Academic Overview & Institutional Metrics
          </h2>
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: 2 }}>
            Real-time enrollment, staffing, curriculum, and attendance analytics
          </p>
        </div>

        <button 
          onClick={fetchStats} 
          className="btn btn-secondary"
          disabled={loading}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* KPI Summary Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: 20
      }}>
        <SummaryCard
          title="Total Enrolled Students"
          value={stats?.totalStudents ?? (loading ? '...' : 0)}
          icon={GraduationCap}
          color="blue"
          subtitle="Across all departments & years"
          badge="Active Cohort"
        />
        <SummaryCard
          title="Faculty Members"
          value={stats?.totalFaculty ?? (loading ? '...' : 0)}
          icon={Users}
          color="emerald"
          subtitle="Professors & Lecturers"
          badge="100% On-Duty"
        />
        <SummaryCard
          title="Offered Courses"
          value={stats?.totalCourses ?? (loading ? '...' : 0)}
          icon={BookOpen}
          color="indigo"
          subtitle="Accredited degree courses"
          badge="Active Semesters"
        />
        <SummaryCard
          title="Institutional Attendance"
          value={stats ? `${stats.overallAttendanceRate}%` : (loading ? '...' : '0%')}
          icon={CalendarCheck}
          color="amber"
          subtitle={`Today: ${stats?.todayPresentCount ?? 0} Present, ${stats?.todayAbsentCount ?? 0} Absent`}
          badge={stats && stats.overallAttendanceRate >= 75 ? 'Healthy Rate' : 'Review Needed'}
        />
      </div>

      {/* Quick Action Shortcuts */}
      <div className="card" style={{ padding: '20px 24px' }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: 16 }}>
          Administrative Quick Actions
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: 12
        }}>
          <button
            onClick={() => onNavigate('students')}
            className="btn btn-outline-primary"
            style={{ justifyContent: 'flex-start', padding: '12px 16px' }}
          >
            <UserPlus size={18} />
            <span>Add New Student</span>
          </button>
          <button
            onClick={() => onNavigate('attendance')}
            className="btn btn-outline-primary"
            style={{ justifyContent: 'flex-start', padding: '12px 16px' }}
          >
            <CalendarCheck size={18} />
            <span>Mark Daily Attendance</span>
          </button>
          <button
            onClick={() => onNavigate('courses')}
            className="btn btn-outline-primary"
            style={{ justifyContent: 'flex-start', padding: '12px 16px' }}
          >
            <PlusCircle size={18} />
            <span>Register Course</span>
          </button>
          <button
            onClick={() => onNavigate('marks')}
            className="btn btn-outline-primary"
            style={{ justifyContent: 'flex-start', padding: '12px 16px' }}
          >
            <TrendingUp size={18} />
            <span>Enter Examination Marks</span>
          </button>
        </div>
      </div>

      {/* Middle Row: Department Enrollment & Today's Attendance Details */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: 24
      }}>
        {/* Department Distribution */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Department Distribution</div>
              <div className="card-subtitle">Active student enrollment by discipline</div>
            </div>
            <Building size={20} style={{ color: 'var(--primary-600)' }} />
          </div>
          <div className="card-body">
            {stats && stats.departmentDistribution && Object.keys(stats.departmentDistribution).length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {Object.entries(stats.departmentDistribution).map(([dept, count]) => {
                  const total = stats.totalStudents || 1;
                  const pct = Math.round((count / total) * 100);
                  return (
                    <div key={dept}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', marginBottom: 6 }}>
                        <span style={{ fontWeight: 600, color: '#1e293b' }}>{dept}</span>
                        <span style={{ color: '#64748b' }}>{count} students ({pct}%)</span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: 8,
                        backgroundColor: '#e2e8f0',
                        borderRadius: 4,
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${pct}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)',
                          borderRadius: 4,
                          transition: 'width 0.4s ease'
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0', color: '#94a3b8' }}>
                No department data available.
              </div>
            )}
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Daily Attendance Metrics</div>
              <div className="card-subtitle">Aggregated status of class check-ins</div>
            </div>
            <CalendarCheck size={20} style={{ color: '#10b981' }} />
          </div>
          <div className="card-body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 16,
              marginBottom: 20
            }}>
              <div style={{
                backgroundColor: 'var(--success-bg)',
                border: '1px solid var(--success-border)',
                padding: '16px',
                borderRadius: 12,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--success)' }}>
                  {stats?.todayPresentCount ?? 0}
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#065f46' }}>
                  Students Present
                </div>
              </div>

              <div style={{
                backgroundColor: 'var(--danger-bg)',
                border: '1px solid var(--danger-border)',
                padding: '16px',
                borderRadius: 12,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--danger)' }}>
                  {stats?.todayAbsentCount ?? 0}
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#991b1b' }}>
                  Students Absent
                </div>
              </div>
            </div>

            <div style={{
              padding: '14px 18px',
              backgroundColor: '#f8fafc',
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>
                Attendance Compliance Threshold:
              </span>
              <span className="badge badge-success">75% Mandatory</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Admissions Table */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Recent Student Admissions</div>
            <div className="card-subtitle">Newly registered students in the system</div>
          </div>
          <button
            onClick={() => onNavigate('students')}
            className="btn btn-outline-primary btn-sm"
          >
            View All Students
          </button>
        </div>

        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Full Name</th>
                <th>Department</th>
                <th>Year</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentStudents && stats.recentStudents.length > 0 ? (
                stats.recentStudents.map((student) => (
                  <tr key={student.id || student.studentId}>
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
                    <td>{student.year}</td>
                    <td>
                      <span className="badge badge-success">
                        <CheckCircle size={12} />
                        {student.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => onViewStudent(student)}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
                      >
                        <Eye size={14} />
                        <span>Profile</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: '#94a3b8' }}>
                    {loading ? 'Loading admissions data...' : 'No recent students found.'}
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
