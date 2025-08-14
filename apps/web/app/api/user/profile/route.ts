import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { MongoClient, ObjectId } from "mongodb"
import { z } from "zod"

const client = new MongoClient(process.env.MONGODB_URI!)

const updateProfileSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
})

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Não autorizado" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, email } = updateProfileSchema.parse(body)

    await client.connect()
    const db = client.db()
    const users = db.collection("users")

    // Check if email is already taken by another user
    if (email !== session.user.email) {
      const existingUser = await users.findOne({ 
        email,
        _id: { $ne: new ObjectId(session.user.id) }
      })
      
      if (existingUser) {
        return NextResponse.json(
          { message: "Este email já está sendo usado por outro usuário" },
          { status: 400 }
        )
      }
    }

    // Update user
    const result = await users.updateOne(
      { _id: new ObjectId(session.user.id) },
      {
        $set: {
          name,
          email,
          updatedAt: new Date(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: "Perfil atualizado com sucesso" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Profile update error:", error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Dados inválidos", errors: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}

export async function GET() {
  try {
    const session = await auth()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Não autorizado" },
        { status: 401 }
      )
    }

    await client.connect()
    const db = client.db()
    const users = db.collection("users")

    const user = await users.findOne(
      { _id: new ObjectId(session.user.id) },
      { projection: { password: 0 } } // Exclude password from response
    )

    if (!user) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 404 }
      )
    }

    return NextResponse.json(user, { status: 200 })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json(
      { message: "Erro interno do servidor" },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
}