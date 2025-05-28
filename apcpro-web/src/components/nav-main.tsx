"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useAnamneseModal } from "@/contexts/AnamneseModalContext";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const { openModal } = useAnamneseModal();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <Collapsible
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.items?.map((subItem) => {
                    const isEntrevista = subItem.title === "Entrevista inicial";
                    const isAnamnese = subItem.title === "Anamnese";
                    return (
                      <SidebarMenuSubItem key={subItem.title}>
                        {isEntrevista ? (
                          <SidebarMenuSubButton
                            asChild={false}
                            onClick={(e) => {
                              e.preventDefault();
                              // Abrir ModalTriagem
                              if (typeof window !== "undefined") {
                                const event = new CustomEvent(
                                  "open-triagem-modal"
                                );
                                window.dispatchEvent(event);
                              }
                            }}
                          >
                            <span className="cursor-pointer w-full block px-2 py-1">
                              {subItem.title}
                            </span>
                          </SidebarMenuSubButton>
                        ) : isAnamnese ? (
                          <SidebarMenuSubButton
                            asChild={false}
                            onClick={(e) => {
                              e.preventDefault();
                              // Abrir ModalAnamnese via evento customizado
                              if (typeof window !== "undefined") {
                                const event = new CustomEvent(
                                  "open-anamnese-modal"
                                );
                                window.dispatchEvent(event);
                              }
                            }}
                          >
                            <span className="cursor-pointer w-full block px-2 py-1">
                              {subItem.title}
                            </span>
                          </SidebarMenuSubButton>
                        ) : (
                          <SidebarMenuSubButton asChild={true}>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        )}
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
