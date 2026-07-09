// app/api/goals/route.ts
// Existing GET and POST left unchanged below — only the new DELETE export is added.
// NOTE: I'm assuming DailyLog has a `userId` field directly (matching the pattern
// your Goal model uses). If DailyLog only relates via `goalId`, swap the logic
// in the transaction below to delete by goalId instead — flag this if so.

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

// NEW: deletes the user's goal and all associated logs.
// Explicitly deletes both in a transaction rather than relying on a DB
// cascade, since I can't confirm your Prisma schema has onDelete: Cascade
// configured between Goal/DailyLog and userId.
export const DELETE = async (_req: NextRequest) => {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  try {
    await db.$transaction([
      db.dailyLog.deleteMany({ where: { userId } }),
      db.goal.deleteMany({ where: { userId } }),
    ])
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Failed to delete user data:", err)
    return new NextResponse("Failed to delete data", { status: 500 })
  }
}