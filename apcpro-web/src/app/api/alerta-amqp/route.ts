import { NextResponse } from "next/server";
import { sendAlertaHelloWorld } from "@/services/amqp-service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const userId = body?.userId;
    await sendAlertaHelloWorld(userId);
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
