import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check } from "lucide-react";
import domtoimage from "dom-to-image";

type ConviteAlunoModalProps = {
  open: boolean;
  onClose: () => void;
  professorId: string;
};

export function ConviteAlunoModal({
  open,
  onClose,
  professorId,
}: ConviteAlunoModalProps) {
  const conviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/convite?professorId=${professorId}`;
  const [copiado, setCopiado] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const mensagemWhatsapp = encodeURIComponent(
    `Ei! Já conhece o APC PRO?
É o app que eu uso pra montar treinos personalizados, com avaliação, planejamento e controle tudo num só lugar.
Com ele, seus treinos ficam mais seguros, eficientes e adaptados ao que você realmente precisa!

Clica aqui pra se cadastrar como meu aluno(a):
${conviteUrl}

Bora treinar do jeito certo?`
  );
  const whatsappUrl = `https://wa.me/?text=${mensagemWhatsapp}`;

  async function copiarQRCode() {
    if (!qrRef.current) return;
    try {
      const dataUrl = await domtoimage.toPng(qrRef.current);
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new window.ClipboardItem({ "image/png": blob }),
      ]);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      alert("Não foi possível copiar o QRCode.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convide um novo aluno</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div ref={qrRef}>
            <QRCodeSVG value={conviteUrl} size={180} />
          </div>
          <button
            type="button"
            onClick={copiarQRCode}
            className="flex flex-col items-center gap-1 text-gray-600 hover:text-blue-600 focus:outline-none"
            aria-label="Copiar QRCode para área de transferência"
          >
            {copiado ? (
              <Check className="w-6 h-6 text-green-600" aria-hidden="true" />
            ) : (
              <Copy className="w-6 h-6" aria-hidden="true" />
            )}
            <span className="text-xs">Copiar QRCode</span>
          </button>
          {/* 
          xibe a URL do convite para fácil cópia manual 
          <p className="text-sm break-all text-center">{conviteUrl}</p> 
          */}
          <Button asChild variant="outline" className="w-full">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              Enviar convite pelo WhatsApp
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
