import { Search, Plus, User, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AdminSidebarTrigger } from "./AdminSidebar";
import { useAuth } from "@/contexts/AuthContext";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  onMenuClick: () => void;
}

export function AdminHeader({
  title,
  subtitle,
  searchPlaceholder,
  searchValue,
  onSearchChange,
  primaryAction,
  onMenuClick,
}: AdminHeaderProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  return (
    <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center justify-between gap-4 p-4 lg:p-6">
        {/* Left: Menu + Title */}
        <div className="flex items-center gap-3 min-w-0">
          <AdminSidebarTrigger onClick={onMenuClick} />
          <div className="min-w-0">
            <h1 className="text-xl lg:text-2xl font-semibold text-foreground truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right: Search + Actions */}
        <div className="flex items-center gap-3">
          {/* Search - Hidden on mobile, shown on tablet+ */}
          {onSearchChange && (
            <div className="hidden md:flex relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={searchPlaceholder || "Cerca..."}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-9 bg-secondary border-0"
              />
            </div>
          )}

          {/* Primary Action */}
          {primaryAction && (
            <Button onClick={primaryAction.onClick} className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{primaryAction.label}</span>
            </Button>
          )}

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-popover">
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate('/admin/profilo')}>
                <User className="h-4 w-4" />
                Profilo
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={() => navigate('/admin/impostazioni')}>
                <Settings className="h-4 w-4" />
                Impostazioni account
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2 text-destructive cursor-pointer" onClick={() => { logout(); navigate('/auth/login'); }}>
                <LogOut className="h-4 w-4" />
                Esci
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile Search */}
      {onSearchChange && (
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={searchPlaceholder || "Cerca..."}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9 bg-secondary border-0"
            />
          </div>
        </div>
      )}
    </header>
  );
}
