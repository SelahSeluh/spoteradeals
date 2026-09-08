import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Users,
  Lock,
  UserCog,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { AdminSubRole } from '../../types';

interface RbacUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'CUSTOMER' | 'PARTNER' | 'ADMIN';
  adminSubRole?: AdminSubRole;
  membership: string;
  createdAt: string;
}

interface AdminRbacManagerProps {
  sessionToken?: string | null;
  currentAdminEmail?: string;
  currentAdminSubRole?: string;
}

export const AdminRbacManager: React.FC<AdminRbacManagerProps> = ({
  sessionToken,
  currentAdminEmail,
  currentAdminSubRole = 'SUPER_ADMIN',
}) => {
  const { showToast } = useToast();
  const [users, setUsers] = useState<RbacUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        headers: sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {},
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch (e) {
      console.warn('Failed to load user list:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [sessionToken]);

  const handleUpdateRole = async (
    userId: string,
    targetEmail: string,
    newRole: 'CUSTOMER' | 'PARTNER' | 'ADMIN',
    newSubRole?: AdminSubRole
  ) => {
    if (currentAdminSubRole !== 'SUPER_ADMIN') {
      showToast.error('Only Super Administrators have permission to modify account roles.');
      return;
    }

    if (targetEmail.toLowerCase() === 'admin@spoteradeals.com' && newRole !== 'ADMIN') {
      showToast.error('The primary Master Administrator account cannot be demoted.');
      return;
    }

    setUpdatingUserId(userId);
    try {
      const res = await fetch('/api/admin/users/role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
        body: JSON.stringify({
          userId,
          role: newRole,
          subRole: newSubRole,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast.success(data.message || 'User permissions updated successfully.');
        fetchUsers();
      } else {
        showToast.error(data.error || data.message || 'Failed to update user role.');
      }
    } catch (e: any) {
      showToast.error(e.message || 'Server error updating permissions.');
    } finally {
      setUpdatingUserId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const subRoleDescriptions: Record<AdminSubRole, string> = {
    SUPER_ADMIN: 'Full unrestricted root access: User management, backups, restores & rollback.',
    CONTENT_ADMIN: 'Manage hero sliders, deals, categories, and business directory profiles.',
    MARKETING_ADMIN: 'Edit homepage campaigns, promotional badges, and branding styles.',
    SUPPORT_ADMIN: 'View customers, handle support requests, review audit logs and redemptions.',
    VIEWER: 'Read-only access to statistical overviews, voucher metrics and logs.',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-[#1E293B] text-white p-6 rounded-3xl shadow-sm border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <UserCog className="w-6 h-6 text-[#0D9CFD]" />
              <h2 className="text-xl font-black tracking-tight">
                Role-Based Access Control (RBAC)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              Enforce strict departmental segregation of duties across Spotera operations. Assign specific sub-roles to team members with automatic server-side permission validation.
            </p>
          </div>

          <button
            onClick={fetchUsers}
            className="self-start sm:self-auto px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Accounts</span>
          </button>
        </div>
      </div>

      {/* Permissions Matrix Overview */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#0D9CFD]" />
          Admin Sub-Role Permissions Matrix
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {(
            [
              'SUPER_ADMIN',
              'CONTENT_ADMIN',
              'MARKETING_ADMIN',
              'SUPPORT_ADMIN',
              'VIEWER',
            ] as AdminSubRole[]
          ).map((roleKey) => (
            <div
              key={roleKey}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-900 tracking-wide">
                  {roleKey.replace('_', ' ')}
                </span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    roleKey === 'SUPER_ADMIN'
                      ? 'bg-rose-100 text-rose-800'
                      : roleKey === 'VIEWER'
                      ? 'bg-slate-200 text-slate-700'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {roleKey === 'SUPER_ADMIN' ? 'Root' : 'Departmental'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                {subRoleDescriptions[roleKey]}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Users & Admins Management Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#0D9CFD]" />
            <h3 className="text-sm font-bold text-slate-900">User Accounts & Team Permissions</h3>
            <span className="text-xs text-slate-400 font-semibold">({filteredUsers.length})</span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-[#0D9CFD]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200/80 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">User Details</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Admin Sub-Role</th>
                <th className="py-3 px-4">Membership</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredUsers.map((u) => {
                const isMasterAdmin = u.email.toLowerCase() === 'admin@spoteradeals.com';
                const isUpdating = updatingUserId === u.id;

                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{u.name}</span>
                        {isMasterAdmin && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-rose-100 text-rose-800">
                            MASTER ROOT
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 block">{u.email}</span>
                      {u.phone && (
                        <span className="text-[10px] text-slate-400 block">{u.phone}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <select
                        value={u.role}
                        disabled={isMasterAdmin || currentAdminSubRole !== 'SUPER_ADMIN' || isUpdating}
                        onChange={(e) =>
                          handleUpdateRole(
                            u.id,
                            u.email,
                            e.target.value as any,
                            u.role === 'ADMIN' ? u.adminSubRole : undefined
                          )
                        }
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white text-slate-800 disabled:bg-slate-50 disabled:text-slate-400 focus:outline-none focus:border-[#0D9CFD]"
                      >
                        <option value="CUSTOMER">Customer</option>
                        <option value="PARTNER">Partner / Merchant</option>
                        <option value="ADMIN">Administrator</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {u.role === 'ADMIN' ? (
                        <select
                          value={u.adminSubRole || 'VIEWER'}
                          disabled={
                            isMasterAdmin ||
                            currentAdminSubRole !== 'SUPER_ADMIN' ||
                            isUpdating
                          }
                          onChange={(e) =>
                            handleUpdateRole(
                              u.id,
                              u.email,
                              'ADMIN',
                              e.target.value as AdminSubRole
                            )
                          }
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-bold bg-white text-slate-800 disabled:bg-slate-50 disabled:text-slate-400 focus:outline-none focus:border-[#0D9CFD]"
                        >
                          <option value="SUPER_ADMIN">Super Administrator</option>
                          <option value="CONTENT_ADMIN">Content Admin</option>
                          <option value="MARKETING_ADMIN">Marketing Admin</option>
                          <option value="SUPPORT_ADMIN">Support Admin</option>
                          <option value="VIEWER">Read-Only Viewer</option>
                        </select>
                      ) : (
                        <span className="text-slate-400 text-xs italic">N/A (Non-Admin)</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {u.membership}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-right">
                      {isMasterAdmin ? (
                        <span className="text-[11px] text-slate-400 font-semibold italic">
                          Protected Account
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            if (u.role === 'ADMIN') {
                              handleUpdateRole(u.id, u.email, 'CUSTOMER');
                            } else {
                              handleUpdateRole(u.id, u.email, 'ADMIN', 'CONTENT_ADMIN');
                            }
                          }}
                          disabled={currentAdminSubRole !== 'SUPER_ADMIN' || isUpdating}
                          className="text-xs font-bold text-[#0D9CFD] hover:underline disabled:opacity-50 cursor-pointer"
                        >
                          {u.role === 'ADMIN' ? 'Demote to Customer' : 'Promote to Admin'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
