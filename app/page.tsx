"use client";

import { Button } from "@/components/ui/button";
import { PawPrint, Heart, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";
import SupportSection from "@/components/support-section";
export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const handleDonate = () => {
    if (!user) {
      router.push("/login");
    } else {
      router.push("/pets/new");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-secondary-900">
              <span className="block mb-2 ">Encontre seu novo</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#FFD93D] to-[#FF6B6B] pb-5">melhor amigo</span>
            </h1>
            <p className="mt-10 max-w-md mx-auto text-base sm:text-lg md:mt-5 md:text-xl md:max-w-3xl text-gray-500">
              Conectamos pessoas que querem doar pets com aqueles que desejam adotar. 
              Uma plataforma simples e segura para encontrar seu novo companheiro.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8 space-y-4 sm:space-y-0 sm:space-x-4 px-4 sm:px-0">
              <Link href="/pets" className="block w-full sm:w-auto">
                <Button size="lg" className="w-full text-white dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-r from-[#FFD93D] to-[#FF6B6B] border border-white ">
                  Ver Pets Disponíveis
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto hover:bg-secondary hover:text-dark" 
                onClick={handleDonate}
              >
                Doar um Pet
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Como funciona</h2>
            <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-500 mx-auto">
              Processo simples e transparente para conectar doadores e adotantes
            </p>
          </div>

          <div className="mt-12 md:mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root h-full rounded-lg bg-gray-50 px-6 pb-8">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center rounded-md bg-primary p-3 shadow-lg">
                      <PawPrint className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">
                      Cadastre seu Pet
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Adicione fotos e informações sobre o pet que você deseja doar
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root h-full rounded-lg bg-gray-50 px-6 pb-8">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center rounded-md bg-primary p-3 shadow-lg">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">
                      Encontre um Match
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Interessados entrarão em contato diretamente com você
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root h-full rounded-lg bg-gray-50 px-6 pb-8">
                  <div className="-mt-6">
                    <div className="inline-flex items-center justify-center rounded-md bg-primary p-3 shadow-lg">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">
                      Faça a Conexão
                    </h3>
                    <p className="mt-5 text-base text-gray-500">
                      Converse pelo WhatsApp e combine os detalhes da adoção
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SupportSection />
    </div>
  );
}