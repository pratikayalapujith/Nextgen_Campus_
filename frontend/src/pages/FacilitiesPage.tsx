import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/common/DashboardLayout';
import Modal from '@/components/common/Modal';
import { Facility } from '@/utils/types';
import { Plus, Trash2, MapPin, Users, Pencil } from 'lucide-react';
import api from '@/api/axios';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const FacilitiesPage: React.FC = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFacility, setEditingFacility] = useState<any>(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', type: 'lab' as Facility['type'], capacity: '', location: '', description: '' });

  const fetchFacilities = () => {
    setLoading(true);
    api.get('/facilities').then(res => setFacilities(res.data.facilities || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchFacilities(); }, []);

  const resetForm = () => { setForm({ name: '', type: 'lab', capacity: '', location: '', description: '' }); setEditingFacility(null); setError(''); };
  const openAdd = () => { resetForm(); setShowModal(true); };
  const openEdit = (f: any) => {
    setEditingFacility(f);
    setForm({ name: f.name || '', type: f.type || 'lab', capacity: String(f.capacity || ''), location: f.location || '', description: f.description || '' });
    setError('');
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form, capacity: Number(form.capacity) };
      if (editingFacility) {
        await api.put(`/facilities/${editingFacility.id}`, payload);
      } else {
        await api.post('/facilities', payload);
      }
      setShowModal(false);
      resetForm();
      fetchFacilities();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this facility?')) return;
    try { await api.delete(`/facilities/${id}`); fetchFacilities(); } catch (err) { console.error(err); }
  };

  if (loading) return <DashboardLayout title="Facilities"><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout title="Facilities">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Facilities</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2"><Plus size={16} /> Add Facility</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {facilities.map(f => (
          <div key={f.id} className="bg-card rounded-xl border p-5 transition-all hover:shadow-md" style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-heading font-semibold text-foreground">{f.name}</h3>
              <div className="flex gap-1">
                <button onClick={() => openEdit(f)} className="p-1.5 rounded-lg hover:bg-muted text-primary opacity-70 hover:opacity-100" title="Edit"><Pencil size={14} /></button>
                <button onClick={() => handleDelete(f.id)} className="p-1.5 rounded-lg hover:bg-muted text-destructive opacity-70 hover:opacity-100" title="Delete"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="space-y-1.5 text-sm text-muted-foreground mb-3">
              <p className="capitalize"><span className="badge badge-blue">{f.type.replace('_', ' ')}</span></p>
              <p className="flex items-center gap-1"><Users size={14} /> Capacity: {f.capacity}</p>
              <p className="flex items-center gap-1"><MapPin size={14} /> {f.location}</p>
              {f.description && <p>{f.description}</p>}
            </div>
            <span className={`badge ${f.is_available ? 'badge-green' : 'badge-red'}`}>{f.is_available ? 'Available' : 'Unavailable'}</span>
          </div>
        ))}
        {facilities.length === 0 && <p className="text-muted-foreground col-span-3">No facilities found.</p>}
      </div>

      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editingFacility ? 'Edit Facility' : 'Add Facility'}>
        {error && <div className="mb-4 p-3 rounded-lg text-sm font-medium" style={{ background: 'hsl(0 84% 60% / 0.1)', color: 'hsl(0, 84%, 60%)' }}>{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="block text-sm font-medium text-foreground mb-1">Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="form-input w-full p-2 border rounded" required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-foreground mb-1">Type</label><select value={form.type} onChange={e => setForm({...form, type: e.target.value as any})} className="form-select w-full p-2 border rounded"><option value="lab">Lab</option><option value="hall">Hall</option><option value="seminar_room">Seminar Room</option><option value="sports">Sports</option></select></div>
            <div><label className="block text-sm font-medium text-foreground mb-1">Capacity</label><input type="number" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} className="form-input w-full p-2 border rounded" required /></div>
          </div>
          <div><label className="block text-sm font-medium text-foreground mb-1">Location</label><input value={form.location} onChange={e => setForm({...form, location: e.target.value})} className="form-input w-full p-2 border rounded" required /></div>
          <div><label className="block text-sm font-medium text-foreground mb-1">Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="form-input w-full p-2 border rounded" rows={3} /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-outline px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="btn-primary px-4 py-2 bg-primary text-white rounded">{editingFacility ? 'Save Changes' : 'Add Facility'}</button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default FacilitiesPage;
