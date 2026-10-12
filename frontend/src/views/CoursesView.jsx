import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  BookOpen, 
  Edit2, 
  Trash2, 
  Award, 
  Layers, 
  User, 
  FileText,
  Search
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

export const CoursesView = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [department, setDepartment] = useState('All');
  const [facultyList, setFacultyList] = useState([]);

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    courseCode: '',
    courseName: '',
    department: 'Computer Science',
    credits: 4,
    semester: 1,
    facultyName: '',
    description: ''
  });

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formError, setFormError] = useState('');
  const { addToast } = useToast();

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const data = await api.courses.getAll({ department });
      setCourses(data);
    } catch (err) {
      console.error(err);
      addToast(err.message || 'Failed to fetch courses', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchFaculty = async () => {
    try {
      const data = await api.faculty.getAll({});
      setFacultyList(data);
    } catch (_) {}
  };

  useEffect(() => {
    fetchCourses();
    fetchFaculty();
  }, [department]);

  const handleOpenAdd = () => {
    setEditingCourse(null);
    setFormError('');
    setFormData({
      courseCode: '',
      courseName: '',
      department: 'Computer Science',
      credits: 4,
      semester: 1,
      facultyName: facultyList[0]?.name || 'Dr. Sarah Connor',
      description: ''
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (course) => {
    setEditingCourse(course);
    setFormError('');
    setFormData({
      courseCode: course.courseCode || '',
      courseName: course.courseName || '',
      department: course.department || 'Computer Science',
      credits: course.credits || 3,
      semester: course.semester || 1,
      facultyName: course.facultyName || '',
      description: course.description || ''
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      if (editingCourse) {
        await api.courses.update(editingCourse.id, formData);
        addToast('Course details updated successfully', 'success');
      } else {
        await api.courses.create(formData);
        addToast('Course created successfully', 'success');
      }
      setIsFormOpen(false);
      fetchCourses();
    } catch (err) {
      setFormError(err.message || 'Failed to save course');
      addToast(err.message || 'Failed to save course', 'error');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.courses.delete(deleteTarget.id);
      addToast(`Course ${deleteTarget.courseCode} deleted`, 'success');
      fetchCourses();
    } catch (err) {
      addToast(err.message || 'Failed to delete course', 'error');
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
            Course & Curriculum Management
          </h2>
          <p style={{ fontSize: '0.86rem', color: '#64748b' }}>
            Design course catalogues, assign instructors, and set credit loads
          </p>
        </div>

        <button onClick={handleOpenAdd} className="btn btn-primary">
          <Plus size={18} />
          <span>Add New Course</span>
        </button>
      </div>

      {/* Department Filter Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        overflowX: 'auto',
        paddingBottom: 4
      }}>
        {DEPARTMENTS.map((dept) => (
          <button
            key={dept}
            onClick={() => setDepartment(dept)}
            className={`btn ${department === dept ? 'btn-primary' : 'btn-secondary'} btn-sm`}
            style={{ borderRadius: 20, whiteSpace: 'nowrap' }}
          >
            {dept === 'All' ? 'All Departments' : dept}
          </button>
        ))}
      </div>

      {/* Courses Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 20
      }}>
        {courses && courses.length > 0 ? (
          courses.map((course) => (
            <div 
              key={course.id || course.courseCode} 
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '22px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span className="badge badge-primary" style={{ fontFamily: 'monospace', fontSize: '0.82rem' }}>
                    {course.courseCode}
                  </span>
                  <span className="badge badge-neutral">
                    {course.credits} Credits • Sem {course.semester}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
                  {course.courseName}
                </h3>

                <div style={{ fontSize: '0.78rem', color: 'var(--primary-700)', fontWeight: 600, marginBottom: 12 }}>
                  {course.department}
                </div>

                <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5, minHeight: 42 }}>
                  {course.description || 'Comprehensive curriculum module with lecture and laboratory requirements.'}
                </p>
              </div>

              <div style={{
                marginTop: 18,
                paddingTop: 14,
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#334155' }}>
                  <User size={15} style={{ color: '#2563eb' }} />
                  <span>{course.facultyName || 'Unassigned'}</span>
                </div>

                <div style={{ display: 'flex', gap: 4 }}>
                  <button
                    onClick={() => handleOpenEdit(course)}
                    className="btn-icon"
                    title="Edit Course"
                    style={{ padding: 6 }}
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(course)}
                    className="btn-icon danger"
                    title="Delete Course"
                    style={{ padding: 6 }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="card" style={{ gridColumn: '1 / -1', padding: '48px', textAlign: 'center', color: '#94a3b8' }}>
            {loading ? 'Retrieving courses catalog...' : 'No courses found in this department.'}
          </div>
        )}
      </div>

      {/* Add / Edit Course Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingCourse ? `Edit Course: ${editingCourse.courseCode}` : 'Register New Course'}
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
              <label className="form-label required">Course Code</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.courseCode}
                onChange={(e) => setFormData({ ...formData, courseCode: e.target.value.toUpperCase() })}
                placeholder="e.g. CS201"
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Course Title</label>
              <input
                type="text"
                className="form-input"
                required
                value={formData.courseName}
                onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                placeholder="e.g. Data Structures & Algorithms"
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
              <label className="form-label required">Credits</label>
              <input
                type="number"
                min="1"
                max="6"
                className="form-input"
                required
                value={formData.credits}
                onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) || 3 })}
              />
            </div>

            <div className="form-group">
              <label className="form-label required">Target Semester</label>
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
              <label className="form-label">Assigned Faculty</label>
              <input
                type="text"
                className="form-input"
                value={formData.facultyName}
                onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
                placeholder="e.g. Dr. Sarah Connor"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: 8 }}>
            <label className="form-label">Syllabus Overview & Description</label>
            <textarea
              className="form-textarea"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Outline course prerequisites, learning objectives, and scope..."
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
              {editingCourse ? 'Save Modifications' : 'Create Course'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Confirm Course Removal"
        message={`Are you sure you want to remove course "${deleteTarget?.courseName}" (${deleteTarget?.courseCode})?`}
        confirmText="Confirm Removal"
      />
    </div>
  );
};
