
import React from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UserMenu = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    await logout();
    toast({
      title: 'Logout realizado',
      description: 'Você foi desconectado com sucesso.'
    });
    navigate('/login');
  };

  if (!user) return null;

  const getInitials = () => {
    if (!user.username) return 'U';
    return user.username.charAt(0).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-11 w-11 rounded-full hover:scale-105 transition-all duration-300 group"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-main-primary to-main-primary-dark opacity-10 group-hover:opacity-20 transition-opacity" />
          <Avatar className="h-11 w-11 border-2 border-main-primary shadow-lg">
            <AvatarFallback className="bg-gradient-to-br from-main-primary to-main-primary-dark text-white text-base font-bold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-64 bg-white border border-border shadow-2xl rounded-xl p-2 animate-in fade-in slide-in-from-top-2 duration-200"
      >
        <DropdownMenuLabel className="font-normal p-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-main-primary to-main-primary-dark flex items-center justify-center shadow-md">
              <span className="text-white text-lg font-bold">{getInitials()}</span>
            </div>
            <div className="flex flex-col space-y-1">
              <p className="text-base font-semibold text-foreground">{user.username}</p>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3" />
                Usuário
              </p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem 
          onClick={handleLogout} 
          className="cursor-pointer rounded-lg p-3 text-destructive hover:bg-destructive/10 focus:bg-destructive/10 transition-colors duration-200 group"
        >
          <LogOut className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
          <span className="font-medium">Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
