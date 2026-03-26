import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/axios';
import { UserRole, Department } from '@/utils/types';

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({
    full_name: '', email: '', password: '', role: 'student' as UserRole,
    roll_number: '', department_id: '', semester: '', section: '', admission_year: '',
    employee_id: '', designation: '',
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/departments').then(res => setDepartments(res.data.departments)).catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register({
        ...form,
        department_id: form.department_id ? Number(form.department_id) : undefined,
        semester: form.semester ? Number(form.semester) : undefined,
        admission_year: form.admission_year ? Number(form.admission_year) : undefined,
      });
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--gradient-login-bg)' }}>
      <div className="absolute w-96 h-96 rounded-full opacity-20 float-slow" style={{ background: 'radial-gradient(circle, hsl(210, 100%, 56%), transparent)', top: '10%', right: '20%' }} />
      <div className="w-full max-w-lg bg-card rounded-2xl p-8 relative z-10" style={{ boxShadow: 'var(--shadow-modal)', animation: 'modalSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center font-heading font-bold" style={{ background: 'var(--gradient-primary)', color: 'white' }}>N</div>
          <h1 className="font-heading font-bold text-xl text-foreground">Create Account</h1>
        </div>

        {error && <div className="mb-4 p-3 rounded-lg text-sm font-medium" style={{ background: 'hsl(0 84% 60% / 0.1)', color: 'hsl(0, 84%, 60%)' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
              <input name="full_name" value={form.full_name} onChange={handleChange} className="form-input w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="form-input w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} className="form-input w-full p-2 border rounded" required />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-foreground mb-1">Role</label>
              <select name="role" value={form.role} onChange={handleChange} className="form-select w-full p-2 border rounded">
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
              </select>
            </div>
          </div>

          {form.role === 'student' && (
            <div className="grid grid-cols-2 gap-4 pt-2 border-t mt-4">
              <div><label className="block text-sm font-medium text-foreground mb-1">Roll Number</label><input name="roll_number" value={form.roll_number} onChange={handleChange} className="form-input w-full p-2 border rounded" required /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Department</label><select name="department_id" value={form.department_id} onChange={handleChange} className="form-select w-full p-2 border rounded" required><option value="">Select</option>{departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Semester</label><select name="semester" value={form.semester} onChange={handleChange} className="form-select w-full p-2 border rounded" required>{[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Section</label><input name="section" value={form.section} onChange={handleChange} className="form-input w-full p-2 border rounded" required /></div>
              <div className="col-span-2"><label className="block text-sm font-medium text-foreground mb-1">Admission Year</label><input type="number" name="admission_year" value={form.admission_year} onChange={handleChange} className="form-input w-full p-2 border rounded" required /></div>
            </div>
          )}

          {form.role === 'faculty' && (
            <div className="grid grid-cols-2 gap-4 pt-2 border-t mt-4">
              <div><label className="block text-sm font-medium text-foreground mb-1">Employee ID</label><input name="employee_id" value={form.employee_id} onChange={handleChange} className="form-input w-full p-2 border rounded" required /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Department</label><select name="department_id" value={form.department_id} onChange={handleChange} className="form-select w-full p-2 border rounded" required><option value="">Select</option>{departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
              <div className="col-span-2"><label className="block text-sm font-medium text-foreground mb-1">Designation</label><input name="designation" value={form.designation} onChange={handleChange} className="form-input w-full p-2 border rounded" required /></div>
            </div>
          )}

          <div className="pt-4">
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 bg-primary text-white rounded font-medium disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
        <p className="text-center text-sm text-muted-foreground mt-4">
          Already have an account? <Link to="/login" className="font-semibold text-primary">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
