import React, { useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Users, FileCheck, CheckCircle, Clock, TrendingUp, Bell, Download, AlertCircle, ArrowRight, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
}

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
}

const DashboardHome = () => {
  const { students, noDuesRequests, offerLetters } = useContext(AppContext)
  const navigate = useNavigate();
  
  const pendingNoDues = noDuesRequests ? noDuesRequests.filter(req => req.status === 'Pending' || !req.status).length : 0;
  
  const statsData = [
    { title: "Registered Students", value: students ? students.length : 0, trend: "Database", icon: <Users size={24} className="text-blue-600" />, bg: "bg-blue-50", trendUp: true },
    { title: "No-Dues Requests", value: noDuesRequests ? noDuesRequests.length : 0, trend: "Total", icon: <FileText size={24} className="text-indigo-600" />, bg: "bg-indigo-50", trendUp: true },
    { title: "Pending Clearance", value: pendingNoDues, trend: "Action Needed", icon: <Clock size={24} className="text-amber-600" />, bg: "bg-amber-50", trendUp: false },
    { title: "Verified Placements", value: offerLetters ? offerLetters.length : 0, trend: "+Recorded", icon: <CheckCircle size={24} className="text-emerald-600" />, bg: "bg-emerald-50", trendUp: true },
  ];

  // Graph 1: Placements by Branch
  const branchData = useMemo(() => {
    if (!offerLetters || offerLetters.length === 0) {
        // Mock data if empty so UI doesn't look broken during dev
        return [
            { name: 'CSE', count: 45 },
            { name: 'IT', count: 32 },
            { name: 'ECE', count: 28 },
            { name: 'EE', count: 15 }
        ];
    }
    const counts = {};
    offerLetters.forEach(record => {
      const branch = record.branch || 'Other';
      counts[branch] = (counts[branch] || 0) + 1;
    });
    return Object.keys(counts).map(branch => ({ name: branch, count: counts[branch] }));
  }, [offerLetters]);

  // Graph 2: No-Dues Status Overview
  const noDuesData = useMemo(() => {
    if (!noDuesRequests || noDuesRequests.length === 0) {
        return [
            { name: 'Approved', value: 120 },
            { name: 'Pending', value: 45 },
            { name: 'Rejected', value: 10 }
        ];
    }
    const counts = { 'Approved': 0, 'Pending': 0, 'Rejected': 0 };
    noDuesRequests.forEach(req => {
        const status = req.status || 'Pending';
        counts[status] = (counts[status] || 0) + 1;
    });
    return Object.keys(counts).map(status => ({ name: status, value: counts[status] })).filter(item => item.value > 0);
  }, [noDuesRequests]);

  // Semantic colors for statuses
  const STATUS_COLORS = {
      'Approved': '#10B981', // Emerald
      'Pending': '#F59E0B',  // Amber
      'Rejected': '#EF4444', // Red
      'Default': '#3B82F6'
  };

  // Custom Legend for PieChart
  const renderLegend = (props) => {
    const { payload } = props;
    return (
        <ul className="flex flex-wrap justify-center gap-3 mt-4">
            {payload.map((entry, index) => (
            <li key={`item-${index}`} className="flex items-center text-xs text-gray-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: entry.color }}></span>
                {entry.value}
            </li>
            ))}
        </ul>
    );
  };

  return (
    <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="p-4 md:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto"
    >
      {/* Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">Overview</h2>
          <p className="text-gray-500 mt-1 font-medium">Placement records and No-Dues management.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
            <button onClick={() => navigate('/dashboard/manage-notices')} className="flex items-center gap-2 bg-[#0B2447] hover:bg-[#113264] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm active:scale-95 duration-200">
                <Bell size={16} /> Send Notice
            </button>
            <button className="flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm active:scale-95 duration-200">
                <FileCheck size={16} /> Verify Dues
            </button>
            <button className="flex items-center gap-2 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm active:scale-95 duration-200">
                <Download size={16} /> Export Data
            </button>
        </div>
      </div>
      
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, idx) => (
          <motion.div variants={itemVariants} key={idx} className="bg-white p-6 rounded-xl flex flex-col gap-4 shadow-sm border border-gray-200 min-w-0 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                {stat.icon}
                </div>
                <div className={`flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${stat.trendUp ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                    {stat.trendUp ? <TrendingUp size={12} /> : <AlertCircle size={12} />} {stat.trend}
                </div>
            </div>
            <div>
              <h3 className="text-3xl font-black text-[#0F172A] tracking-tight mb-1">{stat.value}</h3>
              <p className="text-sm font-semibold text-gray-500 truncate">{stat.title}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid: Charts (Left) & Actions (Right) */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Charts Section (Takes up 2 columns on XL screens) */}
        <div className="xl:col-span-2 space-y-8">
            {/* Placements by Branch */}
            <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="mb-6 flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-extrabold text-[#0F172A]">Placements by Branch</h3>
                    <p className="text-sm text-gray-500 font-medium">Verified offer letters for the current session</p>
                  </div>
              </div>
              <div className="h-72 w-full">
                {branchData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={branchData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12, fontWeight: 600}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12, fontWeight: 600}} allowDecimals={false} />
                        <Tooltip 
                            cursor={{fill: '#F1F5F9'}}
                            contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="count" fill="#0B2447" radius={[4, 4, 0, 0]} barSize={40} activeBar={{ fill: '#1D4ED8' }} />
                    </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                        <CheckCircle size={32} className="mb-2 opacity-50" />
                        <p className="font-semibold text-sm">No placement records available</p>
                    </div>
                )}
              </div>
            </motion.div>

            {/* No-Dues Clearance Status */}
            <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="mb-6">
                  <h3 className="text-lg font-extrabold text-[#0F172A]">No-Dues Clearance Status</h3>
                  <p className="text-sm text-gray-500 font-medium">Current progress of student clearances</p>
              </div>
              <div className="h-72 w-full">
                {noDuesData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                        data={noDuesData}
                        cx="50%"
                        cy="45%"
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        >
                        {noDuesData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || STATUS_COLORS['Default']} stroke="transparent" />
                        ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontWeight: 600, color: '#0F172A' }}
                            itemStyle={{ color: '#0F172A' }}
                        />
                        <Legend content={renderLegend} verticalAlign="bottom" height={36} />
                    </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                        <FileText size={32} className="mb-2 opacity-50" />
                        <p className="font-semibold text-sm">No requests available</p>
                    </div>
                )}
              </div>
            </motion.div>
        </div>

        {/* Action / Activity Feed (Takes 1 column) */}
        <motion.div variants={itemVariants} className="xl:col-span-1 space-y-6">
            
            {/* Attention Needed Panel */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-amber-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-2 mb-4">
                    <AlertCircle size={18} className="text-amber-500" /> Action Required
                </h3>
                <ul className="space-y-4">
                    <li className="flex items-start justify-between gap-3 group cursor-pointer">
                        <div>
                            <p className="text-sm font-bold text-gray-800 group-hover:text-amber-700 transition-colors">{pendingNoDues} Pending No-Dues</p>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">Awaiting coordinator verification</p>
                        </div>
                        <button className="text-amber-600 hover:bg-amber-100 bg-amber-50 p-1.5 rounded-md transition-colors"><ArrowRight size={16}/></button>
                    </li>
                    <li className="flex items-start justify-between gap-3 group cursor-pointer border-t border-amber-100 pt-4">
                        <div>
                            <p className="text-sm font-bold text-gray-800 group-hover:text-amber-700 transition-colors">Placement Records</p>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">Validate newly submitted offer letters</p>
                        </div>
                        <button className="text-amber-600 hover:bg-amber-100 bg-amber-50 p-1.5 rounded-md transition-colors"><ArrowRight size={16}/></button>
                    </li>
                </ul>
            </div>

            {/* Recent Activity Panel */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="text-base font-extrabold text-[#0F172A] mb-5">Recent Activity</h3>
                
                <div className="relative border-l-2 border-gray-100 ml-3 space-y-6 pb-2">
                    <div className="relative pl-6">
                        <span className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-white"></span>
                        <p className="text-sm font-bold text-gray-800">Placement Record Verified</p>
                        <p className="text-xs text-gray-500 mt-0.5 font-medium">TCS Offer Letter • 2 hours ago</p>
                    </div>
                    <div className="relative pl-6">
                        <span className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white"></span>
                        <p className="text-sm font-bold text-gray-800">No-Dues Cleared</p>
                        <p className="text-xs text-gray-500 mt-0.5 font-medium">5 students approved • 4 hours ago</p>
                    </div>
                    <div className="relative pl-6">
                        <span className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-indigo-500 ring-4 ring-white"></span>
                        <p className="text-sm font-bold text-gray-800">Mass Notice Sent</p>
                        <p className="text-xs text-gray-500 mt-0.5 font-medium">"Placement drive instructions" • 1 day ago</p>
                    </div>
                </div>
                
                <button className="w-full mt-4 py-2 text-sm font-bold text-[#1D4ED8] hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100">
                    View Full Log &rarr;
                </button>
            </div>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default DashboardHome;
