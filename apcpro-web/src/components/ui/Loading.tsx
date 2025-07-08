"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  /**
   * Tamanho do spinner
   * @default "md"
   */
  size?: "sm" | "md" | "lg" | "xl";
  /**
   * Cor do spinner
   * @default "blue"
   */
  color?: "blue" | "gray" | "green" | "red" | "yellow" | "purple";
  /**
   * Modo de exibição
   * fullscreen: ocupa toda a tela
   * inline: exibido inline
   * @default "inline"
   */
  mode?: "fullscreen" | "inline";
  /**
   * Texto para exibir junto com o loading
   */
  text?: string;
  /**
   * Classes CSS adicionais
   */
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-4",
  xl: "h-16 w-16 border-4",
};

const colorClasses = {
  blue: "border-blue-600",
  gray: "border-gray-600",
  green: "border-green-600",
  red: "border-red-600",
  yellow: "border-yellow-600",
  purple: "border-purple-600",
};

export default function Loading({ 
  size = "md", 
  color = "blue", 
  mode = "inline", 
  text,
  className 
}: LoadingProps) {
  const spinner = (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div 
        className={cn(
          "animate-spin rounded-full border-b-2 border-transparent",
          sizeClasses[size],
          colorClasses[color]
        )}
      />
      {text && (
        <p className="text-sm text-muted-foreground animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (mode === "fullscreen") {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        {spinner}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-8">
      {spinner}
    </div>
  );
}

// Componentes auxiliares para casos específicos
export function LoadingInline({ size = "sm", color = "blue", className }: Omit<LoadingProps, "mode">) {
  return (
    <div className={cn("inline-flex items-center", className)}>
      <div 
        className={cn(
          "animate-spin rounded-full border-b-2 border-transparent",
          sizeClasses[size],
          colorClasses[color]
        )}
      />
    </div>
  );
}

export function LoadingButton({ text = "Carregando...", size = "sm" }: { text?: string; size?: "sm" | "md" }) {
  return (
    <div className="flex items-center gap-2">
      <div 
        className={cn(
          "animate-spin rounded-full border-b-2 border-transparent border-current",
          sizeClasses[size]
        )}
      />
      <span>{text}</span>
    </div>
  );
}

// Skeleton Loading para cards
export function LoadingSkeleton({ 
  lines = 3, 
  className,
  variant = "default",
  showAvatar = false,
  showImage = false
}: { 
  lines?: number; 
  className?: string;
  variant?: "default" | "card" | "list" | "table" | "profile";
  showAvatar?: boolean;
  showImage?: boolean;
}) {
  if (variant === "card") {
    return (
      <div className={cn("space-y-4 p-4", className)}>
        {showImage && (
          <div className="animate-pulse">
            <div className="h-48 bg-muted rounded-lg" />
          </div>
        )}
        <div className="space-y-3">
          <div className="animate-pulse">
            <div className="h-6 bg-muted rounded w-3/4" />
          </div>
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div 
                className="h-4 bg-muted rounded"
                style={{ width: `${Math.random() * 40 + 60}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className={cn("space-y-3", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="flex items-center space-x-3 animate-pulse">
            {showAvatar && (
              <div className="h-10 w-10 bg-muted rounded-full" />
            )}
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4" />
              <div className="h-3 bg-muted rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "table") {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 animate-pulse">
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "profile") {
    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center space-x-4 animate-pulse">
          <div className="h-16 w-16 bg-muted rounded-full" />
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: lines }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div 
                className="h-4 bg-muted rounded"
                style={{ width: `${Math.random() * 40 + 60}%` }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div 
            className="h-4 bg-muted rounded"
            style={{ width: `${Math.random() * 40 + 60}%` }}
          />
        </div>
      ))}
    </div>
  );
}
