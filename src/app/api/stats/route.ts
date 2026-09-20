import { NextResponse } from "next/server";
import { getResponses } from "@/lib/store";

export async function GET() {
  // Simulate slight latency so skeletons are visible in demo
  await new Promise((r) => setTimeout(r, 700));
  const responses = await getResponses();
  return NextResponse.json({
    count: responses.length,
    latest: responses.slice(0, 3).map((r) => ({
      id: r.id,
      createdAt: r.createdAt,
    })),
  });
}
