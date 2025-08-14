import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { Permission, hasPermission, canAccessResource } from "@/lib/rbac"

export interface AuthorizedRequest extends NextRequest {
  user: {
    id: string
    email: string
    name: string
    role: string
  }
}

// Middleware to check if user is authenticated
export async function requireAuth(request: NextRequest): Promise<NextResponse | AuthorizedRequest> {
  const session = await auth()
  
  if (!session?.user) {
    return NextResponse.json(
      { message: "Não autorizado" },
      { status: 401 }
    )
  }

  // Extend request with user info
  const authorizedRequest = request as AuthorizedRequest
  authorizedRequest.user = session.user
  
  return authorizedRequest
}

// Middleware to check specific permission
export function requirePermission(permission: Permission) {
  return async (request: NextRequest): Promise<NextResponse | AuthorizedRequest> => {
    const authResult = await requireAuth(request)
    
    if (authResult instanceof NextResponse) {
      return authResult // Return error response
    }

    const user = authResult.user
    
    if (!hasPermission(user.role, permission)) {
      return NextResponse.json(
        { message: "Acesso negado" },
        { status: 403 }
      )
    }

    return authResult
  }
}

// Middleware to check resource access
export function requireResourceAccess(permission: Permission, getResourceUserId: (request: NextRequest) => string) {
  return async (request: NextRequest): Promise<NextResponse | AuthorizedRequest> => {
    const authResult = await requireAuth(request)
    
    if (authResult instanceof NextResponse) {
      return authResult // Return error response
    }

    const user = authResult.user
    const resourceUserId = getResourceUserId(request)
    
    if (!canAccessResource(user.role, user.id, resourceUserId, permission)) {
      return NextResponse.json(
        { message: "Acesso negado a este recurso" },
        { status: 403 }
      )
    }

    return authResult
  }
}

// Middleware to check role
export function requireRole(role: string) {
  return async (request: NextRequest): Promise<NextResponse | AuthorizedRequest> => {
    const authResult = await requireAuth(request)
    
    if (authResult instanceof NextResponse) {
      return authResult // Return error response
    }

    const user = authResult.user
    
    if (user.role !== role) {
      return NextResponse.json(
        { message: `Acesso restrito a usuários com função: ${role}` },
        { status: 403 }
      )
    }

    return authResult
  }
}

// Middleware to check multiple roles
export function requireAnyRole(roles: string[]) {
  return async (request: NextRequest): Promise<NextResponse | AuthorizedRequest> => {
    const authResult = await requireAuth(request)
    
    if (authResult instanceof NextResponse) {
      return authResult // Return error response
    }

    const user = authResult.user
    
    if (!roles.includes(user.role)) {
      return NextResponse.json(
        { message: `Acesso restrito a usuários com uma das funções: ${roles.join(", ")}` },
        { status: 403 }
      )
    }

    return authResult
  }
}

// Helper function to apply middleware
export async function withAuth<T>(
  request: NextRequest,
  middleware: (request: NextRequest) => Promise<NextResponse | AuthorizedRequest>,
  handler: (request: AuthorizedRequest) => Promise<T>
): Promise<NextResponse | T> {
  const result = await middleware(request)
  
  if (result instanceof NextResponse) {
    return result // Return error response
  }

  return handler(result)
}