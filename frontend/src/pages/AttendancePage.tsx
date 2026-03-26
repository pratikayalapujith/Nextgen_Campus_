import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/common/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { ArrowLeft, CheckCircle, Percent, BookOpen, XCircle, Clock } from 'lucide-react';
import api from '@/api/axios';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const AttendancePage: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === 'faculty') return <FacultyAttendance />;
  if (user.role === 'student') return <StudentAttendance />;
  return <AdminAttendance />;
};

/* ═══════════════════════════════════════════════════════════════
   FACULTY — Pick a class → see students → mark attendance
   ═══════════════════════════════════════════════════════════════ */
const FacultyAttendance: React.FC = () => {
  const [entries, setEntries] = useState<any[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [students, setStudents] = useState<any[]>([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [statuses, setStatuses] = useState<Record<number, 'present' | 'absent' | 'late'>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/timetable/my')
      .then(r => setEntries(r.data.timetable || []))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectEntry = async (entry: any) => {
    setLoading(true); setError('');
    try {
      const res = await api.get(`/attendance/students-for-class?timetable_entry_id=${entry.id}`);
      const sList = res.data.students || [];
      setStudents(sList);
      const defaults: Record<number, 'present'> = {};
      sList.forEach((s: any) => { defaults[s.id] = 'present'; });
      setStatuses(defaults);
      setSelectedEntry(entry);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load students');
    } finally { setLoading(false); }
  };

  const handleToggle = (studentId: number, status: 'present' | 'absent' | 'late') => {
    setStatuses(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSubmit = async () => {
    setSubmitting(true); setError('');
    try {
      const records = students.map(s => ({
        student_id: s.id,
        status: statuses[s.id] || 'present'
      }));
      await api.post('/attendance/mark', {
        timetable_entry_id: selectedEntry.id,
        date,
        records
      });
      setSubmitted(true);
      setTimeout(() => { setSubmitted(false); setSelectedEntry(null); setStatuses({}); }, 2500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to submit attendance');
    } finally { setSubmitting(false); }
  };

  if (loading) return <DashboardLayout title="Mark Attendance"><LoadingSpinner /></DashboardLayout>;

  /* ─── Marking view ─── */
  if (selectedEntry) {
    const presentCount = Object.values(statuses).filter(s => s === 'present').length;
    const absentCount = Object.values(statuses).filter(s => s === 'absent').length;
    const lateCount = Object.values(statuses).filter(s => s === 'late').length;

    return (
      <DashboardLayout title="Mark Attendance">
        {submitted ? (
          <div className="flex flex-col items-center justify-center py-16">
            <CheckCircle size={56} className="mb-4" style={{ color: 'hsl(142, 71%, 45%)' }} />
            <p className="font-heading font-bold text-xl text-foreground mb-2">Attendance Submitted!</p>
            <p className="text-sm text-muted-foreground">{presentCount} present · {absentCount} absent · {lateCount} late</p>
          </div>
        ) : (
          <>
            {error && <div className="mb-4 p-3 rounded-lg text-sm font-medium" style={{ background: 'hsl(0 84% 60% / 0.1)', color: 'hsl(0, 84%, 60%)' }}>{error}</div>}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <button onClick={() => { setSelectedEntry(null); setStatuses({}); setError(''); }} className="btn-outline flex items-center gap-2 px-3 py-2 border rounded"><ArrowLeft size={16} /> Back</button>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-semibold text-foreground truncate">{selectedEntry.subject_name} ({selectedEntry.subject_code})</h3>
                <p className="text-sm text-muted-foreground">{selectedEntry.day_name} · {selectedEntry.start_time} – {selectedEntry.end_time} · Room {selectedEntry.room || '—'}</p>
              </div>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="form-input p-2 border rounded" />
            </div>

            {/* Summary bar */}
            <div className="flex gap-4 mb-6">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium" style={{ background: 'hsl(142 71% 45% / 0.1)', color: 'hsl(142, 71%, 45%)' }}>
                <CheckCircle size={14} /> {presentCount} Present
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium" style={{ background: 'hsl(0 84% 60% / 0.1)', color: 'hsl(0, 84%, 60%)' }}>
                <XCircle size={14} /> {absentCount} Absent
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium" style={{ background: 'hsl(45 93% 47% / 0.1)', color: 'hsl(45, 93%, 47%)' }}>
                <Clock size={14} /> {lateCount} Late
              </div>
            </div>

            <div className="bg-card rounded-xl border overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
              <table className="w-full text-left text-sm">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Roll No</th>
                    <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Name</th>
                    <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {students.map(s => (
                    <tr key={s.id} className="hover:bg-muted/30">
                      <td className="p-4 font-medium text-foreground">{s.roll_number}</td>
                      <td className="p-4 text-foreground">{s.full_name}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          {(['present', 'absent', 'late'] as const).map(status => (
                            <button key={status} onClick={() => handleToggle(s.id, status)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all ${
                                statuses[s.id] === status
                                  ? status === 'present' ? 'text-white' : status === 'absent' ? 'text-white' : 'text-white'
                                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                              }`}
                              style={statuses[s.id] === status ? {
                                background: status === 'present' ? 'hsl(142, 71%, 45%)' : status === 'absent' ? 'hsl(0, 84%, 60%)' : 'hsl(45, 93%, 47%)'
                              } : {}}
                            >{status}</button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {students.length === 0 && <tr><td colSpan={3} className="p-8 text-center text-muted-foreground">No students found for this class.</td></tr>}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mt-6">
              <button onClick={handleSubmit} disabled={submitting || students.length === 0}
                className="flex items-center gap-2 px-5 py-2.5 font-medium text-white rounded-lg transition-all disabled:opacity-50"
                style={{ background: 'hsl(142, 71%, 45%)' }}>
                <CheckCircle size={16} /> {submitting ? 'Submitting...' : `Submit Attendance (${students.length} students)`}
              </button>
            </div>
          </>
        )}
      </DashboardLayout>
    );
  }

  /* ─── Class selection view ─── */
  return (
    <DashboardLayout title="Mark Attendance">
      <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">Mark Attendance</h1>
      <p className="text-sm text-muted-foreground mb-6">Select a class to mark attendance</p>
      {error && <div className="mb-4 p-3 rounded-lg text-sm font-medium" style={{ background: 'hsl(0 84% 60% / 0.1)', color: 'hsl(0, 84%, 60%)' }}>{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map(entry => (
          <button key={entry.id} onClick={() => handleSelectEntry(entry)} className="timetable-card text-left hover:border-primary/40 transition-all">
            <h4 className="font-heading font-semibold text-foreground">{entry.subject_name}</h4>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <p>📅 {entry.day_name}</p>
              <p>⏰ {entry.start_time} – {entry.end_time}</p>
              <p>🏫 {entry.room || '—'}</p>
              <p>Sem {entry.semester} · Sec {entry.section || '—'}</p>
            </div>
            <span className="badge badge-blue mt-2">{entry.subject_code}</span>
          </button>
        ))}
        {entries.length === 0 && <p className="text-muted-foreground col-span-3">No classes assigned to you.</p>}
      </div>
    </DashboardLayout>
  );
};

/* ═══════════════════════════════════════════════════════════════
   STUDENT — View own attendance summary + subject-wise breakdown
   ═══════════════════════════════════════════════════════════════ */
const StudentAttendance: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get student profile id from user context
    const studentId = user?.student_profile?.id;
    if (!studentId) { setLoading(false); return; }
    api.get(`/attendance/by-student/${studentId}`)
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <DashboardLayout title="My Attendance"><LoadingSpinner /></DashboardLayout>;

  const summary = data?.summary || { total: 0, present: 0, absent: 0, percentage: 0 };
  const records = data?.records || [];

  // Group records by week
  const thisWeekRecords = records.filter((r: any) => {
    const d = new Date(r.date);
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1); // Monday
    weekStart.setHours(0,0,0,0);
    return d >= weekStart;
  });
  const thisWeekPresent = thisWeekRecords.filter((r: any) => r.status === 'present' || r.status === 'late').length;

  // Group by subject
  const subjectMap: Record<string, { name: string; total: number; present: number }> = {};
  records.forEach((r: any) => {
    const key = r.subject_name || 'Unknown';
    if (!subjectMap[key]) subjectMap[key] = { name: key, total: 0, present: 0 };
    subjectMap[key].total++;
    if (r.status === 'present' || r.status === 'late') subjectMap[key].present++;
  });
  const subjectBreakdown = Object.values(subjectMap);

  const statCards = [
    { label: 'Overall %', value: `${summary.percentage}%`, icon: Percent, color: summary.percentage >= 75 ? 'hsl(142, 71%, 45%)' : 'hsl(25, 95%, 53%)' },
    { label: 'Total Classes', value: summary.total, icon: BookOpen, color: 'hsl(217, 91%, 60%)' },
    { label: 'Present', value: summary.present, icon: CheckCircle, color: 'hsl(142, 71%, 45%)' },
    { label: 'Absent', value: summary.absent, icon: XCircle, color: 'hsl(0, 84%, 60%)' },
  ];

  return (
    <DashboardLayout title="My Attendance">
      <h1 className="text-2xl font-bold tracking-tight text-foreground mb-6">My Attendance</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(s => (
          <div key={s.label} className="bg-card rounded-xl border p-5" style={{ boxShadow: 'var(--shadow-card)', borderLeft: `4px solid ${s.color}` }}>
            <div className="flex items-center gap-2 mb-2">
              <s.icon size={16} style={{ color: s.color }} />
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </div>
            <p className="font-heading font-bold text-3xl text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* This Week */}
      <div className="bg-card rounded-xl border p-5 mb-8" style={{ boxShadow: 'var(--shadow-card)' }}>
        <h3 className="font-heading font-semibold text-foreground mb-3">📅 This Week</h3>
        <div className="flex gap-6 text-sm">
          <div><span className="text-muted-foreground">Classes held: </span><span className="font-semibold text-foreground">{thisWeekRecords.length}</span></div>
          <div><span className="text-muted-foreground">Attended: </span><span className="font-semibold" style={{ color: 'hsl(142, 71%, 45%)' }}>{thisWeekPresent}</span></div>
          <div><span className="text-muted-foreground">Missed: </span><span className="font-semibold" style={{ color: 'hsl(0, 84%, 60%)' }}>{thisWeekRecords.length - thisWeekPresent}</span></div>
          <div><span className="text-muted-foreground">Weekly %: </span>
            <span className="font-semibold">{thisWeekRecords.length > 0 ? Math.round((thisWeekPresent / thisWeekRecords.length) * 100) : 0}%</span>
          </div>
        </div>
      </div>

      {/* Subject-wise Breakdown */}
      {subjectBreakdown.length > 0 && (
        <div className="bg-card rounded-xl border overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
          <div className="p-5 border-b"><h3 className="font-heading font-semibold text-foreground">📚 Subject-wise Breakdown</h3></div>
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Subject</th>
                <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Total</th>
                <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Present</th>
                <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Absent</th>
                <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subjectBreakdown.map(sb => {
                const pct = sb.total > 0 ? Math.round((sb.present / sb.total) * 100) : 0;
                return (
                  <tr key={sb.name} className="hover:bg-muted/30">
                    <td className="p-4 font-medium text-foreground">{sb.name}</td>
                    <td className="p-4 text-foreground">{sb.total}</td>
                    <td className="p-4" style={{ color: 'hsl(142, 71%, 45%)' }}>{sb.present}</td>
                    <td className="p-4" style={{ color: 'hsl(0, 84%, 60%)' }}>{sb.total - sb.present}</td>
                    <td className="p-4"><span className={`badge ${pct >= 75 ? 'badge-green' : 'badge-red'}`}>{pct}%</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {summary.total === 0 && (
        <div className="bg-card rounded-xl border p-8 text-center" style={{ boxShadow: 'var(--shadow-card)' }}>
          <p className="text-muted-foreground">No attendance records yet. Your attendance will appear here once faculty marks it.</p>
        </div>
      )}
    </DashboardLayout>
  );
};

/* ═══════════════════════════════════════════════════════════════
   ADMIN — View attendance report across all students
   ═══════════════════════════════════════════════════════════════ */
const AdminAttendance: React.FC = () => {
  const [report, setReport] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [deptFilter, setDeptFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchReport = (deptId?: string) => {
    setLoading(true);
    let url = '/attendance/report';
    if (deptId) url += `?department_id=${deptId}`;
    Promise.all([
      api.get(url),
      api.get('/departments')
    ]).then(([repRes, deptRes]) => {
      setReport(repRes.data.report || []);
      setDepartments(deptRes.data.departments || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchReport(); }, []);

  const handleDeptChange = (val: string) => {
    setDeptFilter(val);
    fetchReport(val);
  };

  const totalStudents = report.length;
  const avgPercent = totalStudents > 0 ? Math.round(report.reduce((a, r) => a + r.percentage, 0) / totalStudents) : 0;
  const below75 = report.filter(r => r.percentage < 75).length;

  if (loading) return <DashboardLayout title="Attendance Report"><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout title="Attendance Report">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Attendance Report</h1>
        <select value={deptFilter} onChange={e => handleDeptChange(e.target.value)} className="form-select p-2 border rounded w-full sm:w-56">
          <option value="">All Departments</option>
          {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-xl border p-5" style={{ boxShadow: 'var(--shadow-card)', borderLeft: '4px solid hsl(217, 91%, 60%)' }}>
          <p className="text-sm text-muted-foreground mb-1">Total Students</p>
          <p className="font-heading font-bold text-2xl text-foreground">{totalStudents}</p>
        </div>
        <div className="bg-card rounded-xl border p-5" style={{ boxShadow: 'var(--shadow-card)', borderLeft: '4px solid hsl(142, 71%, 45%)' }}>
          <p className="text-sm text-muted-foreground mb-1">Average Attendance</p>
          <p className="font-heading font-bold text-2xl text-foreground">{avgPercent}%</p>
        </div>
        <div className="bg-card rounded-xl border p-5" style={{ boxShadow: 'var(--shadow-card)', borderLeft: '4px solid hsl(0, 84%, 60%)' }}>
          <p className="text-sm text-muted-foreground mb-1">Below 75%</p>
          <p className="font-heading font-bold text-2xl" style={{ color: 'hsl(0, 84%, 60%)' }}>{below75}</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border overflow-hidden" style={{ boxShadow: 'var(--shadow-card)' }}>
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Roll No</th>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Student</th>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Total Classes</th>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Present</th>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Absent</th>
              <th className="p-4 font-medium text-muted-foreground uppercase text-xs tracking-wider">Attendance %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {report.map((r, i) => (
              <tr key={i} className="hover:bg-muted/30">
                <td className="p-4 font-medium text-foreground">{r.roll_number}</td>
                <td className="p-4 text-foreground">{r.student_name}</td>
                <td className="p-4 text-foreground">{r.total}</td>
                <td className="p-4" style={{ color: 'hsl(142, 71%, 45%)' }}>{r.present}</td>
                <td className="p-4" style={{ color: 'hsl(0, 84%, 60%)' }}>{r.total - r.present}</td>
                <td className="p-4"><span className={`badge ${r.percentage >= 75 ? 'badge-green' : 'badge-red'}`}>{r.percentage}%</span></td>
              </tr>
            ))}
            {report.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-muted-foreground">No attendance records found. Faculty need to mark attendance first.</td></tr>}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
};

export default AttendancePage;
