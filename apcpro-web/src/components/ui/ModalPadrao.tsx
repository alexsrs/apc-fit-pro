import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type ModalPadraoProps = {
  open: boolean;
  onClose: () => void;
  title: string | React.ReactNode;
  description?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  showScrollArea?: boolean;
};

const maxWidthMap = {
  sm: "max-w-[500px]",
  md: "max-w-[600px]", 
  lg: "max-w-[700px]",
  xl: "max-w-[800px]",
  "2xl": "max-w-[900px]",
};

export function ModalPadrao({
  open,
  onClose,
  title,
  description,
  children,
  maxWidth = "lg",
  className,
  showScrollArea = true,
}: ModalPadraoProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          maxWidthMap[maxWidth],
          "w-full p-0",
          className
        )}
        style={{ width: "100%", maxWidth: maxWidthMap[maxWidth].replace("max-w-[", "").replace("]", "") }}
      >
        <div className="relative flex flex-col">
          {showScrollArea ? (
            <ScrollArea className="px-8 pb-2" style={{ maxHeight: "85vh" }}>
              <DialogHeader className="pt-6 mb-6">
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {title}
                </DialogTitle>
                {description && (
                  <DialogDescription className="text-base text-gray-600 mt-2">
                    {description}
                  </DialogDescription>
                )}
              </DialogHeader>
              
              <div className="space-y-6">
                {children}
              </div>
            </ScrollArea>
          ) : (
            <>
              <DialogHeader className="pt-6 mb-6 px-8">
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {title}
                </DialogTitle>
                {description && (
                  <DialogDescription className="text-base text-gray-600 mt-2">
                    {description}
                  </DialogDescription>
                )}
              </DialogHeader>
              
              <div className="px-8 pb-6 space-y-6">
                {children}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
