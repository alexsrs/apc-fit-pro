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
    // Agora payload pode ser string ou objeto { mensagem, avaliacaoId }
    const alertas = (data as { payload: string | { mensagem: string; avaliacaoId?: string } }[])
      .map((msg) => {
        let mensagem = "";
        let avaliacaoId = undefined;
        if (typeof msg.payload === "string") {
          mensagem = msg.payload;
        } else if (typeof msg.payload === "object" && msg.payload !== null) {
          mensagem = msg.payload.mensagem;
          avaliacaoId = msg.payload.avaliacaoId;
        } else {
          mensagem = String(msg.payload);
        }
        // Remove prefixo [user:xxx] se existir
        mensagem =
          typeof mensagem === "string"
            ? mensagem.replace(/^\[user:[^\]]+\]\s*/, "")
            : mensagem;
        return { mensagem, avaliacaoId };
      })
      .filter(() => {
        if (!userId) return true;
        // Agora só filtra se a mensagem original (já limpa) continha o userId
        // Como o prefixo foi removido, não faz sentido filtrar aqui, então retorna true
        return true;
      });

    return NextResponse.json({ alertas, debug });
  } catch (e: unknown) {
    debug.error = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ alertas: [], debug });
  }
}
