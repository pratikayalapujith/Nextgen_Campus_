import React, { useState, useEffect } from 'react';
import { Users, GraduationCap, Building2, CalendarCheck, TrendingUp } from 'lucide-react';
import { CATEGORY_COLORS } from '@/utils/constants';
import api from '@/api/axios';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { DashboardStats, Notice, AttendanceSummary } from '@/utils/types';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [summary, setSummary] = useState<Array<{department: string; department_code: string; total_students: number; attendance_percentage: number}>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/stats'),
      api.get('/dashboard/recent-notices'),
      api.get('/dashboard/attendance-summary'),
    ]).then(([statsRes, noticesRes, summaryRes]) => {
      setStats(statsRes.data);
      setNotices(noticesRes.data.notices);
      setSummary(summaryRes.data.summary);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const statCards = [
    { label: 'Total Students', value: stats?.total_students || 0, icon: Users, border: 'stat-card-border-blue', iconBg: 'hsl(215 90% 50% / 0.1)', iconColor: 'hsl(215, 90%, 50%)' },
    { label: 'Total Faculty', value: stats?.total_faculty || 0, icon: GraduationCap, border: 'stat-card-border-green', iconBg: 'hsl(155 70% 38% / 0.1)', iconColor: 'hsl(155, 70%, 38%)' },
    { label: 'Departments', value: stats?.total_departments || 0, icon: Building2, border: 'stat-card-border-purple', iconBg: 'hsl(265 65% 50% / 0.1)', iconColor: 'hsl(265, 65%, 50%)' },
    { label: 'Pending Bookings', value: stats?.pending_bookings || 0, icon: CalendarCheck, border: 'stat-card-border-orange', iconBg: 'hsl(42 95% 55% / 0.1)', iconColor: 'hsl(42, 95%, 45%)' },
  ];

  return (
    <div>
      {/* Hero banner */}
      <div className="info-banner mb-8">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={20} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: 'hsl(42, 95%, 55%)' }}>Campus Overview</span>
        </div>
        <h2>Admin Dashboard</h2>
        <p>Monitor campus operations, manage resources, and track performance across all departments.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((s) => (
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

      {/* Two column: attendance + notices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Attendance */}
        <div className="bg-card rounded-xl p-6" style={{ border: '1px solid hsl(var(--border))', boxShadow: 'var(--shadow-card)' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full" style={{ background: 'var(--gradient-royal)' }} />
            <h3 className="font-heading font-extrabold text-base tracking-tight text-foreground">Department Attendance</h3>
          </div>
          <div className="space-y-5">
            {summary.map((d) => (
              <div key={d.department}>
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="badge badge-blue text-[10px]">{d.department_code}</span>
                    <span className="text-sm font-semibold text-foreground">{d.department}</span>
                  </div>
                  <span className={`text-sm font-extrabold ${d.attendance_percentage >= 75 ? 'text-success' : 'text-destructive'}`}>
                    {d.attendance_percentage}%
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${d.attendance_percentage}%`,
                      background: d.attendance_percentage >= 75 ? 'var(--gradient-success)' : 'var(--gradient-danger)',
                    }}
                  />
                </div>
              </div>
            ))}
            {summary.length === 0 && <p className="text-sm text-muted-foreground">No attendance data yet.</p>}
          </div>
        </div>

        {/* Recent Notices */}
        <div className="bg-card rounded-xl p-6" style={{ border: '1px solid hsl(var(--border))', boxShadow: 'var(--shadow-card)' }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 rounded-full" style={{ background: 'var(--gradient-accent)' }} />
            <h3 className="font-heading font-extrabold text-base tracking-tight text-foreground">Recent Notices</h3>
          </div>
          <div className="space-y-1">
            {notices.slice(0, 4).map((notice) => (
              <div
                key={notice.id}
                className="flex items-start gap-3 p-3.5 rounded-xl transition-all duration-200 hover:bg-muted/60 cursor-pointer"
                style={notice.is_pinned ? { borderLeft: '4px solid hsl(42, 95%, 55%)', background: 'hsl(42 95% 55% / 0.04)' } : {}}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`badge ${CATEGORY_COLORS[notice.category]} text-[10px]`}>{notice.category}</span>
                    {notice.is_pinned && <span className="badge badge-yellow text-[10px]">📌 Pinned</span>}
                  </div>
                  <p className="text-sm font-bold text-foreground truncate">{notice.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{notice.author_name} · {notice.published_at}</p>
                </div>
              </div>
            ))}
            {notices.length === 0 && <p className="text-sm text-muted-foreground">No recent notices.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
