import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/common/DashboardLayout';
import Modal from '@/components/common/Modal';
import { useAuth } from '@/context/AuthContext';
import api from '@/api/axios';
import { Notice } from '@/utils/types';
import { CATEGORY_COLORS } from '@/utils/constants';
import { Plus, X } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const NoticesPage: React.FC = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', category: 'general', target_role: 'all', is_pinned: false });

  const fetchNotices = () => {
    setLoading(true);
    api.get('/notices')
      .then(r => setNotices(r.data.notices))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const visibleNotices = notices.filter(n => n.target_role === 'all' || n.target_role === user?.role).sort((a, b) => (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0));

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/notices', form);
      setShowModal(false);
      setForm({ title: '', content: '', category: 'general', target_role: 'all', is_pinned: false });
      fetchNotices();
    } catch (err) {
      console.error('Failed to post notice', err);
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm('Delete this notice?')) return;
    try {
      await api.delete(`/notices/${id}`);
      fetchNotices();
    } catch (err) {
      console.error('Failed to delete notice', err);
    }
  };

  const canPost = user?.role === 'admin' || user?.role === 'faculty';
  const canDelete = (n: Notice) => user?.role === 'admin' || n.author_id === user?.id;

  if (loading) return <DashboardLayout title="Notices"><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout title="Notices">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Notices</h1>
          <p className="text-sm text-muted-foreground mt-1">Campus announcements</p>
        </div>
        {canPost && (
          <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> Post Notice</button>
        )}
      </div>

      <div className="space-y-4">
        {visibleNotices.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No notices found</div>
        ) : (
          visibleNotices.map(notice => (
            <div
              key={notice.id}
              className="bg-card rounded-xl border p-5 transition-all hover:shadow-md relative"
              style={{ boxShadow: 'var(--shadow-card)', borderLeft: notice.is_pinned ? '4px solid hsl(var(--accent))' : undefined }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`badge ${CATEGORY_COLORS[notice.category]}`}>{notice.category}</span>
                    <span className="badge badge-gray">{notice.target_role}</span>
                    {notice.is_pinned && <span className="badge badge-yellow">📌 Pinned</span>}
                  </div>
                  <h3 className="font-heading font-semibold text-foreground mb-1">{notice.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2 whitespace-pre-wrap">{notice.content}</p>
                  <p className="text-xs text-muted-foreground">{notice.author?.full_name} · {notice.published_at}</p>
                </div>
                {canDelete(notice) && (
                  <button onClick={() => handleDelete(notice.id)} className="p-1.5 rounded-lg hover:bg-muted text-destructive transition-colors opacity-70 hover:opacity-100">
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Post Notice">
        <form onSubmit={handleAdd} className="space-y-4">
          <div><label className="block text-sm font-medium text-foreground mb-1">Title</label><input value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="form-input w-full p-2 border rounded" required /></div>
          <div><label className="block text-sm font-medium text-foreground mb-1">Content</label><textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} className="form-input w-full p-2 border rounded" rows={4} required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-foreground mb-1">Category</label><select value={form.category} onChange={e => setForm({...form, category: e.target.value as any})} className="form-select w-full p-2 border rounded"><option value="general">General</option><option value="academic">Academic</option><option value="event">Event</option><option value="exam">Exam</option><option value="urgent">Urgent</option></select></div>
            <div><label className="block text-sm font-medium text-foreground mb-1">Target</label><select value={form.target_role} onChange={e => setForm({...form, target_role: e.target.value as any})} className="form-select w-full p-2 border rounded"><option value="all">All</option><option value="student">Students</option><option value="faculty">Faculty</option></select></div>
          </div>
          {user?.role === 'admin' && (
            <label className="flex items-center gap-2 text-sm font-medium text-foreground">
              <input type="checkbox" checked={form.is_pinned} onChange={e => setForm({...form, is_pinned: e.target.checked})} className="rounded" /> Pin this notice
            </label>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-outline px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="btn-primary px-4 py-2 bg-primary text-white rounded">Post Notice</button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default NoticesPage;
