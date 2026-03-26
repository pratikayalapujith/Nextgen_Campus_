import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/common/DashboardLayout';
import Modal from '@/components/common/Modal';
import { useAuth } from '@/context/AuthContext';
import { FacilityBooking, Facility } from '@/utils/types';
import { BOOKING_STATUS_COLORS } from '@/utils/constants';
import { Plus, Check, X } from 'lucide-react';
import api from '@/api/axios';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const BookingsPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ facility_id: '', purpose: '', date: '', start_time: '', end_time: '' });

  const fetchData = () => {
    setLoading(true);
    setErrorMsg('');
    Promise.all([
      api.get('/bookings?per_page=100'),
      api.get('/facilities')
    ]).then(([bookRes, facRes]) => {
      setBookings(bookRes.data.items || []);
      setFacilities(facRes.data.facilities || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await api.post('/bookings', { ...form, facility_id: Number(form.facility_id) });
      setShowModal(false);
      setForm({ facility_id: '', purpose: '', date: '', start_time: '', end_time: '' });
      fetchData();
    } catch (err: any) {
      setErrorMsg(err.response?.data?.error || 'Failed to submit booking');
    }
  };

  const updateStatus = async (id: number, action: 'approve' | 'reject' | 'cancel') => {
    try {
      if (action === 'cancel') {
        if(!confirm('Are you sure you want to cancel this booking?')) return;
        await api.delete(`/bookings/${id}`);
      } else {
        await api.put(`/bookings/${id}/${action}`);
      }
      fetchData();
    } catch (err) {
      console.error(`Failed to ${action} booking`, err);
    }
  };

  if (loading) return <DashboardLayout title="Bookings"><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout title="Bookings">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Bookings</h1>
        <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2"><Plus size={16} /> New Booking</button>
      </div>

      {errorMsg && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{errorMsg}</div>}

      <div className="bg-card rounded-xl border overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Facility</th>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Purpose</th>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Date</th>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Time</th>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Booker</th>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Status</th>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {bookings.map(b => (
              <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                <td className="p-4 font-medium text-foreground">{b.facility_name}</td>
                <td className="p-4 text-foreground">{b.purpose}</td>
                <td className="p-4 text-muted-foreground">{b.date}</td>
                <td className="p-4 text-muted-foreground">{b.start_time} - {b.end_time}</td>
                <td className="p-4 text-muted-foreground">{b.booker_name}</td>
                <td className="p-4"><span className={`badge ${BOOKING_STATUS_COLORS[b.status]}`}>{b.status}</span></td>
                <td className="p-4">
                  <div className="flex gap-1">
                    {user?.role === 'admin' && b.status === 'pending' && (
                      <>
                        <button onClick={() => updateStatus(b.id, 'approve')} className="p-1.5 rounded-lg hover:bg-muted text-success opacity-70 hover:opacity-100" title="Approve"><Check size={16} /></button>
                        <button onClick={() => updateStatus(b.id, 'reject')} className="p-1.5 rounded-lg hover:bg-muted text-destructive opacity-70 hover:opacity-100" title="Reject"><X size={16} /></button>
                      </>
                    )}
                    {(user?.role === 'admin' || b.booked_by === user?.id) && !['cancelled', 'rejected'].includes(b.status) && (
                      <button onClick={() => updateStatus(b.id, 'cancel')} className="text-xs font-medium text-muted-foreground hover:text-destructive underline decoration-dotted underline-offset-2 ml-1">Cancel</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {bookings.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-muted-foreground">No bookings found.</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Booking">
        <form onSubmit={handleAdd} className="space-y-4">
          <div><label className="block text-sm font-medium text-foreground mb-1">Facility</label><select value={form.facility_id} onChange={e => setForm({...form, facility_id: e.target.value})} className="form-select w-full p-2 border rounded" required><option value="">Select</option>{facilities.filter(f => f.is_available).map(f => <option key={f.id} value={f.id}>{f.name}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-foreground mb-1">Purpose</label><input value={form.purpose} onChange={e => setForm({...form, purpose: e.target.value})} className="form-input w-full p-2 border rounded" required /></div>
          <div><label className="block text-sm font-medium text-foreground mb-1">Date</label><input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="form-input w-full p-2 border rounded" required /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-foreground mb-1">Start Time</label><input type="time" value={form.start_time} onChange={e => setForm({...form, start_time: e.target.value})} className="form-input w-full p-2 border rounded" required /></div>
            <div><label className="block text-sm font-medium text-foreground mb-1">End Time</label><input type="time" value={form.end_time} onChange={e => setForm({...form, end_time: e.target.value})} className="form-input w-full p-2 border rounded" required /></div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setShowModal(false)} className="btn-outline px-4 py-2 border rounded">Cancel</button>
            <button type="submit" className="btn-primary px-4 py-2 bg-primary text-white rounded">Submit Booking</button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default BookingsPage;
