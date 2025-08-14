import { 
  Role, 
  Permission, 
  hasPermission, 
  hasAnyPermission, 
  hasAllPermissions,
  canAccessResource 
} from "@/lib/rbac"

describe("RBAC System", () => {
  describe("hasPermission", () => {
    it("should allow user to read own profile", () => {
      expect(hasPermission(Role.USER, Permission.READ_OWN_PROFILE)).toBe(true)
    })

    it("should not allow user to read all users", () => {
      expect(hasPermission(Role.USER, Permission.READ_ALL_USERS)).toBe(false)
    })

    it("should allow admin to read all users", () => {
      expect(hasPermission(Role.ADMIN, Permission.READ_ALL_USERS)).toBe(true)
    })

    it("should allow support to read user profiles", () => {
      expect(hasPermission(Role.SUPPORT, Permission.READ_USER_PROFILES)).toBe(true)
    })

    it("should not allow support to delete users", () => {
      expect(hasPermission(Role.SUPPORT, Permission.DELETE_USERS)).toBe(false)
    })
  })

  describe("hasAnyPermission", () => {
    it("should return true if user has any of the permissions", () => {
      const permissions = [Permission.READ_ALL_USERS, Permission.READ_OWN_PROFILE]
      expect(hasAnyPermission(Role.USER, permissions)).toBe(true)
    })

    it("should return false if user has none of the permissions", () => {
      const permissions = [Permission.READ_ALL_USERS, Permission.DELETE_USERS]
      expect(hasAnyPermission(Role.USER, permissions)).toBe(false)
    })
  })

  describe("hasAllPermissions", () => {
    it("should return true if user has all permissions", () => {
      const permissions = [Permission.READ_OWN_PROFILE, Permission.UPDATE_OWN_PROFILE]
      expect(hasAllPermissions(Role.USER, permissions)).toBe(true)
    })

    it("should return false if user is missing any permission", () => {
      const permissions = [Permission.READ_OWN_PROFILE, Permission.READ_ALL_USERS]
      expect(hasAllPermissions(Role.USER, permissions)).toBe(false)
    })
  })

  describe("canAccessResource", () => {
    const userId = "user123"
    const otherUserId = "user456"

    it("should allow user to access their own profile", () => {
      expect(canAccessResource(
        Role.USER, 
        userId, 
        userId, 
        Permission.READ_OWN_PROFILE
      )).toBe(true)
    })

    it("should not allow user to access other user's profile", () => {
      expect(canAccessResource(
        Role.USER, 
        userId, 
        otherUserId, 
        Permission.READ_OWN_PROFILE
      )).toBe(false)
    })

    it("should allow support to access other user's profile", () => {
      expect(canAccessResource(
        Role.SUPPORT, 
        userId, 
        otherUserId, 
        Permission.READ_OWN_PROFILE
      )).toBe(true)
    })

    it("should allow admin to access any user's profile", () => {
      expect(canAccessResource(
        Role.ADMIN, 
        userId, 
        otherUserId, 
        Permission.READ_OWN_PROFILE
      )).toBe(true)
    })
  })

  describe("Role hierarchy", () => {
    it("should give admin all permissions", () => {
      const allPermissions = Object.values(Permission)
      allPermissions.forEach(permission => {
        expect(hasPermission(Role.ADMIN, permission)).toBe(true)
      })
    })

    it("should give support more permissions than user", () => {
      expect(hasPermission(Role.SUPPORT, Permission.READ_USER_PROFILES)).toBe(true)
      expect(hasPermission(Role.USER, Permission.READ_USER_PROFILES)).toBe(false)
    })

    it("should not give support admin-only permissions", () => {
      expect(hasPermission(Role.SUPPORT, Permission.DELETE_USERS)).toBe(false)
      expect(hasPermission(Role.SUPPORT, Permission.MANAGE_SYSTEM_SETTINGS)).toBe(false)
    })
  })
})