import amqp from "amqplib";

const amqpUrl = process.env.CLOUDAMQP_URL as string;

export async function sendAlertaHelloWorld(userId?: string) {
  if (!amqpUrl) throw new Error("CLOUDAMQP_URL não configurada");
  const queue = "alertas_inteligentes";
  const conn = await amqp.connect(amqpUrl);
  const channel = await conn.createChannel();
  await channel.assertQueue(queue, { durable: true });
  // Inclui o prefixo do usuário se fornecido
  const mensagem = userId
    ? `[user:${userId}] Não esqueça seua treinos hoje`
    : "Hello World";
  channel.sendToQueue(queue, Buffer.from(mensagem), {
    persistent: true,
  });
  await channel.close();
  await conn.close();
}
