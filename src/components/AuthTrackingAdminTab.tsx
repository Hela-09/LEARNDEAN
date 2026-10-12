import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  LogOut, 
  LogIn, 
  Search, 
  RefreshCw, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  KeyRound, 
  Globe, 
  Smartphone, 
  Monitor, 
  Clock,
  AlertTriangle
} from 'lucide-react';
import { getAdminAuthLogs, AuthEventRecord, AuthEventType } from '../services/authTrackingService';

export default function AuthTrackingAdminTab() {
  const [logs, setLogs] = useState<AuthEventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState('');
  const [selectedType, setSelectedType] = useState<AuthEventType | 'all'>('all');
  const [lastRefreshed, setLastRefreshed] = useState<string>('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getAdminAuthLogs({
        eventType: selectedType,
        searchEmail: searchEmail.trim(),
        maxRecords: 150
      });
      setLogs(data);
      setLastRefreshed(new Date().toLocaleTimeString());
    } catch (err) {
      console.warn('Failed to load admin auth logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedType]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs();
  };

  // Metric counts
  const totalSuccess = logs.filter(l => l.eventType === 'login_success').length;
  const totalFailures = logs.filter(l => l.eventType === 'login_failure').length;
  const totalLogouts = logs.filter(l => l.eventType === 'logout').length;

  return (
    <div className="space-y-6">
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Events</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{logs.length}</p>
          <span className="text-[11px] text-slate-400">Captured in current view</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Successful Logins</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{totalSuccess}</p>
          <span className="text-[11px] text-slate-400">Verified student access</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Failed Attempts</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <XCircle size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">{totalFailures}</p>
          <span className="text-[11px] text-slate-400">Wrong credentials or blocked</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Logout Events</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              <LogOut size={16} />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-700 dark:text-slate-300 mt-2">{totalLogouts}</p>
          <span className="text-[11px] text-slate-400">Clean session terminations</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Search by student email..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer shrink-0"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/60 p-1 rounded-xl">
            {(['all', 'login_success', 'login_failure', 'logout'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors cursor-pointer ${
                  selectedType === type
                    ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {type === 'all' ? 'All' : type === 'login_success' ? 'Success' : type === 'login_failure' ? 'Failed' : 'Logout'}
              </button>
            ))}
          </div>

          <button
            onClick={fetchLogs}
            disabled={loading}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer shrink-0"
            title="Refresh logs"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin text-blue-600' : ''} />
          </button>
        </div>
      </div>

      {/* Authentication Records Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              Authentication Audit Trail
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Securely stored in Firebase Firestore with administrator-only access. Passwords are never saved.
            </p>
          </div>
          {lastRefreshed && (
            <span className="text-[11px] text-slate-400">Updated: {lastRefreshed}</span>
          )}
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            <RefreshCw size={24} className="animate-spin text-blue-600 mx-auto mb-2" />
            Loading authentication events...
          </div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            <ShieldCheck size={36} className="mx-auto mb-2 text-slate-300 dark:text-slate-600" />
            No authentication logs found matching criteria.
          </div>
        ) : (
          <div className="overflow-x-auto min-w-0">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">Event</th>
                  <th className="px-4 py-3">Student Account</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Timestamp</th>
                  <th className="px-4 py-3">Device / Platform</th>
                  <th className="px-4 py-3">Status / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {logs.map((log, idx) => {
                  const isSuccess = log.eventType === 'login_success';
                  const isFailure = log.eventType === 'login_failure';
                  const isLogout = log.eventType === 'logout';

                  return (
                    <tr key={log.id || idx} className="hover:bg-slate-50/60 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {isSuccess ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 size={13} /> Login Success
                          </span>
                        ) : isFailure ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                            <XCircle size={13} /> Login Failed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            <LogOut size={13} /> Logout
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 min-w-[160px]">
                        <div className="font-bold text-slate-900 dark:text-white truncate max-w-[220px]">
                          {log.email || 'Anonymous / Unknown'}
                        </div>
                        {log.displayName && (
                          <div className="text-[11px] text-slate-400 truncate max-w-[220px]">
                            {log.displayName}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300">
                          {log.loginMethod === 'google' ? (
                            <>
                              <Globe size={14} className="text-red-500" /> Google SSO
                            </>
                          ) : (
                            <>
                              <KeyRound size={14} className="text-amber-500" /> Password
                            </>
                          )}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-600 dark:text-slate-300 text-xs font-mono">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>

                      <td className="px-4 py-3.5 text-slate-500 text-xs max-w-[200px] truncate" title={log.userAgent}>
                        {log.platform ? `${log.platform} • ` : ''}
                        <span className="truncate">{log.userAgent ? log.userAgent.split(' ')[0] : 'Web Client'}</span>
                      </td>

                      <td className="px-4 py-3.5 text-xs">
                        {isFailure ? (
                          <span className="text-rose-600 dark:text-rose-400 font-semibold truncate block max-w-[220px]" title={log.errorMessage || log.errorCode || ''}>
                            {log.errorCode ? `${log.errorCode}` : log.errorMessage || 'Invalid credentials'}
                          </span>
                        ) : isSuccess ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            Authorized
                          </span>
                        ) : (
                          <span className="text-slate-400">
                            Session ended
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
