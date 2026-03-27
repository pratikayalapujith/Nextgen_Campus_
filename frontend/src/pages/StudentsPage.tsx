import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/common/DashboardLayout';
import Modal from '@/components/common/Modal';
import { Plus, Trash2, Search, Pencil } from 'lucide-react';
import api from '@/api/axios';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ full_name: '', email: '', password: '', roll_number: '', department_id: '', semester: '1', section: '', admission_year: '' });

  const fetchData = () => {
    setLoading(true);
    let url = '/students?per_page=100';
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (deptFilter) url += `&department_id=${deptFilter}`;

    Promise.all([
      api.get(url),
      api.get('/departments')
    ]).then(([stRes, deptsRes]) => {
      setStudents(stRes.data.items || stRes.data.students || []);
      setDepartments(deptsRes.data.departments || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [search, deptFilter]);

  const resetForm = () => {
    setForm({ full_name: '', email: '', password: '', roll_number: '', department_id: '', semester: '1', section: '', admission_year: '' });
    setEditingStudent(null);
    setError('');
  };

  const openAdd = () => { resetForm(); setShowModal(true); };

  const openEdit = (s: any) => {
    setEditingStudent(s);
    setForm({
      full_name: s.full_name || '',
      email: s.email || '',
      password: '',
      roll_number: s.roll_number || '',
      department_id: String(s.department_id || ''),
      semester: String(s.semester || '1'),
      section: s.section || '',
      admission_year: String(s.admission_year || ''),
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editingStudent) {
        await api.put(`/students/${editingStudent.id}`, {
          full_name: form.full_name,
          semester: Number(form.semester),
          section: form.section,
          department_id: Number(form.department_id),
        });
      } else {
        await api.post('/students', {
          ...form,
          department_id: Number(form.department_id),
          semester: Number(form.semester),
          admission_year: Number(form.admission_year),
        });
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this student? This will also remove their attendance records.')) return;
    try {
      await api.delete(`/students/${id}`);
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete student');
    }
  };

  if (loading && students.length === 0 && !search && !deptFilter)
    return <DashboardLayout title="Students"><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout title="Students">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground mb-3">Students</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or roll..." className="form-input pl-9 w-full sm:w-64 border rounded p-2" />
            </div>
            <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className="form-select w-full sm:w-48 border rounded p-2">
              <option value="">All Departments</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2 self-start sm:self-auto"><Plus size={16} /> Add Student</button>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Roll No</th>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Name</th>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Email</th>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Department</th>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Semester</th>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Section</th>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {students.map(s => (
              <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-medium text-foreground">{s.roll_number}</td>
                <td className="p-4 text-foreground">{s.full_name}</td>
                <td className="p-4 text-muted-foreground">{s.email}</td>
                <td className="p-4"><span className="badge badge-blue">{s.department_code || departments.find(d => d.id === s.department_id)?.code}</span></td>
                <td className="p-4 text-foreground">{s.semester}</td>
                <td className="p-4 text-foreground">{s.section}</td>
                <td className="p-4">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-muted text-primary opacity-70 hover:opacity-100" title="Edit"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg hover:bg-muted text-destructive opacity-70 hover:opacity-100" title="Delete"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {students.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No students found.</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editingStudent ? 'Edit Student' : 'Add Student'}>
        {error && <div className="mb-4 p-3 rounded-lg text-sm font-medium" style={{ background: 'hsl(0 84% 60% / 0.1)', color: 'hsl(0, 84%, 60%)' }}>{error}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><label className="block text-sm font-medium text-foreground mb-1">Full Name</label><input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} className="form-input w-full p-2 border rounded" required /></div>
          {!editingStudent && (
            <>
              <div><label className="block text-sm font-medium text-foreground mb-1">Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="form-input w-full p-2 border rounded" required /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Password</label><input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="form-input w-full p-2 border rounded" required /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Roll Number</label><input value={form.roll_number} onChange={e => setForm({...form, roll_number: e.target.value})} className="form-input w-full p-2 border rounded" required /></div>
              <div className="col-span-2"><label className="block text-sm font-medium text-foreground mb-1">Admission Year</label><input type="number" value={form.admission_year} onChange={e => setForm({...form, admission_year: e.target.value})} className="form-input w-full p-2 border rounded" required /></div>
            </>
          )}
          <div><label className="block text-sm font-medium text-foreground mb-1">Department</label><select value={form.department_id} onChange={e => setForm({...form, department_id: e.target.value})} className="form-select w-full p-2 border rounded" required><option value="">Select</option>{departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-foreground mb-1">Semester</label><select value={form.semester} onChange={e => setForm({...form, semester: e.target.value})} className="form-select w-full p-2 border rounded">{[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          <div className="col-span-2"><label className="block text-sm font-medium text-foreground mb-1">Section</label><input value={form.section} onChange={e => setForm({...form, section: e.target.value})} className="form-input w-full p-2 border rounded" required /></div>
          <div className="col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-outline px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="btn-primary px-4 py-2 bg-primary text-white rounded">{editingStudent ? 'Save Changes' : 'Add Student'}</button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default StudentsPage;
