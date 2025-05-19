"use client";

import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full py-6 border-t bg-background">
      <div className="container mx-auto flex items-center justify-center">
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          Feito com <Heart className="h-4 w-4 text-red-500 fill-red-500" /> pela equipe Petiscoo
        </p>
      </div>
    </footer>
  );
}