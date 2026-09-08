import express, { Request, Response, NextFunction } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { ServerDB, ServerAdminSubRole } from "./src/server/db";

dotenv.config();

const app = express();
const PORT = 3000;

// Enable proxy trusting for Google Cloud Run SSL & custom domain headers
app.set("trust proxy", true);

app.use(express.json());

// Helper to extract session token
function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.substring(7).trim();
  }
  const customHeader = req.headers["x-session-token"];
  if (typeof customHeader === "string") {
    return customHeader.trim();
  }
  return null;
}

// Authentication & Role authorization middleware
function requireAuth(allowedRoles?: Array<"CUSTOMER" | "PARTNER" | "ADMIN">) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = extractToken(req);
    if (!token) {
      res.status(401).json({ error: "UNAUTHORIZED", message: "Missing authentication token header." });
      return;
    }
    const session = ServerDB.getSession(token);
    if (!session) {
      res.status(401).json({ error: "UNAUTHORIZED", message: "Invalid or expired session. Please log in again." });
      return;
    }
    if (allowedRoles && !allowedRoles.includes(session.role)) {
      res.status(403).json({
        error: "FORBIDDEN",
        message: `Forbidden: Role '${session.role}' is not authorized to access this resource. Required role: ${allowedRoles.join(" or ")}.`,
      });
      return;
    }
    (req as any).userSession = session;
    next();
  };
}

// Fine-Grained Admin RBAC authorization middleware
function requireAdminSubRole(allowedSubRoles?: ServerAdminSubRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = extractToken(req);
    if (!token) {
      res.status(401).json({ error: "UNAUTHORIZED", message: "Missing authentication token header." });
      return;
    }
    const session = ServerDB.getSession(token);
    if (!session || session.role !== "ADMIN") {
      res.status(403).json({ error: "FORBIDDEN", message: "Forbidden: Admin privileges required." });
      return;
    }

    const subRole: ServerAdminSubRole = session.adminSubRole || "SUPER_ADMIN";
    // Super Admin has unrestricted access to all operations
    if (subRole === "SUPER_ADMIN") {
      (req as any).userSession = session;
      return next();
    }

    if (allowedSubRoles && !allowedSubRoles.includes(subRole)) {
      ServerDB.logAudit({
        actorEmail: session.email,
        adminId: session.userId,
        role: "ADMIN",
        action: "UNAUTHORIZED_ADMIN_ACCESS_ATTEMPT",
        resource: req.path,
        status: "BLOCKED",
        details: { subRole, allowedSubRoles, method: req.method },
        ipAddress: req.ip || "127.0.0.1",
      });

      res.status(403).json({
        error: "FORBIDDEN",
        message: `Forbidden: Sub-role '${subRole}' is not permitted to perform this action. Required: ${allowedSubRoles.join(", ")} or SUPER_ADMIN.`,
      });
      return;
    }

    (req as any).userSession = session;
    next();
  };
}

// Initialize Gemini client lazily or safely
let genAiClient: GoogleGenAI | null = null;
function getGenAiClient(): GoogleGenAI | null {
  if (!genAiClient && process.env.GEMINI_API_KEY) {
    genAiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAiClient;
}

// API Health route
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Spotera Deals API", time: new Date().toISOString() });
});

// Auth Endpoints (Server-Enforced)
app.get("/api/auth/status", (_req, res) => {
  res.json({
    adminConfigured: ServerDB.getAdminConfigured(),
    serverTime: new Date().toISOString(),
  });
});

app.post("/api/auth/setup-admin", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password || password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters long." });
      return;
    }
    const adminEmail = email ? email.trim().toLowerCase() : "admin@spoteradeals.com";
    const adminAcc = ServerDB.upsertAdminAccount(adminEmail, password);
    const session = ServerDB.createSession(adminAcc.id);
    ServerDB.logAudit(adminAcc.email, "ADMIN", "Master Admin Account initialized/updated via Server API");

    res.json({
      success: true,
      message: "Admin account setup completed successfully on server.",
      token: session.token,
      user: {
        id: adminAcc.id,
        email: adminAcc.email,
        name: adminAcc.name,
        role: adminAcc.role,
      },
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message || "Failed to setup admin account" });
  }
});

