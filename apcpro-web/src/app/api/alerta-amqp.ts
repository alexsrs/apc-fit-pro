import type { NextApiRequest, NextApiResponse } from "next";
import { sendAlertaHelloWorld } from "@/services/amqp-service";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }
  try {
    const { mensagem, userId } = req.body || {};
    await sendAlertaHelloWorld(userId, mensagem);
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
