import { NextRequest, NextResponse } from "next/server"
import { MongoClient } from "mongodb"
import { withAuth, requireRole } from "@/lib/auth-middleware"
import { Permission } from "@/lib/rbac"

const client = new MongoClient(process.env.MONGODB_URI!)

export async function GET(request: NextRequest) {
  return withAuth(
    request,
    requireRole("admin"),
    async (authorizedRequest) => {
      try {
        await client.connect()
        const db = client.db()
        const users = db.collection("users")

        // Get all users (excluding passwords)
        const allUsers = await users.find(
          {},
          { 
            projection: { 
              password: 0 
            } 
          }
        ).toArray()

        return NextResponse.json({
          users: allUsers,
          total: allUsers.length
        })
      } catch (error) {
        console.error("Error fetching users:", error)
        return NextResponse.json(
          { message: "Erro interno do servidor" },
          { status: 500 }
        )
      } finally {
        await client.close()
      }
    }
  )
}

export async function PUT(request: NextRequest) {
  return withAuth(
    request,
    requireRole("admin"),
    async (authorizedRequest) => {
      try {
        const body = await request.json()
        const { userId, updates } = body

        if (!userId || !updates) {
          return NextResponse.json(
            { message: "userId e updates são obrigatórios" },
            { status: 400 }
          )
        }

        await client.connect()
        const db = client.db()
        const users = db.collection("users")

        // Only allow updating specific fields
        const allowedUpdates = {
          name: updates.name,
          role: updates.role,
          updatedAt: new Date(),
        }

        // Remove undefined values
        Object.keys(allowedUpdates).forEach(key => {
          if (allowedUpdates[key as keyof typeof allowedUpdates] === undefined) {
            delete allowedUpdates[key as keyof typeof allowedUpdates]
          }
        })

        const result = await users.updateOne(
          { _id: userId },
          { $set: allowedUpdates }
        )

        if (result.matchedCount === 0) {
          return NextResponse.json(
            { message: "Usuário não encontrado" },
            { status: 404 }
          )
        }

        return NextResponse.json({
          message: "Usuário atualizado com sucesso",
          modifiedCount: result.modifiedCount
        })
      } catch (error) {
        console.error("Error updating user:", error)
        return NextResponse.json(
          { message: "Erro interno do servidor" },
          { status: 500 }
        )
      } finally {
        await client.close()
      }
    }
  )
}