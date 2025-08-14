import { NextRequest, NextResponse } from "next/server"
import { requireAuth, requireRole, requirePermission } from "@/lib/auth-middleware"
import { Permission } from "@/lib/rbac"

// Mock the auth function
jest.mock("@/lib/auth", () => ({
  auth: jest.fn(),
}))

const mockAuth = require("@/lib/auth").auth

describe("Auth Middleware", () => {
  let mockRequest: NextRequest

  beforeEach(() => {
    mockRequest = new NextRequest("http://localhost:3000/api/test")
    jest.clearAllMocks()
  })

  describe("requireAuth", () => {
    it("should return 401 if no session", async () => {
      mockAuth.mockResolvedValue(null)

      const result = await requireAuth(mockRequest)

      expect(result).toBeInstanceOf(NextResponse)
      expect((result as NextResponse).status).toBe(401)
    })

    it("should return authorized request if session exists", async () => {
      const mockSession = {
        user: {
          id: "user123",
          email: "test@example.com",
          name: "Test User",
          role: "user"
        }
      }
      mockAuth.mockResolvedValue(mockSession)

      const result = await requireAuth(mockRequest)

      expect(result).not.toBeInstanceOf(NextResponse)
      expect((result as any).user).toEqual(mockSession.user)
    })
  })

  describe("requireRole", () => {
    it("should return 403 if user doesn't have required role", async () => {
      const mockSession = {
        user: {
          id: "user123",
          email: "test@example.com",
          name: "Test User",
          role: "user"
        }
      }
      mockAuth.mockResolvedValue(mockSession)

      const middleware = requireRole("admin")
      const result = await middleware(mockRequest)

      expect(result).toBeInstanceOf(NextResponse)
      expect((result as NextResponse).status).toBe(403)
    })

    it("should return authorized request if user has required role", async () => {
      const mockSession = {
        user: {
          id: "admin123",
          email: "admin@example.com",
          name: "Admin User",
          role: "admin"
        }
      }
      mockAuth.mockResolvedValue(mockSession)

      const middleware = requireRole("admin")
      const result = await middleware(mockRequest)

      expect(result).not.toBeInstanceOf(NextResponse)
      expect((result as any).user).toEqual(mockSession.user)
    })
  })

  describe("requirePermission", () => {
    it("should return 403 if user doesn't have required permission", async () => {
      const mockSession = {
        user: {
          id: "user123",
          email: "test@example.com",
          name: "Test User",
          role: "user"
        }
      }
      mockAuth.mockResolvedValue(mockSession)

      const middleware = requirePermission(Permission.READ_ALL_USERS)
      const result = await middleware(mockRequest)

      expect(result).toBeInstanceOf(NextResponse)
      expect((result as NextResponse).status).toBe(403)
    })

    it("should return authorized request if user has required permission", async () => {
      const mockSession = {
        user: {
          id: "user123",
          email: "test@example.com",
          name: "Test User",
          role: "user"
        }
      }
      mockAuth.mockResolvedValue(mockSession)

      const middleware = requirePermission(Permission.READ_OWN_PROFILE)
      const result = await middleware(mockRequest)

      expect(result).not.toBeInstanceOf(NextResponse)
      expect((result as any).user).toEqual(mockSession.user)
    })
  })
})