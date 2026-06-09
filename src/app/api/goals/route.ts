import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export const GET = async (_req: NextRequest) => {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const goal = await db.goal.findUnique({ where: { userId } })
  return NextResponse.json(goal ?? null)
}

export const POST = async (req: NextRequest) => {
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