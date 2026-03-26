import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/common/DashboardLayout';
import Modal from '@/components/common/Modal';
import { useAuth } from '@/context/AuthContext';
import { DAY_NAMES, DAY_SHORT } from '@/utils/constants';
import { Plus, Trash2, Pencil } from 'lucide-react';
import api from '@/api/axios';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const TimetablePage: React.FC = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    subject_id: '', faculty_id: '', department_id: '', semester: '1', section: '',
    day_of_week: '0', start_time: '09:00', end_time: '10:00', room: ''
  });

  const isAdmin = user?.role === 'admin';

  const fetchData = () => {
    setLoading(true);
    const requests: Promise<any>[] = [api.get(isAdmin ? '/timetable' : '/timetable/my')];
    if (isAdmin) {
      requests.push(api.get('/subjects'), api.get('/faculty'), api.get('/departments'));
    }
    Promise.all(requests).then(([ttRes, subsRes, facRes, deptRes]) => {
      setEntries(ttRes.data.timetable || []);
      if (subsRes) setSubjects(subsRes.data.subjects || []);
      if (facRes) setFaculty(facRes.data.items || facRes.data.faculty || []);
      if (deptRes) setDepartments(deptRes.data.departments || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const resetForm = () => {
    setForm({ subject_id: '', faculty_id: '', department_id: '', semester: '1', section: '', day_of_week: '0', start_time: '09:00', end_time: '10:00', room: '' });
    setEditingEntry(null); setError('');
  };

  const openAdd = () => { resetForm(); setShowModal(true); };
  const openEdit = (e: any) => {
    setEditingEntry(e);
    setForm({
      subject_id: String(e.subject_id || ''), faculty_id: String(e.faculty_id || ''),
      department_id: String(e.department_id || ''), semester: String(e.semester || '1'),
      section: e.section || '', day_of_week: String(e.day_of_week ?? '0'),
      start_time: e.start_time || '09:00', end_time: e.end_time || '10:00', room: e.room || '',
    });
    setError(''); setShowModal(true);
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault(); setError('');
    try {
      const payload = {
        subject_id: Number(form.subject_id), faculty_id: Number(form.faculty_id),
        department_id: Number(form.department_id), semester: Number(form.semester),
        section: form.section || null, day_of_week: Number(form.day_of_week),
        start_time: form.start_time, end_time: form.end_time, room: form.room || null,
      };
      if (editingEntry) {
        await api.put(`/timetable/${editingEntry.id}`, payload);
      } else {
        await api.post('/timetable', payload);
      }
      setShowModal(false); resetForm(); fetchData();
    } catch (err: any) { setError(err.response?.data?.error || 'Operation failed'); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this timetable entry?')) return;
    try { await api.delete(`/timetable/${id}`); fetchData(); } catch (err) { console.error(err); }
  };

  const groupedByDay = DAY_NAMES.map((day, idx) => ({
    day, short: DAY_SHORT[idx],
    entries: entries.filter(e => e.day_of_week === idx).sort((a: any, b: any) => a.start_time.localeCompare(b.start_time)),
  })).filter(g => g.entries.length > 0);

  if (loading) return <DashboardLayout title="Timetable"><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout title="Timetable">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Timetable</h1>
        {isAdmin && <button onClick={openAdd} className="btn-primary flex items-center gap-2"><Plus size={16} /> Assign Class</button>}
      </div>

      {groupedByDay.length === 0 ? (
        <div className="bg-card rounded-xl border p-8 text-center" style={{ boxShadow: 'var(--shadow-card)' }}>
          <p className="text-muted-foreground">No timetable entries found.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {groupedByDay.map(group => (
            <div key={group.day}>
              <div className="flex items-center gap-3 mb-4">
                <span className="badge badge-blue font-bold">{group.short}</span>
                <h3 className="font-heading font-bold text-lg text-foreground">{group.day}</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {group.entries.map((entry: any) => (
                  <div key={entry.id} className="timetable-card relative group">
                    {isAdmin && (
                      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(entry)} className="p-1 rounded-lg hover:bg-muted text-primary"><Pencil size={14} /></button>
                        <button onClick={() => handleDelete(entry.id)} className="p-1 rounded-lg hover:bg-muted text-destructive"><Trash2 size={14} /></button>
                      </div>
                    )}
                    <h4 className="font-heading font-semibold text-foreground mb-2">{entry.subject_name}</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>⏰ {entry.start_time} – {entry.end_time}</p>
                      <p>👨‍🏫 {entry.faculty_name}</p>
                      <p>🏫 {entry.room || '—'}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span className="badge badge-blue">{entry.subject_code}</span>
                      {entry.section && <span className="badge badge-gray">Sec {entry.section}</span>}
                      <span className="badge badge-purple">Sem {entry.semester}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Admin modal for assigning classes */}
      <Modal isOpen={showModal} onClose={() => { setShowModal(false); resetForm(); }} title={editingEntry ? 'Edit Class' : 'Assign Class'}>
        {error && <div className="mb-4 p-3 rounded-lg text-sm font-medium" style={{ background: 'hsl(0 84% 60% / 0.1)', color: 'hsl(0, 84%, 60%)' }}>{error}</div>}
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">Subject</label>
            <select value={form.subject_id} onChange={e => setForm({...form, subject_id: e.target.value})} className="form-select w-full p-2 border rounded" required>
              <option value="">Select Subject</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">Faculty</label>
            <select value={form.faculty_id} onChange={e => setForm({...form, faculty_id: e.target.value})} className="form-select w-full p-2 border rounded" required>
              <option value="">Select Faculty</option>
              {faculty.map(f => <option key={f.id} value={f.id}>{f.full_name} ({f.employee_id})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Department</label>
            <select value={form.department_id} onChange={e => setForm({...form, department_id: e.target.value})} className="form-select w-full p-2 border rounded" required>
              <option value="">Select</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Day</label>
            <select value={form.day_of_week} onChange={e => setForm({...form, day_of_week: e.target.value})} className="form-select w-full p-2 border rounded">
              {DAY_NAMES.map((d, i) => <option key={i} value={i}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Semester</label>
            <select value={form.semester} onChange={e => setForm({...form, semester: e.target.value})} className="form-select w-full p-2 border rounded">
              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Section</label>
            <input value={form.section} onChange={e => setForm({...form, section: e.target.value})} className="form-input w-full p-2 border rounded" placeholder="e.g. A" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Start Time</label>
            <input type="time" value={form.start_time} onChange={e => setForm({...form, start_time: e.target.value})} className="form-input w-full p-2 border rounded" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">End Time</label>
            <input type="time" value={form.end_time} onChange={e => setForm({...form, end_time: e.target.value})} className="form-input w-full p-2 border rounded" required />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">Room</label>
            <input value={form.room} onChange={e => setForm({...form, room: e.target.value})} className="form-input w-full p-2 border rounded" placeholder="e.g. CR-101" />
          </div>
          <div className="col-span-2 flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="btn-outline px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="btn-primary px-4 py-2 bg-primary text-white rounded">{editingEntry ? 'Save Changes' : 'Assign Class'}</button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default TimetablePage;
