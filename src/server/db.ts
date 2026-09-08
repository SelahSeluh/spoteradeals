import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export type ServerAdminSubRole =
  | 'SUPER_ADMIN'
  | 'CONTENT_ADMIN'
  | 'MARKETING_ADMIN'
  | 'SUPPORT_ADMIN'
  | 'VIEWER';

export interface UserAccount {
  id: string;
  email: string;
  password?: string;
  name: string;
  phone: string;
  avatar?: string;
  googleId?: string;
  authProvider?: 'google' | 'email' | 'guest' | 'apple';
  role: 'CUSTOMER' | 'PARTNER' | 'ADMIN';
  adminSubRole?: ServerAdminSubRole;
  membership: 'Free' | 'Silver VIP' | 'Gold VIP' | 'Premium VIP';
  businessId?: string;
  createdAt: string;
}

export interface VoucherRecord {
  id: string;
  code: string;
  dealId: string;
  dealTitle: string;
  businessName: string;
  businessId?: string;
  userId: string;
  userName: string;
  claimedAt: string;
  expiryDate: string;
  status: 'active' | 'redeemed' | 'expired';
  redeemedAt?: string;
  redeemedByPartnerId?: string;
  qrCodeData: string;
  redemptionInstructions: string;
}

export interface BookingRecord {
  id: string;
  bookingCode: string;
  dealId: string;
  dealTitle: string;
  businessName: string;
  businessId?: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  date: string;
  timeSlot: string;
  childrenCount: number;
  packageSelected: string;
  totalPrice: number;
  status: 'confirmed' | 'redeemed' | 'cancelled';
  redeemedAt?: string;
  createdAt: string;
}

export interface SessionRecord {
  token: string;
  userId: string;
  email: string;
  role: 'CUSTOMER' | 'PARTNER' | 'ADMIN';
  adminSubRole?: ServerAdminSubRole;
  name: string;
  businessId?: string;
  createdAt: number;
}

export interface ServerAuditLog {
  id: string;
  timestamp: string;
  actorEmail: string;
  adminId?: string;
  role: string;
  action: string;
  resource: string;
  resourceId?: string;
  status: 'SUCCESS' | 'FAILED' | 'BLOCKED';
  details?: Record<string, any>;
  ipAddress?: string;
}

export interface ServerBackupRecord {
  id: string;
  timestamp: string;
  filename: string;
  sizeBytes: number;
  checksum: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'FAILED' | 'RESTORED';
  actorEmail: string;
  description: string;
  recordCounts: {
    users: number;
    deals: number;
    vouchers: number;
    bookings: number;
    auditLogs: number;
  };
}

export interface ServerVersionSnapshot {
  id: string;
  timestamp: string;
  scope: 'HOMEPAGE' | 'BRANDING' | 'FONTS' | 'PROMOTIONS' | 'DEALS' | 'DATABASE';
  targetId?: string;
  authorEmail: string;
  summary: string;
  dataSnapshot: any;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const BACKUPS_DIR = path.join(DATA_DIR, 'backups');
const DB_PATH = path.join(DATA_DIR, 'spotera_db.json');

interface DatabaseSchema {
  adminConfigured: boolean;
  users: UserAccount[];
  vouchers: VoucherRecord[];
  bookings: BookingRecord[];
  sessions: Record<string, SessionRecord>;
  auditLogs: ServerAuditLog[];
  backups: ServerBackupRecord[];
  versions: ServerVersionSnapshot[];
  contentState: Record<string, any>;
}

const initialDb: DatabaseSchema = {
  adminConfigured: false,
  users: [],
  vouchers: [],
  bookings: [],
  sessions: {},
  auditLogs: [],
  backups: [],
  versions: [],
  contentState: {},
};

export class ServerDB {
  private static data: DatabaseSchema = initialDb;