app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password, requestedRole } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required." });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = ServerDB.findUserByEmail(cleanEmail);

    if (!user) {
      if ((cleanEmail === "admin@spoteradeals.com" || requestedRole === "ADMIN") && !ServerDB.getAdminConfigured()) {
        res.status(400).json({ error: "SETUP_REQUIRED", message: "Admin account requires first-time setup." });
        return;
      }
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    if (user.password !== password) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    if (requestedRole && user.role !== requestedRole) {
      res.status(403).json({
        error: `Account role mismatch. This account is registered as '${user.role}', not '${requestedRole}'.`,
      });
      return;
    }

    const session = ServerDB.createSession(user.id);
    ServerDB.logAudit(user.email, user.role, `Logged in successfully via ${user.role} Portal`);

    res.json({
      success: true,
      token: session.token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar || "",
        role: user.role,
        membership: user.membership,
        businessId: user.businessId,
        authProvider: user.authProvider || "email",
      },
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message || "Login failed" });
  }
});

app.post("/api/auth/register", (req, res) => {
  try {
    const { email, password, name, phone, role = "CUSTOMER", businessId } = req.body;
    if (!email || !password || !name) {
      res.status(400).json({ error: "Email, password, and name are required." });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: "Password must be at least 6 characters long." });
      return;
    }

    const existing = ServerDB.findUserByEmail(email);
    if (existing) {
      res.status(400).json({ error: "An account with this email address already exists." });
      return;
    }

    const newUser = ServerDB.createUser({
      email: email.trim().toLowerCase(),
      password,
      name: name.trim(),
      phone: phone ? phone.trim() : "",
      role: role === "PARTNER" ? "PARTNER" : "CUSTOMER",
      membership: "Free",
      businessId: businessId || undefined,
      authProvider: "email",
    });

    const session = ServerDB.createSession(newUser.id);
    ServerDB.logAudit(newUser.email, newUser.role, `New ${newUser.role} account registered`);

    res.json({
      success: true,
      token: session.token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone,
        avatar: newUser.avatar || "",
        role: newUser.role,
        membership: newUser.membership,
        businessId: newUser.businessId,
        authProvider: "email",
      },
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message || "Registration failed" });
  }
});

app.post("/api/auth/google", (req, res) => {
  try {
    const { credential, email, name, picture, googleId } = req.body;
    let userEmail = email;
    let userName = name;
    let userPicture = picture;
    let userGoogleId = googleId;

    // Decode Google JWT credential from Google Identity Services
    if (credential && typeof credential === "string") {
      try {
        const parts = credential.split(".");
        if (parts.length === 3) {
          const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
          const decodedJson = Buffer.from(payloadBase64, "base64").toString("utf-8");
          const payload = JSON.parse(decodedJson);
          if (payload.email) {
            userEmail = payload.email;
            userName = payload.name || payload.given_name || userName;
            userPicture = payload.picture || userPicture;
            userGoogleId = payload.sub || userGoogleId;
          }
        }
      } catch (jwtErr) {
        console.warn("Could not decode Google JWT credential:", jwtErr);
      }
    }

    if (!userEmail || !userEmail.includes("@")) {
      res.status(400).json({ error: "A valid email address is required for Google Sign-In." });
      return;
    }

    const cleanEmail = userEmail.trim().toLowerCase();
    const rawName = (userName || "").trim();
    const isGoogleName = !rawName || ["google user", "google", "g", "guest user"].includes(rawName.toLowerCase());
    const emailHandle = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
    const cleanName = isGoogleName ? (emailHandle ? emailHandle.charAt(0).toUpperCase() + emailHandle.slice(1) : "Spotera Member") : rawName;

    const googleUser = ServerDB.upsertGoogleUser({
      email: cleanEmail,
      name: cleanName,
      avatar: userPicture,
      googleId: userGoogleId,
    });

    const session = ServerDB.createSession(googleUser.id);
    ServerDB.logAudit(googleUser.email, googleUser.role, "Signed in via Google Authentication");

    res.json({
      success: true,
      token: session.token,
      user: {
        id: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        phone: googleUser.phone,
        avatar: googleUser.avatar || "",
        role: googleUser.role,
        membership: googleUser.membership,
        businessId: googleUser.businessId,
        authProvider: "google",
      },
    });
  } catch (e: any) {
    res.status(500).json({ error: e.message || "Google authentication failed" });
  }
});

