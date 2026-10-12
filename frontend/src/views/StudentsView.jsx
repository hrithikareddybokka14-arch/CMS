import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  Filter, 
  UserPlus, 
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { api } from '../services/api';
import { Modal } from '../components/Modal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { useToast } from '../components/Toast';

const DEPARTMENTS = [
  'All',
  'Computer Science',
  'Electronics & Communication',
  'Mechanical Engineering',
  'Business Administration'
];

const YEARS = ['All', '1st Year', '2nd Year', '3rd Year', '4th Year'];

export const StudentsView = ({ onViewDetails }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');
  const [year, setYear] = useState('All');

  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: '',
    phone: '',
    department: 'Computer Science',
    course: 'B.Tech Computer Science',
    year: '1st Year',
    semester: 1,
    dob: '',
    gender: 'Male',
    address: '',
    status: 'ACTIVE'
  });

  // Confirm delete
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formError, setFormError] = useState('');
  const { addToast } = useToast();

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await api.students.getAll({ search, department, year });
      setStudents(data);
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Error fetching students', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search, department, year]);

  const handleOpenAdd = () => {
    setEditingStudent(null);
    setFormError('');
    setFormData({
      studentId: `STU-2024-${String(Math.floor(Math.random() * 900) + 100)}`,
      name: '',
      email: '',
      phone: '',
      department: 'Computer Science',
      course: 'B.Tech Computer Science',
      year: '1st Year',
      semester: 1,
      dob: '2004-01-01',
      gender: 'Male',
      address: '',
      status: 'ACTIVE'
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (student) => {
    setEditingStudent(student);
    setFormError('');
    setFormData({
      studentId: student.studentId || '',
      name: student.name || '',
      email: student.email || '',
      phone: student.phone || '',
      department: student.department || 'Computer Science',
      course: student.course || 'B.Tech Computer Science',
      year: student.year || '1st Year',
      semester: student.semester || 1,
      dob: student.dob || '',
      gender: student.gender || 'Male',
      address: student.address || '',
      status: student.status || 'ACTIVE'
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      if (editingStudent) {
        await api.students.update(editingStudent.id, formData);
        addToast('Student details updated successfully', 'success');
      } else {
        await api.students.create(formData);
        addToast('New student registered successfully', 'success');
      }
      setIsFormOpen(false);
      fetchStudents();
    } catch (err) {
      setFormError(err.message || 'Failed to save student');
      addToast(err.message || 'Failed to save student', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.students.delete(deleteTarget.id);
      addToast(`Student ${deleteTarget.name} deleted`, 'success');
      fetchStudents();
    } catch (err) {
      addToast(err.message || 'Failed to delete student', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Action Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
            Student Management
          </h2>
          <p style={{ fontSize: '0.86rem', color: '#64748b' }}>
            Register, search, modify, and inspect academic transcripts
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <UserPlus size={18} />
          <span>Add New Student</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 14,
          alignItems: 'center'
        }}>
          {/* Search box */}
          <div className="search-wrapper" style={{ gridColumn: 'span 2' }}>
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search by student name, roll ID, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Department Filter */}
          <div>
            <select
              className="form-select"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  Department: {d}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <select
              className="form-select"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  Year: {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Full Name</th>
                <th>Department</th>
                <th>Course</th>
                <th>Year & Sem</th>
                <th>Contact</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students && students.length > 0 ? (
                students.map((student) => (
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
                    <td style={{ fontSize: '0.82rem', color: '#334155' }}>{student.course}</td>
                    <td>
                      <span className="badge badge-neutral">
                        {student.year} (Sem {student.semester})
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: '#475569' }}>{student.phone}</td>
                    <td>
                      <span className="badge badge-success">
                        <CheckCircle size={12} />
                        {student.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          onClick={() => onViewDetails(student)}
                          className="btn-icon primary"
                          title="View Comprehensive Profile"
                        >
                          <Eye size={17} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(student)}
                          className="btn-icon"
                          title="Edit Student"
                        >
                          <Edit2 size={17} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(student)}
                          className="btn-icon danger"
                          title="Delete Student"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                    {loading ? 'Retrieving student records...' : 'No student records found matching filters.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingStudent ? `Edit Student: ${editingStudent.name}` : 'Register New Student'}
        size="large"
      >
        {formError && (
          <div style={{
            backgroundColor: 'var(--danger-bg)',
            color: 'var(--danger)',
            border: '1px solid var(--danger-border)',
            padding: '12px 16px',
            borderRadius: 8,
            fontSize: '0.86rem',
            marginBottom: 16
          }}>
            {formError}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label required">Student Roll ID</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                placeholder="e.g. STU-2024-001"
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Full Name</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Alexander Rivera"
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Email Address</label>
              <input
                type="email"
                className="form-input"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="student@apexcollege.edu"
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Phone Number</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 000-0000"
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Department</label>
              <select
                className="form-select"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <option value="Computer Science">Computer Science</option>
                <option value="Electronics & Communication">Electronics & Communication</option>
                <option value="Mechanical Engineering">Mechanical Engineering</option>
                <option value="Business Administration">Business Administration</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label required">Degree Course</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                placeholder="e.g. B.Tech Computer Science"
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Academic Year</label>
              <select
                className="form-select"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label required">Semester</label>
              <input
                type="number"
                min="1"
                max="8"
                className="form-input"
                required
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) || 1 })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-input"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                className="form-select"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: 8 }}>
            <label className="form-label">Residential Address</label>
            <textarea
              className="form-textarea"
              rows="2"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Campus hostel or residential street address"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsFormOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingStudent ? 'Save Modifications' : 'Register Student'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Confirm Student Removal"
        message={`Are you sure you want to delete student "${deleteTarget?.name}" (${deleteTarget?.studentId})? This action cannot be reversed.`}
        confirmText="Confirm Delete"
      />
    </div>
  );
};
