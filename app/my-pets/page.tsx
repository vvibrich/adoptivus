"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Trash2, Heart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Pet = {
  id: string;
  name: string;
  breed?: string;
  description: string;
  image_url?: string;
  city: string;
  state: string;
  created_at: string;
  species: "dog" | "cat" | "bird" | "other";
  status: "available" | "adopted";
  adopted_at?: string;
};

export default function MyPetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  async function loadPets() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPets(data || []);
    } catch (error) {
      console.error("Error loading pets:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadPets();
  }, [router]);

  const handleDelete = async (petId: string) => {
    try {
      const { error } = await supabase
        .from("pets")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", petId);

      if (error) throw error;

      toast({
        title: "Pet removido com sucesso",
        description: "O pet foi removido da plataforma.",
      });

      loadPets();
    } catch (error) {
      toast({
        title: "Erro ao remover pet",
        description: "Ocorreu um erro ao remover o pet. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleAdopted = async (petId: string) => {
    try {
      const { error } = await supabase
        .from("pets")
        .update({
          status: "adopted",
          adopted_at: new Date().toISOString()
        })
        .eq("id", petId);

      if (error) throw error;

      toast({
        title: "Pet marcado como adotado",
        description: "Parabéns pela adoção!",
      });

      loadPets();
    } catch (error) {
      toast({
        title: "Erro ao atualizar status",
        description: "Ocorreu um erro ao marcar o pet como adotado. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const speciesMap = {
    dog: "Cachorro",
    cat: "Gato",
    bird: "Pássaro",
    other: "Outro",
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Meus Pets</h1>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Meus Pets</h1>
          <Link href="/pets/new">
            <Button>Cadastrar Novo Pet</Button>
          </Link>
        </div>

        {pets.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border">
            <p className="text-lg text-muted-foreground mb-4">
              Você ainda não cadastrou nenhum pet para doação
            </p>
            <Link href="/pets/new">
              <Button>Cadastrar Primeiro Pet</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <Card key={pet.id} className="flex flex-col h-full">
                {pet.image_url && (
                  <div className="aspect-square relative">
                    <img
                      src={pet.image_url}
                      alt={pet.name}
                      className="object-cover w-full h-full rounded-t-lg"
                    />
                    {pet.status === "adopted" && (
                      <Badge 
                        className="absolute top-2 right-2 bg-green-500"
                      >
                        Adotado
                      </Badge>
                    )}
                  </div>
                )}
                <CardContent className="p-4 flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-semibold">{pet.name}</h2>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="-mr-2">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {pet.status === "available" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Heart className="mr-2 h-4 w-4" />
                                Marcar como Adotado
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar adoção</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja marcar {pet.name} como adotado? 
                                  Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleAdopted(pet.id)}
                                >
                                  Confirmar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem 
                              onSelect={(e) => e.preventDefault()}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remover Pet
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remover pet</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja remover {pet.name} da plataforma? 
                                Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDelete(pet.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Remover
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <p className="text-muted-foreground mb-2">
                    {speciesMap[pet.species]}
                    {pet.breed && ` • ${pet.breed}`}
                  </p>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {pet.description}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {pet.city}, {pet.state}
                  </p>
                </CardContent>
                {/* <CardFooter className="p-4 pt-0">
                  <Link href={`/pets/${pet.id}`} className="w-full">
                    <Button variant="outline" className="w-full">
                      Ver Detalhes
                    </Button>
                  </Link>
                </CardFooter> */}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}