app.get("/api/auth/me", (req, res) => {
  const token = extractToken(req);
  if (!token) {
    res.json({ authenticated: false });
    return;
  }
  const session = ServerDB.getSession(token);
  if (!session) {
    res.json({ authenticated: false });
    return;
  }
  const user = ServerDB.findUserById(session.userId);
  if (!user) {
    res.json({ authenticated: false });
    return;
  }
  res.json({
    authenticated: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      avatar: user.avatar || "",
      role: user.role,
      membership: user.membership,
      businessId: user.businessId,
      authProvider: user.authProvider || "email",
    },
  });
});

app.post("/api/auth/logout", (req, res) => {
  const token = extractToken(req);
  if (token) {
    ServerDB.deleteSession(token);
  }
  res.json({ success: true, message: "Logged out from server." });
});

// PROTECTED ADMIN ROUTE - SERVER ENFORCED
app.get("/api/admin/overview", requireAdminSubRole(["SUPER_ADMIN", "CONTENT_ADMIN", "MARKETING_ADMIN", "SUPPORT_ADMIN", "VIEWER"]), (req, res) => {
  const session = (req as any).userSession;
  ServerDB.logAudit({
    actorEmail: session.email,
    adminId: session.userId,
    role: "ADMIN",
    action: "ACCESS_ADMIN_OVERVIEW",
    resource: "DASHBOARD",
    status: "SUCCESS",
    ipAddress: req.ip,
  });

  res.json({
    success: true,
    adminSubRole: session.adminSubRole || "SUPER_ADMIN",
    stats: {
      totalUsers: ServerDB.getAllUsers().length,
      activeVouchers: ServerDB.getAllVouchers().filter((v) => v.status === "active").length,
      redeemedVouchers: ServerDB.getAllVouchers().filter((v) => v.status === "redeemed").length,
      totalBookings: ServerDB.getAllBookings().length,
      totalBackups: ServerDB.getBackups().length,
    },
    users: ServerDB.getAllUsers(),
    vouchers: ServerDB.getAllVouchers(),
    bookings: ServerDB.getAllBookings(),
    auditLogs: ServerDB.getAuditLogs({ limit: 50 }),
    backups: ServerDB.getBackups().slice(0, 10),
  });
});

// Admin Audit Logs API
app.get("/api/admin/audit-logs", requireAdminSubRole(["SUPER_ADMIN", "SUPPORT_ADMIN"]), (req, res) => {
  const { action, actor, status, limit } = req.query;
  const logs = ServerDB.getAuditLogs({
    action: typeof action === "string" ? action : undefined,
    actor: typeof actor === "string" ? actor : undefined,
    status: typeof status === "string" ? status : undefined,
    limit: limit ? parseInt(limit as string, 10) : 100,
  });
  res.json({ success: true, count: logs.length, logs });
});

// Admin User Management API (RBAC)
app.get("/api/admin/users", requireAdminSubRole(["SUPER_ADMIN", "SUPPORT_ADMIN"]), (_req, res) => {
  res.json({ success: true, users: ServerDB.getAllUsers() });
});

