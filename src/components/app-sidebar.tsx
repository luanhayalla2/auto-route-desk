import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, Ticket, PlusCircle, ListChecks, BarChart3, Settings, LogOut } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";
import senacLogo from "@/assets/senac-logo.png";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const items = [
  { title: "Portal", url: "/portal", icon: LayoutDashboard },
  { title: "Abrir chamado", url: "/chamados/novo", icon: PlusCircle },
  { title: "Meus chamados", url: "/chamados", icon: Ticket },
  { title: "Fila N1/N2/N3", url: "/fila", icon: ListChecks },
  { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
  { title: "Administração", url: "/admin", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 p-2">
          <img src={senacLogo} alt="SENAC" className="h-8 w-auto" />
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold text-[#003a70]">SmartDesk</span>
              <span className="text-[10px] text-[#f58220] font-semibold">SENAC-MA</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={pathname === item.url || pathname.startsWith(item.url + "/")}>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <Button
          variant="ghost"
          size="sm"
          className="justify-start gap-2"
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/auth", replace: true });
          }}
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Sair</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
