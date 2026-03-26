import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/common/DashboardLayout';
import Modal from '@/components/common/Modal';
import { Plus, Trash2, Pencil } from 'lucide-react';
import api from '@/api/axios';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Department } from '@/utils/types';

const DepartmentsPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDept, setEditingDept] = useState<any>(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', code: '', description: '' });

  const fetchDepartments = () => {
    setLoading(true);
    api.get('/departments')
      .then(r => setDepartments(r.data.departments || []))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDepartments(); }, []);

  const resetForm = () => { setForm({ name: '', code: '', description: '' }); setEditingDept(null); setError(''); };
  const openAdd = () => { resetForm(); setShowModal(true); };
  const openEdit = (d: any) => {
    setEditingDept(d);
    setForm({ name: d.name || '', code: d.code || '', description: d.description || '' });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (editingDept) {
        await api.put(`/departments/${editingDept.id}`, form);
      } else {
        await api.post('/departments', form);
      }
      setShowModal(false);
      resetForm();
      fetchDepartments();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this department?')) return;
    try { await api.delete(`/departments/${id}`); fetchDepartments(); } catch (err) { console.error(err); }
  };

  if (loading) return <DashboardLayout title="Departments"><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout title="Departments">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Departments</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Department</button>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b">
            <tr><th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Code</th><th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Name</th><th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Description</th><th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Students</th><th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Faculty</th><th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {departments.map(d => (
              <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-4"><span className="badge badge-blue">{d.code}</span></td>
                <td className="p-4 font-medium text-foreground">{d.name}</td>
                <td className="p-4 text-muted-foreground">{d.description || '—'}</td>
                <td className="p-4 text-foreground">{d.student_count || 0}</td>
                <td className="p-4 text-foreground">{d.faculty_count || 0}</td>
                <td className="p-4">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(d)} className="p-1.5 rounded-lg hover:bg-muted text-primary opacity-70 hover:opacity-100" title="Edit"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(d.id)} className="p-1.5 rounded-lg hover:bg-muted text-destructive opacity-70 hover:opacity-100" title="Delete"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {departments.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No departments found.</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editingDept ? 'Edit Department' : 'Add Department'}>
        {error && <div className="mb-4 p-3 rounded-lg text-sm font-medium" style={{ background: 'hsl(0 84% 60% / 0.1)', color: 'hsl(0, 84%, 60%)' }}>{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-foreground mb-1">Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="form-input w-full p-2 border rounded" required /></div>
          <div><label className="block text-sm font-medium text-foreground mb-1">Code</label><input value={form.code} onChange={e => setForm({...form, code: e.target.value})} className="form-input w-full p-2 border rounded" required /></div>
          <div><label className="block text-sm font-medium text-foreground mb-1">Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="form-input w-full p-2 border rounded" rows={3} /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-outline px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="btn-primary px-4 py-2 bg-primary text-white rounded">{editingDept ? 'Save Changes' : 'Add Department'}</button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default DepartmentsPage;
