import {
  LayoutDashboard,
  Store,
  Rocket,
  Truck,
  Eye,
  Settings,
  Route,
  Sparkles,
  LogOut,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import brandIcon from "@/assets/brand-icon.png";

const distributorNav = [
  { title: "Dashboard", url: "/app/dashboard", icon: LayoutDashboard },
  { title: "Onboarding", url: "/app/onboarding", icon: Rocket },
  { title: "Stores", url: "/app/stores", icon: Store },
  { title: "Integrations", url: "/app/suppliers", icon: Truck },
];

const opsNav = [
  { title: "AI Vision", url: "/app/ai-vision", icon: Eye },
  { title: "Order Routing", url: "/app/routing", icon: Route },
];

const platformNav = [
  { title: "Settings", url: "/app/settings", icon: Settings },
];

interface NavGroupProps {
  label: string;
  items: typeof distributorNav;
  collapsed: boolean;
}

function NavGroup({ label, items, collapsed }: NavGroupProps) {
  const location = useLocation();
  const hasActive = items.some((i) => location.pathname.startsWith(i.url));

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  className="hover:bg-sidebar-accent/50"
                  activeClassName="bg-sidebar-accent text-primary font-medium"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <img src={brandIcon} alt="Brand-Shop.AI" className="h-8 w-8" />
          {!collapsed && (
            <div className="flex items-center gap-1">
              <span className="font-bold text-foreground text-sm">Brand-Shop</span>
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-primary font-bold text-sm">AI</span>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavGroup label="Distributor" items={distributorNav} collapsed={collapsed} />
        <NavGroup label="Operations" items={opsNav} collapsed={collapsed} />
        <NavGroup label="Platform" items={platformNav} collapsed={collapsed} />
      </SidebarContent>
      <div className="mt-auto border-t border-border p-3">
        {!collapsed && profile?.email && (
          <p className="text-xs text-muted-foreground truncate mb-2 px-2">{profile.email}</p>
        )}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </Sidebar>
  );
}
