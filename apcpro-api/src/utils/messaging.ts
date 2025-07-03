// src/utils/messaging.ts
import amqp from "amqplib";

/**
 * Payload padrão para mensagens de avaliação.
 */
export interface NovaAvaliacaoMessage {
  type: "nova_avaliacao";
  alunoId: string;
  professorId: string;
  avaliacaoId: string;
  mensagem: string;
}

/**
 * Publica uma mensagem na fila do RabbitMQ (CloudAMQP).
 * @param queue Nome da fila
 * @param message Objeto a ser enviado (serializado em JSON)
 */
export async function publishToQueue<T>(
  queue: string,
  message: T
): Promise<void> {
  const amqpUrl = process.env.CLOUDAMQP_URL;
  if (!amqpUrl)
    throw new Error("CLOUDAMQP_URL não definida nas variáveis de ambiente.");

  const conn = await amqp.connect(amqpUrl);
  const channel = await conn.createChannel();
  await channel.assertQueue(queue, { durable: true });
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });
  await channel.close();
  await conn.close();
}

// Exemplo de uso:
// await publishToQueue<NovaAvaliacaoMessage>("avaliacoes.novas", { ... });