app.post("/api/admin/users/role", requireAdminSubRole(["SUPER_ADMIN"]), (req, res) => {
  const session = (req as any).userSession;
  const { userId, role, subRole } = req.body;
  if (!userId || !role) {
    res.status(400).json({ error: "userId and role are required." });
    return;
  }
  const result = ServerDB.updateUserRole(userId, role, subRole, session.email);
  if (!result.success) {
    res.status(400).json(result);
    return;
  }
  res.json(result);
});

// Admin Backup & Restore System
app.get("/api/admin/backups", requireAdminSubRole(["SUPER_ADMIN"]), (_req, res) => {
  res.json({ success: true, backups: ServerDB.getBackups() });
});

app.post("/api/admin/backups/create", requireAdminSubRole(["SUPER_ADMIN"]), (req, res) => {
  try {
    const session = (req as any).userSession;
    const { description } = req.body;
    const backup = ServerDB.createBackup(session.email, description || "Manual Admin Backup");
    res.json({ success: true, message: "Backup snapshot generated successfully.", backup });
  } catch (e: any) {
    res.status(500).json({ error: e.message || "Failed to create backup" });
  }
});

app.post("/api/admin/backups/restore", requireAdminSubRole(["SUPER_ADMIN"]), (req, res) => {
  try {
    const session = (req as any).userSession;
    const { backupId } = req.body;
    if (!backupId) {
      res.status(400).json({ error: "backupId is required." });
      return;
    }
    const result = ServerDB.restoreBackup(backupId, session.email);
    if (!result.success) {
      res.status(400).json(result);
      return;
    }
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message || "Failed to restore backup" });
  }
});

app.get("/api/admin/backups/:id/download", requireAdminSubRole(["SUPER_ADMIN"]), (req, res) => {
  const backupId = req.params.id;
  const backupFile = ServerDB.getBackupFile(backupId);
  if (!backupFile) {
    res.status(404).json({ error: "Backup file not found." });
    return;
  }
  res.setHeader("Content-Disposition", `attachment; filename="${backupFile.filename}"`);
  res.setHeader("Content-Type", "application/json");
  res.send(backupFile.content);
});

// Admin Version Snapshots & Rollback
app.get("/api/admin/versions", requireAdminSubRole(["SUPER_ADMIN", "CONTENT_ADMIN", "MARKETING_ADMIN"]), (req, res) => {
  const scope = typeof req.query.scope === "string" ? req.query.scope : undefined;
  const versions = ServerDB.getVersionSnapshots(scope);
  res.json({ success: true, versions });
});

app.post("/api/admin/versions/rollback", requireAdminSubRole(["SUPER_ADMIN"]), (req, res) => {
  try {
    const session = (req as any).userSession;
    const { versionId } = req.body;
    if (!versionId) {
      res.status(400).json({ error: "versionId is required." });
      return;
    }
    const result = ServerDB.rollbackVersion(versionId, session.email);
    if (!result.success) {
      res.status(400).json(result);
      return;
    }
    res.json(result);
  } catch (e: any) {
    res.status(500).json({ error: e.message || "Rollback failed" });
  }
});

// Admin Content Management with Automatic Version History
app.get("/api/admin/content/:scope", (req, res) => {
  const { scope } = req.params;
  const data = ServerDB.getContent(scope);
  res.json({ success: true, scope, data });
});

