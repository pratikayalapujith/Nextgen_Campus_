import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/common/DashboardLayout';
import Modal from '@/components/common/Modal';
import { Plus, Trash2, Pencil } from 'lucide-react';
import api from '@/api/axios';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const FacultyPage: React.FC = () => {
  const [faculty, setFaculty] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<any>(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ full_name: '', email: '', password: '', employee_id: '', department_id: '', designation: '', qualification: '' });

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      api.get('/faculty'),
      api.get('/departments')
    ]).then(([fac, depts]) => {
      setFaculty(fac.data.items || fac.data.faculty || []);
      setDepartments(depts.data.departments || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setForm({ full_name: '', email: '', password: '', employee_id: '', department_id: '', designation: '', qualification: '' });
    setEditingFaculty(null);
    setError('');
  };

  const openAdd = () => { resetForm(); setShowModal(true); };

  const openEdit = (f: any) => {
    setEditingFaculty(f);
    setForm({
      full_name: f.full_name || '',
      email: f.email || '',
      password: '',
      employee_id: f.employee_id || '',
      department_id: String(f.department_id || ''),
      designation: f.designation || '',
      qualification: f.qualification || '',
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editingFaculty) {
        await api.put(`/faculty/${editingFaculty.id}`, {
          full_name: form.full_name,
          department_id: Number(form.department_id),
          designation: form.designation,
          qualification: form.qualification,
        });
      } else {
        await api.post('/faculty', { ...form, department_id: Number(form.department_id) });
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this faculty member?')) return;
    try {
      await api.delete(`/faculty/${id}`);
      fetchData();
    } catch (err) { console.error(err); }
  };

  if (loading) return <DashboardLayout title="Faculty"><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout title="Faculty">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Faculty</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Faculty</button>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Employee ID</th>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Name</th>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Email</th>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Department</th>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Designation</th>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Qualification</th>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {faculty.map(f => (
              <tr key={f.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-medium text-foreground">{f.employee_id}</td>
                <td className="p-4 text-foreground">{f.full_name}</td>
                <td className="p-4 text-muted-foreground">{f.email}</td>
                <td className="p-4"><span className="badge badge-blue">{f.department_code || departments.find(d => d.id === f.department_id)?.code || '—'}</span></td>
                <td className="p-4 text-foreground">{f.designation}</td>
                <td className="p-4 text-muted-foreground">{f.qualification || '—'}</td>
                <td className="p-4">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(f)} className="p-1.5 rounded-lg hover:bg-muted text-primary opacity-70 hover:opacity-100" title="Edit"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(f.id)} className="p-1.5 rounded-lg hover:bg-muted text-destructive opacity-70 hover:opacity-100" title="Delete"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {faculty.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No faculty members found.</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editingFaculty ? 'Edit Faculty' : 'Add Faculty'}>
        {error && <div className="mb-4 p-3 rounded-lg text-sm font-medium" style={{ background: 'hsl(0 84% 60% / 0.1)', color: 'hsl(0, 84%, 60%)' }}>{error}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><label className="block text-sm font-medium text-foreground mb-1">Full Name</label><input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} className="form-input w-full p-2 border rounded" required /></div>
          {!editingFaculty && (
            <>
              <div><label className="block text-sm font-medium text-foreground mb-1">Email</label><input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="form-input w-full p-2 border rounded" required /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Password</label><input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="form-input w-full p-2 border rounded" required /></div>
              <div><label className="block text-sm font-medium text-foreground mb-1">Employee ID</label><input value={form.employee_id} onChange={e => setForm({...form, employee_id: e.target.value})} className="form-input w-full p-2 border rounded" required /></div>
            </>
          )}
          <div><label className="block text-sm font-medium text-foreground mb-1">Department</label><select value={form.department_id} onChange={e => setForm({...form, department_id: e.target.value})} className="form-select w-full p-2 border rounded" required><option value="">Select</option>{departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-foreground mb-1">Designation</label><input value={form.designation} onChange={e => setForm({...form, designation: e.target.value})} className="form-input w-full p-2 border rounded" required /></div>
          <div className={editingFaculty ? '' : 'col-span-2'}><label className="block text-sm font-medium text-foreground mb-1">Qualification</label><input value={form.qualification} onChange={e => setForm({...form, qualification: e.target.value})} className="form-input w-full p-2 border rounded" /></div>
          <div className="col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-outline px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="btn-primary px-4 py-2 bg-primary text-white rounded">{editingFaculty ? 'Save Changes' : 'Add Faculty'}</button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default FacultyPage;
