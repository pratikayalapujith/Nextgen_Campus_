import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/common/DashboardLayout';
import Modal from '@/components/common/Modal';
import { Plus, Trash2, Pencil } from 'lucide-react';
import api from '@/api/axios';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const SubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ code: '', name: '', department_id: '', semester: '1', credits: '3' });

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      api.get('/subjects'),
      api.get('/departments')
    ]).then(([subs, depts]) => {
      setSubjects(subs.data.subjects || subs.data.items || []);
      setDepartments(depts.data.departments || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => { setForm({ code: '', name: '', department_id: '', semester: '1', credits: '3' }); setEditingSubject(null); setError(''); };
  const openAdd = () => { resetForm(); setShowModal(true); };
  const openEdit = (s: any) => {
    setEditingSubject(s);
    setForm({
      code: s.code || '',
      name: s.name || '',
      department_id: String(s.department_id || ''),
      semester: String(s.semester || '1'),
      credits: String(s.credits || '3'),
    });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...form,
        department_id: Number(form.department_id),
        semester: Number(form.semester),
        credits: Number(form.credits),
      };
      if (editingSubject) {
        await api.put(`/subjects/${editingSubject.id}`, payload);
      } else {
        await api.post('/subjects', payload);
      }
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this subject?')) return;
    try { await api.delete(`/subjects/${id}`); fetchData(); } catch (err) { console.error(err); }
  };

  if (loading) return <DashboardLayout title="Subjects"><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout title="Subjects">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Subjects</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Subject</button>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Code</th>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Name</th>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Department</th>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Semester</th>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Credits</th>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {subjects.map(s => (
              <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-4"><span className="badge badge-blue">{s.code}</span></td>
                <td className="p-4 font-medium text-foreground">{s.name}</td>
                <td className="p-4 text-muted-foreground">{s.department_name || departments.find((d: any) => d.id === s.department_id)?.name || '—'}</td>
                <td className="p-4 text-foreground">{s.semester}</td>
                <td className="p-4 text-foreground">{s.credits}</td>
                <td className="p-4">
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-muted text-primary opacity-70 hover:opacity-100" title="Edit"><Pencil size={15} /></button>
                    <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg hover:bg-muted text-destructive opacity-70 hover:opacity-100" title="Delete"><Trash2 size={15} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {subjects.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No subjects found.</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editingSubject ? 'Edit Subject' : 'Add Subject'}>
        {error && <div className="mb-4 p-3 rounded-lg text-sm font-medium" style={{ background: 'hsl(0 84% 60% / 0.1)', color: 'hsl(0, 84%, 60%)' }}>{error}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium text-foreground mb-1">Code</label><input value={form.code} onChange={e => setForm({...form, code: e.target.value})} className="form-input w-full p-2 border rounded" required /></div>
          <div><label className="block text-sm font-medium text-foreground mb-1">Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="form-input w-full p-2 border rounded" required /></div>
          <div><label className="block text-sm font-medium text-foreground mb-1">Department</label><select value={form.department_id} onChange={e => setForm({...form, department_id: e.target.value})} className="form-select w-full p-2 border rounded" required><option value="">Select</option>{departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-foreground mb-1">Semester</label><select value={form.semester} onChange={e => setForm({...form, semester: e.target.value})} className="form-select w-full p-2 border rounded">{[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
          <div className="col-span-2"><label className="block text-sm font-medium text-foreground mb-1">Credits</label><input type="number" value={form.credits} onChange={e => setForm({...form, credits: e.target.value})} className="form-input w-full p-2 border rounded" required /></div>
          <div className="col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-outline px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="btn-primary px-4 py-2 bg-primary text-white rounded">{editingSubject ? 'Save Changes' : 'Add Subject'}</button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default SubjectsPage;