app.post("/api/admin/content/:scope", requireAdminSubRole(["SUPER_ADMIN", "CONTENT_ADMIN", "MARKETING_ADMIN"]), (req, res) => {
  try {
    const session = (req as any).userSession;
    const { scope } = req.params;
    const { data, summary } = req.body;

    // RBAC Scope Check
    const subRole = session.adminSubRole || "SUPER_ADMIN";
    if (subRole === "MARKETING_ADMIN" && !["homepage", "promotions", "branding"].includes(scope.toLowerCase())) {
      res.status(403).json({ error: "FORBIDDEN", message: "Marketing Admins can only edit homepage, promotions, or branding content." });
      return;
    }

    ServerDB.saveContent(scope, data, session.email, summary || `Updated ${scope} content`);
    res.json({ success: true, message: `${scope} updated and version snapshot recorded.`, scope });
  } catch (e: any) {
    res.status(500).json({ error: e.message || "Failed to save content" });
  }
});

// PROTECTED PARTNER ROUTE - SERVER ENFORCED
app.get("/api/partner/overview", requireAuth(["PARTNER", "ADMIN"]), (req, res) => {
  const session = (req as any).userSession;
  const partnerUser = ServerDB.findUserById(session.userId);

  const allVouchers = ServerDB.getAllVouchers();
  const partnerVouchers = partnerUser?.businessId
    ? allVouchers.filter((v) => v.businessId === partnerUser.businessId)
    : allVouchers;

  res.json({
    success: true,
    partnerInfo: {
      name: session.name,
      email: session.email,
      businessId: partnerUser?.businessId || "biz_1",
    },
    vouchers: partnerVouchers,
    redemptionCount: partnerVouchers.filter((v) => v.status === "redeemed").length,
  });
});

// SERVER-ENFORCED QR REDEMPTION API
app.post("/api/partner/redeem-code", requireAuth(["PARTNER", "ADMIN"]), (req, res) => {
  try {
    const session = (req as any).userSession;
    const { code } = req.body;
    if (!code) {
      res.status(400).json({ error: "Voucher/Booking code is required." });
      return;
    }

    const redemptionResult = ServerDB.redeemVoucherServer(code, session.userId);
    ServerDB.logAudit(
      session.email,
      session.role,
      `QR Redemption Attempt for code [${code}]: ${redemptionResult.success ? "SUCCESS" : "FAILED (" + redemptionResult.reason + ")"}`
    );

    if (!redemptionResult.success) {
      res.status(400).json(redemptionResult);
      return;
    }

    res.json(redemptionResult);
  } catch (e: any) {
    res.status(500).json({ error: e.message || "Failed to process redemption" });
  }
});

