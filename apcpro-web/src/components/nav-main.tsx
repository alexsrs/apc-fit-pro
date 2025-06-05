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
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Menu</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) =>
          item.items && item.items.length > 0 ? (
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
                    <span className="group-[sidebar-wrapper-data-collapsible=icon]:sr-only">
                      {item.title}
                    </span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => {
                      const isEntrevista =
                        subItem.title === "Triagem inteligente";
                      const isAnamnese = subItem.title === "Anamnese";
                      const isMedidas = subItem.title === "Medidas corporais";
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          {isEntrevista ? (
                            <SidebarMenuSubButton
                              asChild={false}
                              onClick={(e) => {
                                e.preventDefault();
                                if (typeof window !== "undefined") {
                                  window.dispatchEvent(
                                    new CustomEvent("open-triagem-modal")
                                  );
                                }
                              }}
                            >
                              <span className="cursor-pointer w-full block px-2 py-1 group-[sidebar-wrapper-data-collapsible=icon]:sr-only">
                                {subItem.title}
                              </span>
                            </SidebarMenuSubButton>
                          ) : isAnamnese ? (
                            <SidebarMenuSubButton
                              asChild={false}
                              onClick={(e) => {
                                e.preventDefault();
                                if (typeof window !== "undefined") {
                                  window.dispatchEvent(
                                    new CustomEvent("open-anamnese-modal")
                                  );
                                }
                              }}
                            >
                              <span className="cursor-pointer w-full block px-2 py-1 group-[sidebar-wrapper-data-collapsible=icon]:sr-only">
                                {subItem.title}
                              </span>
                            </SidebarMenuSubButton>
                          ) : isMedidas ? (
                            <SidebarMenuSubButton
                              asChild={false}
                              onClick={(e) => {
                                e.preventDefault();
                                if (typeof window !== "undefined") {
                                  window.dispatchEvent(
                                    new CustomEvent("open-medidas-modal")
                                  );
                                }
                              }}
                            >
                              <span className="cursor-pointer w-full block px-2 py-1 group-[sidebar-wrapper-data-collapsible=icon]:sr-only">
                                {subItem.title}
                              </span>
                            </SidebarMenuSubButton>
                          ) : (
                            <SidebarMenuSubButton asChild={true}>
                              <a href={subItem.url}>
                                <span className="group-[sidebar-wrapper-data-collapsible=icon]:sr-only">
                                  {subItem.title}
                                </span>
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
          ) : (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild={true}>
                <a href={item.url}>
                  {item.icon && <item.icon />}
                  <span className="group-[sidebar-wrapper-data-collapsible=icon]:sr-only">
                    {item.title}
                  </span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
