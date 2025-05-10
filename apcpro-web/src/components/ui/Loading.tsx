"use client";

import * as Progress from "@radix-ui/react-progress";
import { useState, useEffect } from "react";

export default function Loading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1)); // Incrementa o progresso
    }, 20); // Atualiza a cada 20ms para criar uma animação suave

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <Progress.Root
        className="relative h-4 w-64 overflow-hidden rounded-full bg-muted"
        value={progress}
      >
        <Progress.Indicator
          className="h-full bg-gray-700 transition-transform"
          style={{ transform: `translateX(-${100 - progress}%)` }}
        />
      </Progress.Root>
    </div>
  );
}