// AI Deals Assistant endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history, language = "en" } = req.body;
    if (!message) {
      res.status(400).json({ error: "Message is required" });
      return;
    }

    const ai = getGenAiClient();
    if (!ai) {
      // Fallback smart response if GEMINI_API_KEY is not yet attached
      res.json({
        reply: `Welcome to Spotera Deals! I'd love to help you find family activities and exclusive offers across Dubai, Abu Dhabi, and the UAE. Try searching for "Kids Play Areas in Dubai", "Birthday Venues under 300 AED", or "Summer Camps". (Note: GEMINI_API_KEY can be attached in Settings > Secrets for full real-time AI capabilities).`,
        recommendations: [
          { name: "OliOli Play Museum", category: "Kids Play Areas", city: "Dubai", discount: "25% OFF" },
          { name: "Cheeky Monkeys Birthday Package", category: "Birthday Parties", city: "Abu Dhabi", discount: "30% OFF" }
        ]
      });
      return;
    }

    const systemInstruction = `You are Spotera, the AI Deals & Family Concierge Assistant for "Spotera Deals" (SpoteraDeals.com), the premier UAE family offers and activities marketplace.
Your goal is to help parents, families, and users discover deals, play areas, birthday venues, summer camps, workshops, restaurants, and attractions across the 7 UAE Emirates (Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, Umm Al Quwain).

Guidelines:
- Provide helpful, enthusiastic, family-centric recommendations in ${language} language.
- Suggest suitable activities based on child age, city, or budget mentioned by the user.
- Highlight current discount perks, coupon claims, and booking advice on Spotera Deals.
- Keep responses clear, warm, and structured with bullet points where appropriate.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: message,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "I found some great family offers on Spotera Deals for you! Check out our Explore page for top verified discounts.";
    res.json({ reply: replyText });
  } catch (error: any) {
    console.error("Error in AI Chat:", error);
    res.status(500).json({
      error: "Failed to generate AI response",
      reply: "I'm having a brief connection issue. Please explore our categories or try asking again!"
    });
  }
});

// AI Daily Family Deal Spotlight Endpoint
app.post("/api/ai/daily-spotlight", async (req, res) => {
  try {
    const { categoryPreference, cityPreference, deals = [], language = "en" } = req.body;
    const ai = getGenAiClient();

    const dealsSummary = Array.isArray(deals) && deals.length > 0
      ? deals.slice(0, 8).map((d: any) => `- ${d.title} (${d.category} in ${d.city}): Discounted to AED ${d.discountPrice} (was AED ${d.originalPrice}, ${d.discountPercent}% OFF)`).join("\n")
      : "- OliOli Play Museum (Dubai): 25% OFF AED 120\n- Cheeky Monkeys Play Pass (Abu Dhabi): 30% OFF AED 85\n- Wild Wadi Waterpark Pass (Dubai): 40% OFF AED 195\n- IMG Worlds of Adventure (Dubai): 35% OFF AED 210";

    if (!ai) {
      // Smart curated fallback when API key is pending
      res.json({
        title: "Today's UAE Family Adventure Spotlight",
        tagline: "Hand-picked play areas & attractions for maximum family savings today",
        familyTip: "Visiting indoor play areas on weekday afternoons or booking waterpark morning passes avoids crowds and gives you the highest value with Spotera passes!",
        featuredCategory: categoryPreference || "Kids Play Areas",
        suggestedCity: cityPreference || "Dubai",
        savingsHighlight: "Save up to 40% across verified UAE family attractions with instant digital QR passes.",
      });
      return;
    }

    const prompt = `You are the lead UAE Family Experience Curator for Spotera Deals (SpoteraDeals.com).
Generate a concise, inspiring "Daily Family Deal Spotlight" for today.
User preferences:
- Preferred Category: ${categoryPreference || "Any family activity"}
- Preferred City: ${cityPreference || "All 7 Emirates"}
- Language: ${language}

Available Current Deals:
${dealsSummary}

Respond ONLY with valid JSON in this exact structure:
{
  "title": "Short catchy spotlight title (e.g. Weekend Splash & Soft Play Highlights)",
  "tagline": "One captivating sentence about why today is great for family outings",
  "familyTip": "A genuine, practical tip for UAE parents (e.g. best hours to visit, what to pack, or how to maximize savings)",
  "featuredCategory": "${categoryPreference || "Kids Play Areas"}",
  "suggestedCity": "${cityPreference || "Dubai"}",
  "savingsHighlight": "Short summary of savings for parents"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const text = response.text || "{}";
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = {
        title: "Today's Top Family Picks",
        tagline: "Explore hand-verified play areas and attractions across the UAE.",
        familyTip: "Book online via Spotera Deals to get instant digital QR codes and skip ticketing queues.",
        featuredCategory: categoryPreference || "Kids Play Areas",
        suggestedCity: cityPreference || "Dubai",
        savingsHighlight: "Save up to 40% with exclusive digital passes.",
      };
    }
    res.json(data);
  } catch (error: any) {
    console.error("Error in AI Daily Spotlight:", error);
    res.json({
      title: "Today's UAE Family Adventure Spotlight",
      tagline: "Hand-picked play areas & attractions for maximum family savings today",
      familyTip: "Pair soft play arena visits with family dining vouchers on Spotera Deals to save up to 40% overall!",
      featuredCategory: "Kids Play Areas",
      suggestedCity: "Dubai",
      savingsHighlight: "Instant digital QR passes redeemable directly at partner venues across the UAE.",
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Spotera Deals server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
