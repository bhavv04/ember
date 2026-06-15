import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export const GET = async (req: NextRequest) => {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const date = req.nextUrl.searchParams.get("date")

  if (date) {
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    const end = new Date(date)
    end.setHours(23, 59, 59, 999)

    const entry = await db.weighIn.findFirst({
      where: { userId, date: { gte: start, lte: end } },
    })
    return NextResponse.json(entry ?? null)
  }

  const weighIns = await db.weighIn.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  })
  return NextResponse.json(weighIns ?? [])
}

async function recalculateTdee(userId: string) {
  const recentWeighIns = await db.weighIn.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: 4,
  })
  if (recentWeighIns.length >= 2) {
    const goal = await db.goal.findUnique({ where: { userId } })
    if (goal) {
      const weeklyChange = recentWeighIns[0].weightKg - recentWeighIns[1].weightKg
      const dailyCalorieChange = Math.round((weeklyChange * 7700) / 7)
      const newTdee = goal.baselineTdee - dailyCalorieChange
      await db.goal.update({
        where: { userId },
        data: { baselineTdee: Math.max(1200, newTdee) },
      })
    }
  }
}

export const POST = async (req: NextRequest) => {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const { weightKg, date } = await req.json()

  const entryDate = date ? new Date(date) : new Date()
  entryDate.setHours(12, 0, 0, 0)

  // Check for existing entry on this date
  const start = new Date(entryDate)
  start.setHours(0, 0, 0, 0)
  const end = new Date(entryDate)
  end.setHours(23, 59, 59, 999)

  const existing = await db.weighIn.findFirst({
    where: { userId, date: { gte: start, lte: end } },
  })

  const weighIn = existing
    ? await db.weighIn.update({
        where: { id: existing.id },
        data: { weightKg },
      })
    : await db.weighIn.create({
        data: { userId, date: entryDate, weightKg },
      })

  await recalculateTdee(userId)
  return NextResponse.json(weighIn)
}

export const DELETE = async (req: NextRequest) => {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const id = req.nextUrl.searchParams.get("id")
  if (!id) return new NextResponse("Missing id", { status: 400 })

  await db.weighIn.delete({ where: { id, userId } })
  return NextResponse.json({ success: true })
}