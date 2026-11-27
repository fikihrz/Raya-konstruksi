import { useState, useEffect } from 'react';
import {
  FiBriefcase,
  FiUsers,
  FiEye,
  FiStar,
  FiRefreshCw,
  FiArrowRight,
  FiCheckCircle,
  FiTool,
  FiAward,
  FiMessageSquare,
  FiGlobe
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const API = window.location.hostname === 'localhost' ? 'http://localhost:3000' : 'https://backend-three-beta-90.vercel.app';

const Dashboard = () => {
  const [data, setData] = useState<any>({
    projects: [],
    services: [],
    clients: [],
    reasons: [],
    reviews: [],
    settings: {},
    analytics: {
      totalVisits: 0,
      todayVisits: 0,
      uniqueVisitors: 0,
      history: []
    }
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Chart Date Range State
  const todayIso = new Date().toISOString().slice(0, 10);
  const getDaysAgoIso = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().slice(0, 10);
  };
  const [rangeMode, setRangeMode] = useState<'7' | '14' | '30' | 'custom'>('7');
  const [startDate, setStartDate] = useState(() => getDaysAgoIso(6));
  const [endDate, setEndDate] = useState(() => todayIso);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setRefreshing(true);
      const res = await fetch(`${API}/api/data`);
      const d = await res.json();
      setData(d);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const analytics = data.analytics || { totalVisits: 0, todayVisits: 0, uniqueVisitors: 0, history: [] };
  const settings = data.settings || {};
  const projects = data.projects || [];
  const services = data.services || [];
  const clients = data.clients || [];
  const reasons = data.reasons || [];
  const reviews = data.reviews || [];

  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc: number, r: any) => acc + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
    : '5.0';

  const residentialCount = projects.filter((p: any) => (p.category || '').toLowerCase().includes('residensial') || (p.category || '').toLowerCase().includes('residential')).length;
  const commercialCount = projects.filter((p: any) => (p.category || '').toLowerCase().includes('komersial') || (p.category || '').toLowerCase().includes('commercial')).length;
  const infraCount = projects.filter((p: any) => (p.category || '').toLowerCase().includes('infrastruktur') || (p.category || '').toLowerCase().includes('infrastructure') || (p.category || '').toLowerCase().includes('industri')).length;

  // Build visitor trend for selected date range
  const todayStr = new Date().toISOString().slice(0, 10);
  const rawHistory: Array<{ date: string; visits: number }> = Array.isArray(analytics.history) ? analytics.history : [];
  const historyMap = new Map(rawHistory.map(h => [h.date, Number(h.visits) || 0]));
  historyMap.set(todayStr, Number(analytics.todayVisits) || 0);

  const effectiveStart = rangeMode === 'custom'
    ? startDate
    : getDaysAgoIso(Number(rangeMode) - 1);
  const effectiveEnd = rangeMode === 'custom' ? endDate : todayStr;

  const chartDays: Array<{ date: string; label: string; fullLabel: string; visits: number }> = [];
  {
    const start = new Date(`${effectiveStart}T00:00:00`);
    const end = new Date(`${effectiveEnd}T00:00:00`);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start <= end) {
      const cur = new Date(start);
      let guard = 0;
      while (cur <= end && guard < 366) {
        const iso = cur.toISOString().slice(0, 10);
        const label = iso === todayStr
          ? 'Hari Ini'
          : cur.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
        const fullLabel = cur.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        chartDays.push({
          date: iso,
          label,
          fullLabel,
          visits: historyMap.get(iso) ?? 0
        });
        cur.setDate(cur.getDate() + 1);
        guard++;
      }
    }
  }
  if (chartDays.length === 0) {
    chartDays.push({ date: todayStr, label: 'Hari Ini', fullLabel: todayStr, visits: Number(analytics.todayVisits) || 0 });
  }
  const maxDayVisits = Math.max(...chartDays.map(d => d.visits), 4);
  const totalRangeVisits = chartDays.reduce((sum, d) => sum + d.visits, 0);

  return (
    <div className="space-y-6">
      {/* Executive Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Ringkasan Eksekutif</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Monitoring performa trafik pengunjung dan kelengkapan konten website PT Raya Konstruksi Jaya.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-700 border border-slate-200">
            <FiCheckCircle className="text-emerald-600" size={13} />
            Database Terhubung
          </span>
          <button
            type="button"
            onClick={loadData}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer disabled:opacity-60 shadow-xs"
          >
            <FiRefreshCw className={refreshing ? 'animate-spin' : ''} size={13} />
            <span>{refreshing ? 'Memuat...' : 'Segarkan'}</span>
          </button>
        </div>
      </div>

      {/* KPI Metrics Grid (4 Formal Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Total Kunjungan */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 border-t-2 border-t-blue-600 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Kunjungan</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FiEye size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">
              {loading ? '—' : Number(analytics.totalVisits || 0).toLocaleString('id-ID')}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            <span className="font-semibold text-blue-600">+{analytics.todayVisits || 0}</span> kunjungan hari ini
          </p>
        </div>

        {/* KPI 2: Pengunjung Unik */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 border-t-2 border-t-blue-600 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pengunjung Unik</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FiUsers size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">
              {loading ? '—' : Number(analytics.uniqueVisitors || 0).toLocaleString('id-ID')}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Perangkat berbeda tercatat
          </p>
        </div>

        {/* KPI 3: Portofolio Proyek */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 border-t-2 border-t-blue-600 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Portofolio Proyek</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FiBriefcase size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">
              {loading ? '—' : projects.length}
            </span>
            <span className="text-xs text-slate-400 font-medium">Proyek</span>
          </div>
          <p className="text-xs text-slate-500 mt-2 truncate">
            {residentialCount} Residensial · {commercialCount} Komersial · {infraCount} Infrastruktur
          </p>
        </div>

        {/* KPI 4: Kepuasan Klien */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 border-t-2 border-t-blue-600 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kepuasan Klien</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <FiStar size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">
              {loading ? '—' : avgRating}
            </span>
            <span className="text-sm text-slate-400 font-medium">/ 5.0</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Dari <span className="font-semibold text-slate-700">{reviews.length}</span> ulasan klien terpublikasi
          </p>
        </div>
      </div>

      {/* Main Content Grid (8 Columns Left / 4 Columns Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (8 Cols): Visitor Trend + Latest Projects Table */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Visitor Trend Line & Area Chart with Custom Date Range */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Grafik Kunjungan Website</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Total {totalRangeVisits.toLocaleString('id-ID')} kunjungan pada rentang dipilih ({chartDays.length} hari)
                </p>
              </div>

              {/* Date Range Selector */}
              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { id: '7', label: '7 Hari' },
                  { id: '14', label: '14 Hari' },
                  { id: '30', label: '30 Hari' },
                  { id: 'custom', label: 'Pilih Tanggal' }
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setRangeMode(opt.id as any);
                      setHoveredIdx(null);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                      rangeMode === opt.id
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Date Inputs */}
            {rangeMode === 'custom' && (
              <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs">
                <div className="flex items-center justify-between sm:justify-start gap-2">
                  <span className="font-semibold text-slate-600">Dari:</span>
                  <input
                    type="date"
                    value={startDate}
                    max={endDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1 sm:flex-none bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="flex items-center justify-between sm:justify-start gap-2">
                  <span className="font-semibold text-slate-600">Sampai:</span>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    max={todayStr}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1 sm:flex-none bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            )}

            {/* SVG Line + Area Chart */}
            {(() => {
              const W = 720;
              const H = 210;
              const padL = 38;
              const padR = 16;
              const padT = 18;
              const padB = 28;
              const plotW = W - padL - padR;
              const plotH = H - padT - padB;
              const count = chartDays.length;

              const points = chartDays.map((d, i) => {
                const x = count === 1 ? padL + plotW / 2 : padL + (i / (count - 1)) * plotW;
                const y = padT + plotH - (d.visits / maxDayVisits) * plotH;
                return { x, y, ...d };
              });

              const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
              const areaPath = points.length > 1
                ? `${linePath} L ${points[points.length - 1].x.toFixed(1)} ${(padT + plotH).toFixed(1)} L ${points[0].x.toFixed(1)} ${(padT + plotH).toFixed(1)} Z`
                : '';

              const yTicks = [0, Math.round(maxDayVisits / 2), maxDayVisits];
              const labelStep = count <= 10 ? 1 : count <= 18 ? 2 : Math.ceil(count / 7);
              const activePoint = hoveredIdx !== null ? points[hoveredIdx] : points[points.length - 1];

              return (
                <div className="space-y-2">
                  {/* Active / Hovered Point Readout */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs px-1">
                    <span className="text-slate-500">
                      {activePoint?.fullLabel}: <strong className="text-slate-900">{activePoint?.visits} kunjungan</strong>
                    </span>
                    <span className="hidden sm:inline text-[11px] text-blue-600 font-medium">Arahkan kursor ke titik grafik untuk detail</span>
                  </div>

                  <div className="w-full overflow-hidden">
                    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto select-none">
                      <defs>
                        <linearGradient id="visitAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.22" />
                          <stop offset="100%" stopColor="#2563eb" stopOpacity="0.01" />
                        </linearGradient>
                      </defs>

                      {/* Horizontal Gridlines & Y Labels */}
                      {yTicks.map((val, idx) => {
                        const y = padT + plotH - (val / maxDayVisits) * plotH;
                        return (
                          <g key={idx}>
                            <line
                              x1={padL}
                              y1={y}
                              x2={W - padR}
                              y2={y}
                              stroke="#e2e8f0"
                              strokeDasharray="4 4"
                              strokeWidth="1"
                            />
                            <text
                              x={padL - 8}
                              y={y + 4}
                              textAnchor="end"
                              fontSize="11"
                              fill="#94a3b8"
                            >
                              {val}
                            </text>
                          </g>
                        );
                      })}

                      {/* Area Fill */}
                      {areaPath && <path d={areaPath} fill="url(#visitAreaGrad)" />}

                      {/* Line */}
                      {points.length > 1 && (
                        <path
                          d={linePath}
                          fill="none"
                          stroke="#2563eb"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}

                      {/* Data Points + Hover Targets + X Labels */}
                      {points.map((p, i) => {
                        const showLabel = i === 0 || i === count - 1 || i % labelStep === 0;
                        const isHovered = hoveredIdx === i;
                        return (
                          <g key={p.date}>
                            {/* Hover Hit Area */}
                            <rect
                              x={p.x - Math.max(10, plotW / (count * 2))}
                              y={padT}
                              width={Math.max(20, plotW / count)}
                              height={plotH}
                              fill="transparent"
                              className="cursor-pointer"
                              onMouseEnter={() => setHoveredIdx(i)}
                              onMouseLeave={() => setHoveredIdx(null)}
                            />
                            {/* Vertical guide on hover */}
                            {isHovered && (
                              <line
                                x1={p.x}
                                y1={padT}
                                x2={p.x}
                                y2={padT + plotH}
                                stroke="#93c5fd"
                                strokeWidth="1"
                                strokeDasharray="3 3"
                              />
                            )}
                            {/* Point Circle */}
                            {(count <= 31 || isHovered || i === count - 1) && (
                              <circle
                                cx={p.x}
                                cy={p.y}
                                r={isHovered ? 5.5 : count > 18 ? 2.8 : 4}
                                fill={isHovered || i === count - 1 ? '#2563eb' : '#ffffff'}
                                stroke="#2563eb"
                                strokeWidth="2"
                                className="pointer-events-none"
                              />
                            )}
                            {/* X-Axis Label */}
                            {showLabel && (
                              <text
                                x={p.x}
                                y={H - 6}
                                textAnchor="middle"
                                fontSize="11"
                                fontWeight={i === count - 1 ? '700' : '400'}
                                fill={i === count - 1 ? '#2563eb' : '#64748b'}
                              >
                                {p.label}
                              </text>
                            )}
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Latest Projects Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Daftar Portofolio Proyek</h2>
                <p className="text-xs text-slate-500 mt-0.5">Proyek terbaru yang ditampilkan pada halaman publik</p>
              </div>
              <Link
                to="/projects"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                Kelola Proyek <FiArrowRight size={13} />
              </Link>
            </div>

            {projects.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Belum ada data proyek.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-6">Nama Proyek</th>
                      <th className="py-3 px-4">Kategori</th>
                      <th className="py-3 px-4">Lokasi</th>
                      <th className="py-3 px-6 text-right">Tahun</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                    {projects.slice(0, 5).map((p: any, idx: number) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-6 font-semibold text-slate-800 max-w-[240px] truncate">
                          {p.title}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600">
                          <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-medium">
                            {p.category || 'Konstruksi'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 max-w-[160px] truncate">
                          {p.location || '—'}
                        </td>
                        <td className="py-3.5 px-6 text-right font-medium text-slate-700 tabular-nums">
                          {p.year || '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* Right Column (4 Cols): Content Summary + Latest Reviews + System Info */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Ringkasan Modul Konten */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200/80">
              <h2 className="text-base font-bold text-slate-900">Ringkasan Konten Website</h2>
            </div>
            <div className="divide-y divide-slate-100">
              <Link to="/projects" className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <FiBriefcase className="text-slate-400" size={16} />
                  <span className="text-sm font-medium text-slate-700">Portofolio Proyek</span>
                </div>
                <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md tabular-nums">
                  {projects.length}
                </span>
              </Link>

              <Link to="/services" className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <FiTool className="text-slate-400" size={16} />
                  <span className="text-sm font-medium text-slate-700">Bidang Layanan</span>
                </div>
                <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md tabular-nums">
                  {services.length}
                </span>
              </Link>

              <Link to="/clients" className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <FiUsers className="text-slate-400" size={16} />
                  <span className="text-sm font-medium text-slate-700">Klien & Mitra</span>
                </div>
                <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md tabular-nums">
                  {clients.length}
                </span>
              </Link>

              <Link to="/reasons" className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <FiAward className="text-slate-400" size={16} />
                  <span className="text-sm font-medium text-slate-700">Keunggulan Kami</span>
                </div>
                <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md tabular-nums">
                  {reasons.length}
                </span>
              </Link>

              <Link to="/reviews" className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <FiMessageSquare className="text-slate-400" size={16} />
                  <span className="text-sm font-medium text-slate-700">Ulasan Klien</span>
                </div>
                <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md tabular-nums">
                  {reviews.length}
                </span>
              </Link>
            </div>
          </div>

          {/* Ulasan Terbaru */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200/80 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Ulasan Klien Terbaru</h2>
              <Link to="/reviews" className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                Semua →
              </Link>
            </div>
            <div className="divide-y divide-slate-100">
              {reviews.length === 0 ? (
                <p className="p-6 text-center text-xs text-slate-400">Belum ada ulasan.</p>
              ) : (
                reviews.slice(0, 3).map((r: any, idx: number) => (
                  <div key={idx} className="p-4 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{r.name}</span>
                      <span className="text-[11px] font-semibold text-amber-600">★ {r.rating || 5}.0</span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">"{r.review}"</p>
                    <p className="text-[11px] text-slate-400">{r.company || 'Klien'}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Informasi Sistem & Kontak */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FiGlobe className="text-slate-400" size={15} />
                Informasi Sistem
              </h2>
              <Link to="/settings" className="text-xs font-semibold text-blue-600 hover:underline">
                Edit
              </Link>
            </div>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Email Resmi</span>
                <span className="font-medium text-slate-800 truncate">{settings.emailAddress || '—'}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">WhatsApp</span>
                <span className="font-medium text-slate-800 font-mono">+{settings.whatsappNumber || '—'}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Banner Kontak</span>
                <span className="font-medium text-slate-800 capitalize">{settings.contactBgType === 'video' ? 'Video' : 'Gambar'}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Database</span>
                <span className="font-medium text-emerald-700">MongoDB Atlas</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
