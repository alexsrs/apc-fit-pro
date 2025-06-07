import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const amqpUrl = process.env.CLOUDAMQP_URL;
  if (!amqpUrl)
    return NextResponse.json({
      alertas: [],
      debug: "CLOUDAMQP_URL não definida",
    });

  // Pega userId da query string
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const debug: Record<string, unknown> = {};
  try {
    const url = new URL(amqpUrl);
    const user = url.username;
    const pass = url.password;
    const host = url.hostname;
    const vhost = encodeURIComponent(url.pathname.replace(/^\//, ""));
    const queue = "alertas_inteligentes";
    const apiUrl = `https://${host}/api/queues/${vhost}/${queue}/get`;
    debug.apiUrl = apiUrl;
    debug.vhost = vhost;
    debug.user = user;
    debug.queue = queue;
    debug.userId = userId;

    const body = {
      count: 50, // busca até 50 mensagens
      ackmode: "ack_requeue_false", // agora remove da fila ao consumir
      encoding: "auto",
    };
    debug.requestBody = body;

    const basicAuth = Buffer.from(`${user}:${pass}`).toString("base64");
    debug.basicAuth = basicAuth;

    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify(body),
    });

    debug.status = res.status;
    debug.statusText = res.statusText;
    debug.headers = Object.fromEntries(res.headers.entries());

    let data: unknown[] = [];
    let raw = "";
    try {
      raw = await res.text();
      debug.rawResponse = raw;
      data = JSON.parse(raw);
    } catch (err) {
      debug.parseError = err instanceof Error ? err.message : String(err);
      data = [];
    }
    if (!Array.isArray(data)) data = [];

    // Filtra mensagens para o userId, se informado
    let alertas = (data as { payload: string }[])
      .map((msg) => msg.payload)
      .filter((texto: string) => {
        if (!userId) return true;
        // Espera que a mensagem contenha o userId, ex: "[user:123] Mensagem"
        return texto.includes(`[user:${userId}]`);
      });

    // Remove o prefixo [user:ID] se existir
    alertas = alertas.map((texto: string) =>
      texto.replace(/^\[user:[^\]]+\]\s*/, "")
    );

    return NextResponse.json({ alertas, debug });
  } catch (e: unknown) {
    debug.error = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ alertas: [], debug });
  }
}
