import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  UserCheck,
  FileText,
  Code,
  Globe,
} from 'lucide-react';
import { AuditLogEntry } from '../../types';

interface AdminAuditLogsManagerProps {
  sessionToken?: string | null;
  adminSubRole?: string;
}

export const AdminAuditLogsManager: React.FC<AdminAuditLogsManagerProps> = ({
  sessionToken,
  adminSubRole = 'SUPER_ADMIN',
}) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'SUCCESS' | 'BLOCKED' | 'FAILED'>('ALL');
  const [selectedAction, setSelectedAction] = useState<string>('ALL');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      let url = '/api/admin/audit-logs?limit=200';
      if (selectedStatus !== 'ALL') {
        url += `&status=${selectedStatus}`;
      }
      if (selectedAction !== 'ALL') {
        url += `&action=${selectedAction}`;
      }
      if (searchQuery.trim()) {
        url += `&actor=${encodeURIComponent(searchQuery.trim())}`;
      }

      const res = await fetch(url, {
        headers: sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
      }
    } catch (e) {
      console.warn('Failed to load audit logs:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [sessionToken, selectedStatus, selectedAction]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs();
  };

  const uniqueActions = [
    'ALL',
    'LOGIN',
    'CREATE_BACKUP',
    'RESTORE_BACKUP',
    'ROLLBACK_VERSION',
    'UPDATE_USER_ROLE',
    'ACCESS_ADMIN_OVERVIEW',
    'UNAUTHORIZED_ADMIN_ACCESS_ATTEMPT',
    'SAVE_VERSION',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-[#1E293B] text-white p-6 rounded-3xl shadow-sm border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-[#10B981]" />
              <h2 className="text-xl font-black tracking-tight">Security & Audit Event Logs</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Append-only audit trail recording every administrative event, access attempt, backup creation, and role modification for regulatory compliance and threat detection.
            </p>
          </div>

          <button
            onClick={fetchLogs}
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Stream</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by actor email (e.g., admin@spoteradeals.com)..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#0D9CFD]"
            />
          </form>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto">
            {(['ALL', 'SUCCESS', 'BLOCKED', 'FAILED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedStatus === st
                    ? st === 'SUCCESS'
                      ? 'bg-emerald-600 text-white'
                      : st === 'BLOCKED'
                      ? 'bg-rose-600 text-white'
                      : st === 'FAILED'
                      ? 'bg-amber-600 text-white'
                      : 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Action Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
          <span className="text-[11px] font-bold text-slate-400 shrink-0">Action:</span>
          {uniqueActions.map((act) => (
            <button
              key={act}
              onClick={() => setSelectedAction(act)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedAction === act
                  ? 'bg-blue-50 text-[#0D9CFD] border border-blue-200 font-bold'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {act}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0D9CFD]" />
            Recorded Events ({logs.length})
          </h3>
          <span className="text-xs text-slate-400 font-semibold">Latest 200 security logs</span>
        </div>

        {logs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <ShieldAlert className="w-10 h-10 mx-auto stroke-1 text-slate-300" />
            <p className="text-sm font-medium">No events match the selected criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {logs.map((entry) => {
              const isExpanded = expandedLogId === entry.id;
              return (
                <div
                  key={entry.id}
                  className="p-4 hover:bg-slate-50/70 transition-colors space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                          entry.status === 'SUCCESS'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : entry.status === 'BLOCKED'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {entry.status}
                      </span>
                      <span className="font-bold text-xs text-slate-900 font-mono">
                        {entry.action}
                      </span>
                      {entry.resource && (
                        <span className="text-[10px] text-slate-500 px-1.5 py-0.5 rounded bg-slate-100">
                          {entry.resource}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(entry.timestamp).toLocaleString()}</span>
                      </div>
                      {entry.ipAddress && (
                        <div className="flex items-center gap-1 font-mono text-[11px]">
                          <Globe className="w-3 h-3 text-slate-400" />
                          <span>{entry.ipAddress}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-semibold">{entry.actorEmail}</span>
                      <span className="text-slate-400">({entry.role})</span>
                    </div>

                    {entry.details && (
                      <button
                        onClick={() => setExpandedLogId(isExpanded ? null : entry.id)}
                        className="text-[11px] text-[#0D9CFD] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Code className="w-3 h-3" />
                        <span>{isExpanded ? 'Hide Payload' : 'Inspect Payload'}</span>
                      </button>
                    )}
                  </div>

                  {isExpanded && entry.details && (
                    <pre className="p-3 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto mt-2">
                      {JSON.stringify(entry.details, null, 2)}
                    </pre>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