  public static init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (!fs.existsSync(BACKUPS_DIR)) {
        fs.mkdirSync(BACKUPS_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_PATH)) {
        const fileContent = fs.readFileSync(DB_PATH, 'utf-8');
        const loaded = JSON.parse(fileContent);

        // Sanitize database: filter out legacy demo accounts
        loaded.users = (loaded.users || []).filter(
          (u: UserAccount) =>
            u.email !== 'customer@spoteradeals.com' &&
            u.email !== 'rashid.family@spoteradeals.com' &&
            !u.name.toLowerCase().includes('rashid') &&
            !u.name.toLowerCase().includes('sara al mansoori')
        );

        // Clean user handles
        loaded.users.forEach((u: UserAccount) => {
          const lower = (u.name || '').trim().toLowerCase();
          if (!u.name || lower === 'google user' || lower === 'google' || lower === 'g' || lower === 'guest user') {
            const handle = u.email ? u.email.split('@')[0].replace(/[._-]/g, ' ') : 'Member';
            u.name = handle.charAt(0).toUpperCase() + handle.slice(1);
          }
          if (u.role === 'ADMIN' && !u.adminSubRole) {
            u.adminSubRole = 'SUPER_ADMIN';
          }
        });

        loaded.vouchers = (loaded.vouchers || []).filter(
          (v: VoucherRecord) =>
            !v.userName?.toLowerCase().includes('rashid') &&
            !v.userName?.toLowerCase().includes('sara al mansoori')
        );
        loaded.bookings = (loaded.bookings || []).filter(
          (b: BookingRecord) =>
            !b.userName?.toLowerCase().includes('rashid') &&
            !b.userName?.toLowerCase().includes('sara al mansoori') &&
            b.userEmail !== 'customer@spoteradeals.com'
        );

        if (!Array.isArray(loaded.backups)) loaded.backups = [];
        if (!Array.isArray(loaded.versions)) loaded.versions = [];
        if (!loaded.contentState || typeof loaded.contentState !== 'object') loaded.contentState = {};
        if (!Array.isArray(loaded.auditLogs)) loaded.auditLogs = [];

        ServerDB.data = loaded;
        ServerDB.save();
      } else {
        ServerDB.save();
      }
    } catch (e) {
      console.error('Failed to load server DB file, using in-memory state:', e);
    }
  }

  public static save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(ServerDB.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to save server DB file:', e);
    }
  }

  public static getAdminConfigured(): boolean {
    return ServerDB.data.adminConfigured;
  }

  public static setAdminConfigured(val: boolean) {
    ServerDB.data.adminConfigured = val;
    ServerDB.save();
  }

  public static findUserByEmail(email: string): UserAccount | undefined {
    const clean = email.trim().toLowerCase();
    return ServerDB.data.users.find((u) => u.email.toLowerCase() === clean);
  }

  public static findUserById(id: string): UserAccount | undefined {
    return ServerDB.data.users.find((u) => u.id === id);
  }

  public static createUser(user: Omit<UserAccount, 'id' | 'createdAt'>): UserAccount {
    const newAccount: UserAccount = {
      ...user,
      id: 'usr_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      createdAt: new Date().toISOString(),
    };
    ServerDB.data.users.push(newAccount);
    ServerDB.save();
    return newAccount;
  }

  public static upsertGoogleUser(profile: {
    email: string;
    name: string;
    avatar?: string;
    googleId?: string;
  }): UserAccount {
    const cleanEmail = profile.email.trim().toLowerCase();
    const rawName = (profile.name || '').trim();
    const isGoogleName = !rawName || ['google user', 'google', 'g', 'guest user'].includes(rawName.toLowerCase());
    
    const derivedName = (() => {
      if (!isGoogleName) return rawName;
      const handle = cleanEmail.split('@')[0].replace(/[._-]/g, ' ');
      return handle ? handle.charAt(0).toUpperCase() + handle.slice(1) : 'Spotera Member';
    })();

    let user = ServerDB.findUserByEmail(cleanEmail);
    if (user) {
      if (!user.name || ['google user', 'google', 'g', 'guest user'].includes(user.name.toLowerCase())) {
        user.name = derivedName;
      } else if (!isGoogleName && profile.name) {
        user.name = profile.name;
      }
      if (profile.avatar) {
        user.avatar = profile.avatar;
      }
      if (profile.googleId) {
        user.googleId = profile.googleId;
      }
      user.authProvider = user.authProvider || 'google';
      ServerDB.save();
      return user;
    }

    const newAccount: UserAccount = {
      id: 'usr_g_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      email: cleanEmail,
      name: derivedName,
      phone: '',
      avatar: profile.avatar || '',
      googleId: profile.googleId,
      authProvider: 'google',
      role: 'CUSTOMER',
      membership: 'Free',
      createdAt: new Date().toISOString(),
    };
    ServerDB.data.users.push(newAccount);
    ServerDB.save();
    return newAccount;
  }

  public static updateUserPassword(userId: string, newPass: string) {
    const usr = ServerDB.data.users.find((u) => u.id === userId);
    if (usr) {
      usr.password = newPass;
      ServerDB.save();
    }
  }

  public static upsertAdminAccount(email: string, pass: string, subRole: ServerAdminSubRole = 'SUPER_ADMIN'): UserAccount {
    const cleanEmail = email.trim().toLowerCase() || 'admin@spoteradeals.com';
    let admin = ServerDB.data.users.find((u) => u.role === 'ADMIN' || u.email.toLowerCase() === cleanEmail);
    if (admin) {
      admin.email = cleanEmail;
      admin.password = pass;
      admin.role = 'ADMIN';
      admin.adminSubRole = subRole || admin.adminSubRole || 'SUPER_ADMIN';
    } else {
      admin = {
        id: 'usr_admin_master',
        email: cleanEmail,
        password: pass,
        name: 'Spotera Master Administrator',
        phone: '+971 4 000 9999',
        role: 'ADMIN',
        adminSubRole: 'SUPER_ADMIN',
        membership: 'Premium VIP',
        createdAt: new Date().toISOString(),
      };
      ServerDB.data.users.push(admin);
    }
    ServerDB.data.adminConfigured = true;
    ServerDB.save();
    return admin;
  }

  public static upsertPartnerAccount(email: string, pass: string, name?: string, businessId?: string): UserAccount {
    const cleanEmail = email.trim().toLowerCase() || 'partner@spoteradeals.com';
    let partner = ServerDB.data.users.find((u) => u.role === 'PARTNER' && u.email.toLowerCase() === cleanEmail);
    if (partner) {
      partner.password = pass;
      if (businessId) partner.businessId = businessId;
    } else {
      partner = {
        id: 'usr_partner_' + Date.now(),
        email: cleanEmail,
        password: pass,
        name: name || 'OliOli Play Museum Front Desk',
        phone: '+971 4 701 4000',
        role: 'PARTNER',
        membership: 'Free',
        businessId: businessId || 'biz_1',
        createdAt: new Date().toISOString(),
      };
      ServerDB.data.users.push(partner);
    }
    ServerDB.save();
    return partner;
  }

  // Session handling
  public static createSession(userId: string): SessionRecord {
    const usr = ServerDB.findUserById(userId);
    if (!usr) throw new Error('User not found');

    const token = 'spt_sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const session: SessionRecord = {
      token,
      userId: usr.id,
      email: usr.email,
      role: usr.role,
      adminSubRole: usr.adminSubRole,
      name: usr.name,
      businessId: usr.businessId,
      createdAt: Date.now(),
    };
    ServerDB.data.sessions[token] = session;
    ServerDB.save();
    return session;
  }

  public static getSession(token: string): SessionRecord | undefined {
    return ServerDB.data.sessions[token];
  }

  public static deleteSession(token: string) {
    delete ServerDB.data.sessions[token];
    ServerDB.save();
  }

  // Voucher redemption server validation
  public static findVoucherByCode(code: string): VoucherRecord | undefined {
    const clean = code.trim().toUpperCase();
    return ServerDB.data.vouchers.find((v) => v.code.toUpperCase() === clean || v.qrCodeData.toUpperCase().includes(clean));
  }

  public static findBookingByCode(code: string): BookingRecord | undefined {
    const clean = code.trim().toUpperCase();
    return ServerDB.data.bookings.find((b) => b.bookingCode.toUpperCase() === clean);
  }

  public static redeemVoucherServer(code: string, partnerId: string): { success: boolean; reason?: string; message: string; record?: any } {
    const v = ServerDB.findVoucherByCode(code);
    if (v) {
      if (v.status === 'redeemed') {
        return {
          success: false,
          reason: 'ALREADY_REDEEMED',
          message: `Voucher (${v.code}) was ALREADY redeemed on ${v.redeemedAt || 'a previous visit'}. Duplicate redemption blocked!`,
        };
      }
      if (v.status === 'expired') {
        return {
          success: false,
          reason: 'EXPIRED',
          message: `Voucher (${v.code}) has expired on ${v.expiryDate}.`,
        };
      }
      v.status = 'redeemed';
      v.redeemedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
      v.redeemedByPartnerId = partnerId;
      ServerDB.save();
      return {
        success: true,
        message: `Voucher (${v.code}) verified & redeemed successfully!`,
        record: {
          title: v.dealTitle,
          customerName: v.userName,
          businessName: v.businessName,
          code: v.code,
        },
      };
    }

    const b = ServerDB.findBookingByCode(code);
    if (b) {
      if (b.status === 'redeemed') {
        return {
          success: false,
          reason: 'ALREADY_REDEEMED',
          message: `Booking (${b.bookingCode}) was ALREADY redeemed on ${b.redeemedAt || 'a previous session'}. Duplicate entry prevented!`,
        };
      }
      b.status = 'redeemed';
      b.redeemedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
      ServerDB.save();
      return {
        success: true,
        message: `Booking (${b.bookingCode}) verified & redeemed successfully!`,
        record: {
          title: b.dealTitle,
          customerName: b.userName,
          businessName: b.businessName,
          code: b.bookingCode,
        },
      };
    }

    return {
      success: false,
      reason: 'NOT_FOUND',
      message: `Invalid code (${code}). Code does not exist in Spotera database.`,
    };
  }

  // Enhanced Admin Audit Logging (supports both object and positional args)
  public static logAudit(
    arg1:
      | {
          actorEmail: string;
          role: string;
          action: string;
          resource?: string;
          resourceId?: string;
          status?: 'SUCCESS' | 'FAILED' | 'BLOCKED';
          details?: Record<string, any>;
          ipAddress?: string;
          adminId?: string;
        }
      | string,
    arg2?: string,
    arg3?: string,
    arg4?: string
  ) {
    let params: {
      actorEmail: string;
      role: string;
      action: string;
      resource?: string;
      resourceId?: string;
      status?: 'SUCCESS' | 'FAILED' | 'BLOCKED';
      details?: Record<string, any>;
      ipAddress?: string;
      adminId?: string;
    };

    if (typeof arg1 === 'string') {
      params = {
        actorEmail: arg1,
        role: arg2 || 'USER',
        action: arg3 || 'ACTION',
        resource: arg4 || 'SYSTEM',
        status: 'SUCCESS',
      };
    } else {
      params = arg1;
    }

    const entry: ServerAuditLog = {
      id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      actorEmail: params.actorEmail,
      adminId: params.adminId,
      role: params.role,
      action: params.action,
      resource: params.resource || 'SYSTEM',
      resourceId: params.resourceId,
      status: params.status || 'SUCCESS',
      details: params.details,
      ipAddress: params.ipAddress || '127.0.0.1',
    };

    if (!Array.isArray(ServerDB.data.auditLogs)) {
      ServerDB.data.auditLogs = [];
    }
    ServerDB.data.auditLogs.unshift(entry);
    if (ServerDB.data.auditLogs.length > 500) {
      ServerDB.data.auditLogs = ServerDB.data.auditLogs.slice(0, 500);
    }
    ServerDB.save();
  }

  // Backup & Rollback Engine
  public static createBackup(actorEmail: string, description: string): ServerBackupRecord {
    if (!fs.existsSync(BACKUPS_DIR)) {
      fs.mkdirSync(BACKUPS_DIR, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `spotera_backup_${timestamp}.json`;
    const filepath = path.join(BACKUPS_DIR, filename);

    // Snapshot payload containing clean state
    const snapshotPayload = {
      created_at: new Date().toISOString(),
      version: '2.5.0',
      description,
      actorEmail,
      data: {
        adminConfigured: ServerDB.data.adminConfigured,
        users: ServerDB.data.users,
        vouchers: ServerDB.data.vouchers,
        bookings: ServerDB.data.bookings,
        contentState: ServerDB.data.contentState,
        versions: ServerDB.data.versions,
        auditLogsCount: ServerDB.data.auditLogs.length,
      },
    };

    const jsonStr = JSON.stringify(snapshotPayload, null, 2);
    fs.writeFileSync(filepath, jsonStr, 'utf-8');

    const stats = fs.statSync(filepath);
    const checksum = crypto.createHash('sha256').update(jsonStr).digest('hex');

    const record: ServerBackupRecord = {
      id: 'bcp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      filename,
      sizeBytes: stats.size,
      checksum,
      status: 'COMPLETED',
      actorEmail,
      description: description || 'Complete Spotera Database Snapshot',
      recordCounts: {
        users: ServerDB.data.users.length,
        deals: 12,
        vouchers: ServerDB.data.vouchers.length,
        bookings: ServerDB.data.bookings.length,
        auditLogs: ServerDB.data.auditLogs.length,
      },
    };

    if (!Array.isArray(ServerDB.data.backups)) ServerDB.data.backups = [];
    ServerDB.data.backups.unshift(record);
    ServerDB.save();

    ServerDB.logAudit({
      actorEmail,
      role: 'ADMIN',
      action: 'CREATE_BACKUP',
      resource: 'BACKUP',
      resourceId: record.id,
      status: 'SUCCESS',
      details: { filename, sizeBytes: stats.size, checksum },
    });

    return record;
  }

  public static restoreBackup(
    backupId: string,
    actorEmail: string
  ): { success: boolean; message: string; recoveryBackupId?: string } {
    const backupRecord = (ServerDB.data.backups || []).find((b) => b.id === backupId);
    if (!backupRecord) {
      return { success: false, message: `Backup ID ${backupId} not found.` };
    }

    const filepath = path.join(BACKUPS_DIR, backupRecord.filename);
    if (!fs.existsSync(filepath)) {
      return { success: false, message: `Backup file ${backupRecord.filename} does not exist on disk.` };
    }

    // 1. Create safety recovery point before restoring
    let recoveryBackupRecord: ServerBackupRecord | null = null;
    try {
      recoveryBackupRecord = ServerDB.createBackup(actorEmail, `Auto-recovery snapshot prior to restoring ${backupRecord.filename}`);
    } catch (err) {
      console.warn('Safety recovery backup creation failed:', err);
    }

    // 2. Read and verify checksum
    const rawContent = fs.readFileSync(filepath, 'utf-8');
    const calculatedHash = crypto.createHash('sha256').update(rawContent).digest('hex');
    if (calculatedHash !== backupRecord.checksum) {
      ServerDB.logAudit({
        actorEmail,
        role: 'ADMIN',
        action: 'RESTORE_BACKUP_CORRUPTED',
        resource: 'BACKUP',
        resourceId: backupId,
        status: 'BLOCKED',
        details: { expected: backupRecord.checksum, actual: calculatedHash },
      });
      return { success: false, message: 'Backup verification failed: SHA-256 Checksum mismatch (corrupted file).' };
    }

    // 3. Atomically apply restored data
    const parsed = JSON.parse(rawContent);
    if (!parsed || !parsed.data) {
      return { success: false, message: 'Invalid backup file format structure.' };
    }

    ServerDB.data.users = parsed.data.users || [];
    ServerDB.data.vouchers = parsed.data.vouchers || [];
    ServerDB.data.bookings = parsed.data.bookings || [];
    if (parsed.data.contentState) ServerDB.data.contentState = parsed.data.contentState;
    if (parsed.data.versions) ServerDB.data.versions = parsed.data.versions;
    if (parsed.data.adminConfigured !== undefined) ServerDB.data.adminConfigured = parsed.data.adminConfigured;

    backupRecord.status = 'RESTORED';
    ServerDB.save();

    ServerDB.logAudit({
      actorEmail,
      role: 'ADMIN',
      action: 'RESTORE_BACKUP',
      resource: 'BACKUP',
      resourceId: backupId,
      status: 'SUCCESS',
      details: {
        restoredFile: backupRecord.filename,
        safetyRecoveryId: recoveryBackupRecord?.id,
        recordsRestored: {
          users: ServerDB.data.users.length,
          vouchers: ServerDB.data.vouchers.length,
          bookings: ServerDB.data.bookings.length,
        },
      },
    });

    return {
      success: true,
      message: `Database successfully restored from ${backupRecord.filename}.`,
      recoveryBackupId: recoveryBackupRecord?.id,
    };
  }

  public static getBackups(): ServerBackupRecord[] {
    return ServerDB.data.backups || [];
  }

  public static getBackupFile(backupId: string): { filename: string; content: string } | null {
    const bcp = (ServerDB.data.backups || []).find((b) => b.id === backupId);
    if (!bcp) return null;
    const filepath = path.join(BACKUPS_DIR, bcp.filename);
    if (!fs.existsSync(filepath)) return null;
    return {
      filename: bcp.filename,
      content: fs.readFileSync(filepath, 'utf-8'),
    };
  }

  // Version Snapshots & Rollback
  public static saveVersionSnapshot(
    snapshot: Omit<ServerVersionSnapshot, 'id' | 'timestamp'>
  ): ServerVersionSnapshot {
    const record: ServerVersionSnapshot = {
      ...snapshot,
      id: 'ver_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
    };
    if (!Array.isArray(ServerDB.data.versions)) ServerDB.data.versions = [];
    ServerDB.data.versions.unshift(record);
    if (ServerDB.data.versions.length > 200) {
      ServerDB.data.versions = ServerDB.data.versions.slice(0, 200);
    }
    ServerDB.save();

    ServerDB.logAudit({
      actorEmail: snapshot.authorEmail,
      role: 'ADMIN',
      action: 'SAVE_VERSION',
      resource: snapshot.scope,
      resourceId: snapshot.targetId,
      status: 'SUCCESS',
      details: { summary: snapshot.summary },
    });

    return record;
  }

  public static getVersionSnapshots(scope?: string): ServerVersionSnapshot[] {
    const list = ServerDB.data.versions || [];
    if (!scope) return list;
    return list.filter((v) => v.scope === scope);
  }

  public static rollbackVersion(
    versionId: string,
    actorEmail: string
  ): { success: boolean; message: string; restoredSnapshot?: any } {
    const ver = (ServerDB.data.versions || []).find((v) => v.id === versionId);
    if (!ver) {
      return { success: false, message: `Version ${versionId} was not found.` };
    }

    // Save auto-recovery point of current state
    const currentScopeData = ServerDB.data.contentState[ver.scope] || null;
    ServerDB.saveVersionSnapshot({
      scope: ver.scope,
      targetId: ver.targetId,
      authorEmail: actorEmail,
      summary: `Auto-saved point before rollback to ${ver.id} (${ver.summary})`,
      dataSnapshot: currentScopeData,
    });

    // Apply snapshot
    ServerDB.data.contentState[ver.scope] = ver.dataSnapshot;
    ServerDB.save();

    ServerDB.logAudit({
      actorEmail,
      role: 'ADMIN',
      action: 'ROLLBACK_VERSION',
      resource: ver.scope,
      resourceId: versionId,
      status: 'SUCCESS',
      details: { scope: ver.scope, originalSummary: ver.summary },
    });

    return {
      success: true,
      message: `Successfully rolled back ${ver.scope} to version from ${ver.timestamp}.`,
      restoredSnapshot: ver.dataSnapshot,
    };
  }

  // Manage Content State
  public static saveContent(scope: string, data: any, actorEmail: string, summary: string) {
    if (!ServerDB.data.contentState) ServerDB.data.contentState = {};
    ServerDB.data.contentState[scope] = data;

    // Automatically snapshot version
    ServerDB.saveVersionSnapshot({
      scope: (scope.toUpperCase() as any) || 'BRANDING',
      authorEmail: actorEmail,
      summary,
      dataSnapshot: data,
    });

    ServerDB.save();
  }

  public static getContent(scope: string) {
    return ServerDB.data.contentState?.[scope] || null;
  }

  // RBAC User Management
  public static updateUserRole(
    userId: string,
    role: 'CUSTOMER' | 'PARTNER' | 'ADMIN',
    subRole?: ServerAdminSubRole,
    actorEmail?: string
  ): { success: boolean; message: string } {
    const usr = ServerDB.findUserById(userId);
    if (!usr) {
      return { success: false, message: 'User not found.' };
    }

    // Prevent demoting or deleting Master Super Admin
    if (usr.email.toLowerCase() === 'admin@spoteradeals.com' && role !== 'ADMIN') {
      return { success: false, message: 'Master Super Administrator account cannot be demoted.' };
    }

    usr.role = role;
    if (role === 'ADMIN') {
      usr.adminSubRole = subRole || 'VIEWER';
    } else {
      delete usr.adminSubRole;
    }
    ServerDB.save();

    ServerDB.logAudit({
      actorEmail: actorEmail || 'system',
      role: 'ADMIN',
      action: 'UPDATE_USER_ROLE',
      resource: 'USER',
      resourceId: userId,
      status: 'SUCCESS',
      details: { targetEmail: usr.email, newRole: role, newSubRole: usr.adminSubRole },
    });

    return { success: true, message: `Updated ${usr.name}'s role to ${role}${usr.adminSubRole ? ` (${usr.adminSubRole})` : ''}.` };
  }

  public static getAllUsers() {
    return ServerDB.data.users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      phone: u.phone,
      role: u.role,
      adminSubRole: u.adminSubRole,
      membership: u.membership,
      createdAt: u.createdAt,
    }));
  }

  public static getAllVouchers() {
    return ServerDB.data.vouchers;
  }

  public static getAllBookings() {
    return ServerDB.data.bookings;
  }

  public static getAuditLogs(filter?: {
    action?: string;
    actor?: string;
    status?: string;
    limit?: number;
  }): ServerAuditLog[] {
    let logs = ServerDB.data.auditLogs || [];
    if (filter?.action) {
      const act = filter.action.toLowerCase();
      logs = logs.filter((l) => l.action.toLowerCase().includes(act));
    }
    if (filter?.actor) {
      const actr = filter.actor.toLowerCase();
      logs = logs.filter((l) => l.actorEmail.toLowerCase().includes(actr));
    }
    if (filter?.status) {
      logs = logs.filter((l) => l.status === filter.status);
    }
    const limit = filter?.limit || 100;
    return logs.slice(0, limit);
  }
}

ServerDB.init();
