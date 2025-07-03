import { useEffect, useRef, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";

export type NovaAvaliacaoMessage = {
  type: "nova_avaliacao";
  alunoId: string;
  professorId: string;
  avaliacaoId: string;
  mensagem: string;
};

/**
 * Hook para consumir alertas de avaliações em tempo real via RabbitMQ (STOMP/WebSocket).
 * Filtra mensagens pelo professorId do usuário logado.
 *
 * @param professorId ID do professor logado
 * @returns Lista de mensagens recebidas
 */
export function useAvaliacaoAlerts(professorId: string) {
  const [alertas, setAlertas] = useState<NovaAvaliacaoMessage[]>([]);
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!professorId) return;

    // Substitua pelos dados reais do seu CloudAMQP
    const RABBITMQ_WS_URL =
      process.env.NEXT_PUBLIC_RABBITMQ_WS_URL ||
      "wss://<host>.cloudamqp.com/ws";
    const RABBITMQ_USER = process.env.NEXT_PUBLIC_RABBITMQ_USER || "<user>";
    const RABBITMQ_PASS = process.env.NEXT_PUBLIC_RABBITMQ_PASS || "<pass>";
    const QUEUE = "/queue/avaliacoes.novas";

    const client = new Client({
      brokerURL: RABBITMQ_WS_URL,
      connectHeaders: {
        login: RABBITMQ_USER,
        passcode: RABBITMQ_PASS,
      },
      debug: () => {}, // Descomente para debug: console.log(str)
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
      client.subscribe(QUEUE, (message: IMessage) => {
        try {
          const data: NovaAvaliacaoMessage = JSON.parse(message.body);
          if (data.professorId === professorId) {
            setAlertas((prev) => [data, ...prev]);
          }
        } catch {
          // Ignora mensagens inválidas
        }
      });
    };

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [professorId]);

  return alertas;
}
