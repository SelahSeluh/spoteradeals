import React, { useState, useEffect } from 'react';
import {
  Database,
  History,
  RotateCcw,
  Download,
  Plus,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  HardDrive,
  RefreshCw,
  Clock,
  CheckCircle2,
  FileCode,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { BackupRecord, VersionSnapshot } from '../../types';

interface AdminBackupManagerProps {
  sessionToken?: string | null;
  adminEmail?: string;
  adminSubRole?: string;
}

export const AdminBackupManager: React.FC<AdminBackupManagerProps> = ({
  sessionToken,
  adminEmail,
  adminSubRole = 'SUPER_ADMIN',
}) => {
  const { showToast } = useToast();
  const [activeSubTab, setActiveSubTab] = useState<'backups' | 'versions'>('backups');
  const [backups, setBackups] = useState<BackupRecord[]>([]);
  const [versions, setVersions] = useState<VersionSnapshot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingBackup, setIsCreatingBackup] = useState(false);
  const [backupDescription, setBackupDescription] = useState('');
  const [selectedScope, setSelectedScope] = useState<string>('ALL');
  const [restoringBackupId, setRestoringBackupId] = useState<string | null>(null);
  const [rollingBackVerId, setRollingBackVerId] = useState<string | null>(null);

  const fetchBackups = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/backups', {
        headers: sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setBackups(data.backups || []);
      }
    } catch (e) {
      console.warn('Could not fetch backups from server:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVersions = async () => {
    try {
      const url =
        selectedScope === 'ALL'
          ? '/api/admin/versions'
          : `/api/admin/versions?scope=${encodeURIComponent(selectedScope)}`;
      const res = await fetch(url, {
        headers: sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setVersions(data.versions || []);
      }
    } catch (e) {
      console.warn('Could not fetch versions from server:', e);
    }
  };

  useEffect(() => {
    fetchBackups();
    fetchVersions();
  }, [sessionToken]);

  useEffect(() => {
    if (activeSubTab === 'versions') {
      fetchVersions();
    }
  }, [selectedScope, activeSubTab]);

  const handleCreateBackup = async () => {
    if (adminSubRole !== 'SUPER_ADMIN') {
      showToast.error('Only Super Administrators can generate full database snapshots.');
      return;
    }

    setIsCreatingBackup(true);
    try {
      const res = await fetch('/api/admin/backups/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
        body: JSON.stringify({
          description: backupDescription.trim() || 'Manual Database Snapshot',
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast.success('Complete database backup snapshot created successfully!');
        setBackupDescription('');
        fetchBackups();
      } else {
        showToast.error(data.error || 'Failed to create backup.');
      }
    } catch (e: any) {
      showToast.error(e.message || 'Server error creating backup.');
    } finally {
      setIsCreatingBackup(false);
    }
  };

  const handleRestoreBackup = async (bcp: BackupRecord) => {
    if (adminSubRole !== 'SUPER_ADMIN') {
      showToast.error('Only Super Administrators can perform database restorations.');
      return;
    }

    const confirm = window.confirm(
      `Are you sure you want to restore the database to backup "${bcp.filename}"?\n\nA safety recovery snapshot of current data will be automatically generated before applying.`
    );
    if (!confirm) return;

    setRestoringBackupId(bcp.id);
    try {
      const res = await fetch('/api/admin/backups/restore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
        body: JSON.stringify({ backupId: bcp.id }),
      });
      const data = await res.json();
      if (data.success) {
        showToast.success(data.message || 'Database restored successfully!');
        fetchBackups();
      } else {
        showToast.error(data.message || data.error || 'Restoration failed.');
      }
    } catch (e: any) {
      showToast.error(e.message || 'Error restoring backup.');
    } finally {
      setRestoringBackupId(null);
    }
  };

  const handleRollbackVersion = async (ver: VersionSnapshot) => {
    if (adminSubRole !== 'SUPER_ADMIN') {
      showToast.error('Only Super Administrators can trigger rollbacks.');
      return;
    }

    const confirm = window.confirm(
      `Confirm rollback of ${ver.scope} to version from ${new Date(ver.timestamp).toLocaleString()}?\n\nSummary: "${ver.summary}"`
    );
    if (!confirm) return;

    setRollingBackVerId(ver.id);
    try {
      const res = await fetch('/api/admin/versions/rollback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
        body: JSON.stringify({ versionId: ver.id }),
      });
      const data = await res.json();
      if (data.success) {
        showToast.success(data.message || 'Rolled back successfully!');
        fetchVersions();
      } else {
        showToast.error(data.message || data.error || 'Rollback failed.');
      }
    } catch (e: any) {
      showToast.error(e.message || 'Error executing rollback.');
    } finally {
      setRollingBackVerId(null);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-[#0D1B3E] text-white p-6 rounded-3xl shadow-sm border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Database className="w-6 h-6 text-[#0D9CFD]" />
              <h2 className="text-xl font-black tracking-tight">
                Database Backup & Rollback System
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Maintain full enterprise-grade data durability for SpoteraDeals. Create automated or on-demand
              SHA-256 verified snapshots, download archives, and restore with automatic pre-recovery safety points.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchBackups();
                fetchVersions();
              }}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            <div className="px-3.5 py-1.5 rounded-xl bg-blue-500/20 text-[#0D9CFD] border border-blue-500/30 text-xs font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>{adminSubRole}</span>
            </div>
          </div>
        </div>

        {/* Sub Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setActiveSubTab('backups')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'backups'
                ? 'bg-[#0D9CFD] text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <HardDrive className="w-4 h-4" />
            <span>Complete Snapshots ({backups.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('versions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'versions'
                ? 'bg-[#0D9CFD] text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Content Version History ({versions.length})</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'backups' ? (
        <div className="space-y-6">
          {/* Create Backup Action Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#0D9CFD]" />
              Generate Immediate System Backup Snapshot
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={backupDescription}
                onChange={(e) => setBackupDescription(e.target.value)}
                placeholder="Description / note (e.g., Prior to UAE National Day Campaign Update)..."
                className="flex-1 w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#0D9CFD]"
              />
              <button
                onClick={handleCreateBackup}
                disabled={isCreatingBackup}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0D9CFD] hover:bg-[#0284C7] disabled:opacity-50 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-xs"
              >
                {isCreatingBackup ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Database className="w-4 h-4" />
                )}
                <span>{isCreatingBackup ? 'Saving Snapshot...' : 'Create Snapshot'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              Snapshots capture all user profiles, active & redeemed vouchers, bookings, content configs, and audit traces in an immutable SHA-256 sealed JSON archive on the server.
            </p>
          </div>

          {/* Backups List Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#10B981]" />
                Archived Snapshots & Verification Status
              </h3>
              <span className="text-xs text-slate-400 font-semibold">
                {backups.length} snapshot{backups.length === 1 ? '' : 's'} recorded
              </span>
            </div>

            {backups.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <HardDrive className="w-10 h-10 mx-auto stroke-1" />
                <p className="text-sm font-medium">No snapshots found.</p>
                <p className="text-xs">Click "Create Snapshot" above to establish your initial restore point.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200/80 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Description / Archive</th>
                      <th className="py-3 px-4">Size & Integrity</th>
                      <th className="py-3 px-4">Records Count</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {backups.map((bcp) => (
                      <tr key={bcp.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{new Date(bcp.timestamp).toLocaleString()}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                            {bcp.id}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="font-bold text-slate-900">{bcp.description}</div>
                          <span className="text-[11px] text-slate-500 font-mono truncate block">
                            {bcp.filename}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            By: {bcp.actorEmail}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-bold text-slate-700">{formatBytes(bcp.sizeBytes)}</div>
                          <span className="text-[10px] text-slate-400 font-mono block mt-0.5" title={bcp.checksum}>
                            SHA-256: {bcp.checksum.substring(0, 10)}...
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-slate-600">
                          {bcp.recordCounts ? (
                            <div className="space-y-0.5">
                              <span>Users: {bcp.recordCounts.users}</span>
                              <span className="mx-1.5">·</span>
                              <span>Bookings: {bcp.recordCounts.bookings}</span>
                              <div className="text-slate-400 text-[10px]">
                                Vouchers: {bcp.recordCounts.vouchers} · Deals: {bcp.recordCounts.deals}
                              </div>
                            </div>
                          ) : (
                            <span>Full Data Dump</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                              bcp.status === 'RESTORED'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            {bcp.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-right space-x-2">
                          <a
                            href={`/api/admin/backups/${bcp.id}/download`}
                            download={bcp.filename}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold transition-all"
                            title="Download JSON Archive"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download</span>
                          </a>

                          <button
                            onClick={() => handleRestoreBackup(bcp)}
                            disabled={restoringBackupId === bcp.id || adminSubRole !== 'SUPER_ADMIN'}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 font-bold transition-all disabled:opacity-50 cursor-pointer"
                            title="Restore snapshot"
                          >
                            <RotateCcw
                              className={`w-3.5 h-3.5 ${
                                restoringBackupId === bcp.id ? 'animate-spin' : ''
                              }`}
                            />
                            <span>
                              {restoringBackupId === bcp.id ? 'Restoring...' : 'Restore'}
                            </span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Content Versions Tab */
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Content Scope Filter</h3>
              <p className="text-xs text-slate-500">
                View audit snapshots of Homepage, Promotions, Branding, and Deals.
              </p>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto">
              {['ALL', 'HOMEPAGE', 'BRANDING', 'FONTS', 'PROMOTIONS', 'DEALS'].map((scope) => (
                <button
                  key={scope}
                  onClick={() => setSelectedScope(scope)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedScope === scope
                      ? 'bg-[#0D9CFD] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {scope}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-[#0D9CFD]" />
                Version Timeline & Safety Checkpoints
              </h3>
              <span className="text-xs text-slate-400 font-semibold">
                {versions.length} version{versions.length === 1 ? '' : 's'} available
              </span>
            </div>

            {versions.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <History className="w-10 h-10 mx-auto stroke-1" />
                <p className="text-sm font-medium">No recorded versions in this scope yet.</p>
                <p className="text-xs">
                  Whenever an admin updates homepage banners, colors, fonts, or deals, snapshots are logged automatically here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {versions.map((ver) => (
                  <div
                    key={ver.id}
                    className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-[#0D9CFD] font-black text-[10px] uppercase tracking-wider border border-blue-200/60">
                          {ver.scope}
                        </span>
                        <span className="text-xs font-bold text-slate-900">{ver.summary}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span>{new Date(ver.timestamp).toLocaleString()}</span>
                        <span>·</span>
                        <span>Author: {ver.authorEmail}</span>
                        <span>·</span>
                        <span className="font-mono text-slate-400">{ver.id}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRollbackVersion(ver)}
                      disabled={rollingBackVerId === ver.id || adminSubRole !== 'SUPER_ADMIN'}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 disabled:opacity-50 cursor-pointer"
                    >
                      <RotateCcw
                        className={`w-3.5 h-3.5 ${
                          rollingBackVerId === ver.id ? 'animate-spin' : ''
                        }`}
                      />
                      <span>
                        {rollingBackVerId === ver.id ? 'Rolling back...' : 'Rollback to this state'}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
