import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  UserCheck, 
  GraduationCap, 
  Briefcase,
  Mail,
  Phone,
  Calendar
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

export const FacultyView = () => {
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('All');

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    phone: '',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    qualification: '',
    joiningDate: '2022-01-15',
    status: 'ACTIVE'
  });

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formError, setFormError] = useState('');
  const { addToast } = useToast();

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const data = await api.faculty.getAll({ search, department });
      setFacultyList(data);
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to fetch faculty list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, [search, department]);

  const handleOpenAdd = () => {
    setEditingFaculty(null);
    setFormError('');
    setFormData({
      employeeId: `FAC-${String(Math.floor(Math.random() * 800) + 100)}`,
      name: '',
      email: '',
      phone: '',
      department: 'Computer Science',
      designation: 'Assistant Professor',
      qualification: 'Ph.D. in Computer Science',
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE'
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (faculty) => {
    setEditingFaculty(faculty);
    setFormError('');
    setFormData({
      employeeId: faculty.employeeId || '',
      name: faculty.name || '',
      email: faculty.email || '',
      phone: faculty.phone || '',
      department: faculty.department || 'Computer Science',
      designation: faculty.designation || 'Assistant Professor',
      qualification: faculty.qualification || '',
      joiningDate: faculty.joiningDate || '',
      status: faculty.status || 'ACTIVE'
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      if (editingFaculty) {
        await api.faculty.update(editingFaculty.id, formData);
        addToast('Faculty profile updated successfully', 'success');
      } else {
        await api.faculty.create(formData);
        addToast('New faculty member registered successfully', 'success');
      }
      setIsFormOpen(false);
      fetchFaculty();
    } catch (err) {
      setFormError(err.message || 'Failed to save faculty record');
      addToast(err.message || 'Failed to save faculty record', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.faculty.delete(deleteTarget.id);
      addToast(`Faculty member ${deleteTarget.name} removed`, 'success');
      fetchFaculty();
    } catch (err) {
      addToast(err.message || 'Failed to remove faculty member', 'error');
    }
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
            Faculty & Academic Staff
          </h2>
          <p style={{ fontSize: '0.86rem', color: '#64748b' }}>
            Manage professors, lecturers, departmental heads, and academic credentials
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} />
          <span>Add Faculty Member</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
          alignItems: 'center'
        }}>
          <div className="search-wrapper">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search faculty by name, employee ID, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

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
        </div>
      </div>

      {/* Faculty Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Faculty Name</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Qualifications</th>
                <th>Contact</th>
                <th>Joined</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {facultyList && facultyList.length > 0 ? (
                facultyList.map((faculty) => (
                  <tr key={faculty.id || faculty.employeeId}>
                    <td>
                      <span className="badge badge-primary" style={{ fontFamily: 'monospace' }}>
                        {faculty.employeeId}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{faculty.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{faculty.email}</div>
                    </td>
                    <td>{faculty.department}</td>
                    <td>
                      <span className="badge badge-neutral" style={{ fontWeight: 600 }}>
                        {faculty.designation}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: '#334155' }}>
                      {faculty.qualification || '—'}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: '#475569' }}>
                      {faculty.phone}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      {faculty.joiningDate || '—'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <button
                          onClick={() => handleOpenEdit(faculty)}
                          className="btn-icon"
                          title="Edit Faculty"
                        >
                          <Edit2 size={17} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(faculty)}
                          className="btn-icon danger"
                          title="Delete Faculty"
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
                    {loading ? 'Retrieving faculty roster...' : 'No faculty records matching filter criteria.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Faculty Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingFaculty ? `Edit Faculty: ${editingFaculty.name}` : 'Add Faculty Member'}
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
              <label className="form-label required">Employee ID</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.employeeId}
                onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                placeholder="e.g. FAC-101"
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
                placeholder="e.g. Dr. Sarah Connor"
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
                placeholder="faculty@apexcollege.edu"
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
              <label className="form-label required">Designation</label>
              <select
                className="form-select"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              >
                <option value="Professor & HOD">Professor & HOD</option>
                <option value="Professor">Professor</option>
                <option value="Associate Professor">Associate Professor</option>
                <option value="Assistant Professor">Assistant Professor</option>
                <option value="Senior Lecturer">Senior Lecturer</option>
                <option value="Lecturer">Lecturer</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Academic Qualifications</label>
              <input
                type="text"
                className="form-input"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="e.g. Ph.D. in Computer Science (MIT)"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date of Joining</label>
              <input
                type="date"
                className="form-input"
                value={formData.joiningDate}
                onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
              />
            </div>
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
              {editingFaculty ? 'Save Modifications' : 'Register Faculty'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Confirm Faculty Removal"
        message={`Are you sure you want to remove faculty member "${deleteTarget?.name}" (${deleteTarget?.employeeId})? This action cannot be reversed.`}
        confirmText="Confirm Removal"
      />
    </div>
  );
};
