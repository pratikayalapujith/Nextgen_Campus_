import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Percent, BookOpen, CheckCircle, XCircle, Calendar } from 'lucide-react';
import api from '@/api/axios';
import LoadingSpinner from '@/components/common/LoadingSpinner';

const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/student-stats')
      .then(r => setStats(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const percentage = stats?.attendance?.percentage || 0;
  
  const statCards = [
    { label: 'Attendance', value: `${percentage}%`, icon: Percent, border: percentage >= 75 ? 'stat-card-border-green' : 'stat-card-border-orange', iconBg: percentage >= 75 ? 'hsl(155 70% 38% / 0.1)' : 'hsl(0 80% 55% / 0.1)', iconColor: percentage >= 75 ? 'hsl(155, 70%, 38%)' : 'hsl(0, 80%, 55%)' },
    { label: 'Total Classes', value: stats?.attendance?.total_classes || 0, icon: BookOpen, border: 'stat-card-border-blue', iconBg: 'hsl(215 90% 50% / 0.1)', iconColor: 'hsl(215, 90%, 50%)' },
    { label: 'Present', value: stats?.attendance?.present || 0, icon: CheckCircle, border: 'stat-card-border-green', iconBg: 'hsl(155 70% 38% / 0.1)', iconColor: 'hsl(155, 70%, 38%)' },
    { label: 'Absent', value: stats?.attendance?.absent || 0, icon: XCircle, border: 'stat-card-border-orange', iconBg: 'hsl(42 95% 55% / 0.1)', iconColor: 'hsl(42, 95%, 45%)' },
  ];

  return (
    <div>
      {/* Hero Banner */}
      <div className="info-banner mb-8">
        <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'hsl(42, 95%, 55%)' }}>Student Portal</span>
        <h2 className="mt-2">Welcome, {user?.full_name.split(' ')[0]} 👋</h2>
        <p>Track your attendance, view your schedule, and stay updated with campus notices.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map(s => (
          <div key={s.label} className={`stat-card ${s.border} p-6`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="stat-label">{s.label}</p>
                <p className="stat-value mt-2">{s.value}</p>
              </div>
              <div className="stat-icon" style={{ background: s.iconBg }}>
                <s.icon size={22} style={{ color: s.iconColor }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-5">
        <div className="w-1 h-6 rounded-full" style={{ background: 'var(--gradient-royal)' }} />
        <h3 className="font-heading font-extrabold text-base tracking-tight text-foreground">Today's Classes</h3>
      </div>

      {!stats?.today_timetable || stats.today_timetable.length === 0 ? (
        <div className="bg-card rounded-xl border p-8 text-center" style={{ boxShadow: 'var(--shadow-card)' }}>
          <Calendar size={40} className="mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground font-medium">No classes scheduled for today.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stats.today_timetable.map((entry: any) => (
            <div key={entry.id} className="timetable-card">
              <h4 className="font-heading font-bold text-foreground text-base">{entry.subject_name}</h4>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">⏰ <span className="font-medium">{entry.start_time} - {entry.end_time}</span></p>
                <p className="flex items-center gap-2">👨‍🏫 <span>{entry.faculty_name}</span></p>
                <p className="flex items-center gap-2">🏫 <span>{entry.room}</span></p>
              </div>
              <div className="mt-3">
                <span className="badge badge-blue">{entry.subject_code}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
