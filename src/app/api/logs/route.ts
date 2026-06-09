import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export const GET = async (_req: NextRequest) => {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const logs = await db.dailyLog.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  })

  return NextResponse.json(logs ?? [])
}

export const POST = async (req: NextRequest) => {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const body = await req.json()
  const { caloriesEaten, tdeeForDay } = body
  const netDeficit = tdeeForDay - caloriesEaten

  const log = await db.dailyLog.create({
    data: {
      userId,
      date: new Date(),
      caloriesEaten,
      tdeeForDay,
      netDeficit,
    },
  })

  return NextResponse.json(log)
}