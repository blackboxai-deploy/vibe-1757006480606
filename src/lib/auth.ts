import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { prisma } from "./database";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";
const JWT_EXPIRES_IN = "24h";

interface JWTPayload {
  userId: string;
  email: string;
  role?: string;
}

export async function generateJWT(userId: string, role?: string): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const payload: JWTPayload = {
    userId,
    email: user.email,
    ...(role && { role }),
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export async function verifyJWT(token: string): Promise<JWTPayload> {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

export async function getUserFromRequest(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return null;
    }

    const payload = await verifyJWT(token);
    
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        subscriptionTier: true,
        subscriptionStatus: true,
        usageLimits: true,
        currentUsage: true,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
}

export async function requireAuth(request: NextRequest) {
  const user = await getUserFromRequest(request);
  
  if (!user) {
    throw new Error("Authentication required");
  }
  
  return user;
}

export async function requireAdminAuth(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      throw new Error("Admin authentication required");
    }

    // Check if it's an admin API key
    const adminUser = await prisma.adminUser.findUnique({
      where: { apiKey: token },
    });

    if (adminUser) {
      // Update last login
      await prisma.adminUser.update({
        where: { id: adminUser.id },
        data: { lastLoginAt: new Date() },
      });

      return adminUser;
    }

    // Try JWT verification for admin session
    const payload = await verifyJWT(token);
    const admin = await prisma.adminUser.findUnique({
      where: { email: payload.email },
    });

    if (!admin) {
      throw new Error("Admin access required");
    }

    return admin;
  } catch (error) {
    throw new Error("Admin authentication failed");
  }
}

export function hashPassword(password: string): Promise<string> {
  const bcrypt = require("bcryptjs");
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  const bcrypt = require("bcryptjs");
  return bcrypt.compare(password, hash);
}