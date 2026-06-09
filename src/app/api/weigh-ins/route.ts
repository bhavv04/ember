import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export const GET = async (_req: NextRequest) => {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const weighIns = await db.weighIn.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  })

  return NextResponse.json(weighIns ?? [])
}

export const POST = async (req: NextRequest) => {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const body = await req.json()
  const { weightKg } = body

  const weighIn = await db.weighIn.create({
    data: {
      userId,
      date: new Date(),
      weightKg,
    },
  })

  // Recalculate TDEE if we have at least 2 weigh-ins
  const recentWeighIns = await db.weighIn.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 4,
  })

  if (recentWeighIns.length >= 2) {
    const goal = await db.goal.findUnique({ where: { userId } })
    if (goal) {
      const latest = recentWeighIns[0].weightKg
      const previous = recentWeighIns[1].weightKg
      const weeklyChange = latest - previous
      const dailyCalorieChange = Math.round((weeklyChange * 7700) / 7)
      const newTdee = goal.baselineTdee - dailyCalorieChange

      await db.goal.update({
        where: { userId },
        data: { baselineTdee: Math.max(1200, newTdee) },
      })
    }
  }

  return NextResponse.json(weighIn)
}