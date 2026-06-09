import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const goal = await db.goal.findUnique({ where: { userId } })
  
  if (!goal) return NextResponse.json(null)
  
  return NextResponse.json(goal)
}

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const body = await req.json()
  const { targetWeightKg, startWeightKg, baselineTdee } = body

  const goal = await db.goal.upsert({
    where: { userId },
    update: { targetWeightKg, startWeightKg, baselineTdee },
    create: { userId, targetWeightKg, startWeightKg, baselineTdee },
  })

  return NextResponse.json(goal)
}