import { auth } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export const GET = async (req: NextRequest) => {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const date = req.nextUrl.searchParams.get("date")

  // Single day lookup
  if (date) {
    const log = await db.dailyLog.findUnique({
      where: { userId_date: { userId, date: new Date(date) } },
    })
    return NextResponse.json(log ?? null)
  }

  // All logs (existing behaviour)
  const logs = await db.dailyLog.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  })
  const seen = new Set<string>()
  const deduplicated = logs.filter((log: (typeof logs)[number]) => {
    const day = log.date.toISOString().split("T")[0]
    if (seen.has(day)) return false
    seen.add(day)
    return true
  })
  return NextResponse.json(deduplicated.map((log) => ({
    ...log,
    date: log.date.toISOString().split("T")[0],
  })))
}

export const POST = async (req: NextRequest) => {
  const { userId } = await auth()
  if (!userId) return new NextResponse("Unauthorized", { status: 401 })

  const body = await req.json()
  const { caloriesEaten, tdeeForDay, date } = body
  const netDeficit = tdeeForDay - caloriesEaten
  const logDate = date ? new Date(date) : new Date()

  const log = await db.dailyLog.upsert({
    where: {
      userId_date: { userId, date: logDate },
    },
    update: { caloriesEaten, tdeeForDay, netDeficit },
    create: { userId, date: logDate, caloriesEaten, tdeeForDay, netDeficit },
  })

  return NextResponse.json(log)
}