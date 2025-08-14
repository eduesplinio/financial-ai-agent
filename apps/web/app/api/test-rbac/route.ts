import { NextRequest, NextResponse } from "next/server"
import { withAuth, requirePermission } from "@/lib/auth-middleware"
import { Permission } from "@/lib/rbac"

// Test endpoint that requires READ_OWN_PROFILE permission
export async function GET(request: NextRequest) {
  return withAuth(
    request,
    requirePermission(Permission.READ_OWN_PROFILE),
    async (authorizedRequest) => {
      return NextResponse.json({
        message: "RBAC test successful!",
        user: authorizedRequest.user,
        permission: Permission.READ_OWN_PROFILE,
        timestamp: new Date().toISOString()
      })
    }
  )
}

// Test endpoint that requires admin role
export async function POST(request: NextRequest) {
  return withAuth(
    request,
    requirePermission(Permission.READ_ALL_USERS),
    async (authorizedRequest) => {
      return NextResponse.json({
        message: "Admin RBAC test successful!",
        user: authorizedRequest.user,
        permission: Permission.READ_ALL_USERS,
        timestamp: new Date().toISOString()
      })
    }
  )
}