"use client";

import Link from "next/link";
import { PawPrint, User, Heart, DoorClosed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const getUserInitial = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <PawPrint className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <span className="ml-2 text-lg sm:text-xl font-bold text-primary">Adoptivus</span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4">
            <ThemeToggle />
            {user ? (
              <>
                <Link href="/pets/new" className="hidden sm:block">
                  <Button>Doar Pet</Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                      <AvatarFallback className="dark:text-white text-black">
                        {getUserInitial(user.email)}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <Link href="/pets/new" className="sm:hidden">
                      <DropdownMenuItem>
                        Doar Pet
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/my-pets">
                      <DropdownMenuItem>
                        <Heart className="mr-2 h-4 w-4" />
                        Meus Pets
                      </DropdownMenuItem>
                    </Link>
                    <Link href="/profile">
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        Perfil
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={handleSignOut} className="hover:bg-red-400">
                      <DoorClosed className="mr-2 h4 w-4" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link href="/login">
                <Button>Entrar</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}