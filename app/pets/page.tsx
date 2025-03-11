"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { states } from "@/lib/states";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Pet = {
  id: string;
  name: string;
  breed?: string;
  description: string;
  city: string;
  state: string;
  created_at: string;
  species: "dog" | "cat" | "bird" | "other";
  status: "available" | "adopted";
  contact_whatsapp: string;
  is_litter: boolean;
  litter_size?: number;
  males_count?: number;
  females_count?: number;
  birth_date?: string;
};

type PetPhoto = {
  id: string;
  pet_id: string;
  url: string;
  order: number;
};

type PetWithPhotos = Pet & {
  photos: PetPhoto[];
  currentPhotoIndex: number;
};

export default function PetsPage() {
  const [pets, setPets] = useState<PetWithPhotos[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string | undefined>();
  const [cityFilter, setCityFilter] = useState<string | undefined>();
  const [cities, setCities] = useState<string[]>([]);
  const [selectedPet, setSelectedPet] = useState<PetWithPhotos | null>(null);

  useEffect(() => {
    async function fetchCities() {
      if (!selectedState || selectedState === "all") {
        setCities([]);
        return;
      }

      const { data, error } = await supabase
        .from('pets')
        .select('city')
        .eq('state', selectedState)
        .eq('status', 'available')
        .is('deleted_at', null)
        .not('city', 'is', null);

      if (!error && data) {
        const uniqueCities = Array.from(new Set(data.map(pet => pet.city))).sort();
        setCities(uniqueCities);
      }
    }

    fetchCities();
    setCityFilter(undefined);
  }, [selectedState]);

  useEffect(() => {
    async function fetchPets() {
      try {
        let query = supabase
          .from('pets')
          .select('*')
          .eq('status', 'available')
          .is('deleted_at', null)
          .order('created_at', { ascending: false });

        if (selectedState && selectedState !== "all") {
          query = query.eq('state', selectedState);
        }

        if (cityFilter && cityFilter !== "all") {
          query = query.eq('city', cityFilter);
        }

        const { data: petsData, error: petsError } = await query;

        if (petsError) throw petsError;

        // Fetch photos for all pets
        const petsWithPhotos = await Promise.all((petsData || []).map(async (pet) => {
          const { data: photos, error: photosError } = await supabase
            .from('pet_photos')
            .select('*')
            .eq('pet_id', pet.id)
            .order('order');

          if (photosError) throw photosError;

          return {
            ...pet,
            photos: photos || [],
            currentPhotoIndex: 0,
          };
        }));

        setPets(petsWithPhotos);
      } catch (error) {
        console.error('Error fetching pets:', error);
        setPets([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPets();
  }, [selectedState, cityFilter]);

  const handleStateChange = (value: string) => {
    setSelectedState(value === "all" ? undefined : value);
  };

  const handleCityChange = (value: string) => {
    setCityFilter(value === "all" ? undefined : value);
  };

  const nextPhoto = (petId: string) => {
    setPets(prev => prev.map(p => {
      if (p.id === petId) {
        const newIndex = p.currentPhotoIndex === p.photos.length - 1 ? 0 : p.currentPhotoIndex + 1;
        return { ...p, currentPhotoIndex: newIndex };
      }
      return p;
    }));

    if (selectedPet?.id === petId) {
      setSelectedPet(prev => {
        if (!prev) return null;
        const newIndex = prev.currentPhotoIndex === prev.photos.length - 1 ? 0 : prev.currentPhotoIndex + 1;
        return { ...prev, currentPhotoIndex: newIndex };
      });
    }
  };

  const previousPhoto = (petId: string) => {
    setPets(prev => prev.map(p => {
      if (p.id === petId) {
        const newIndex = p.currentPhotoIndex === 0 ? p.photos.length - 1 : p.currentPhotoIndex - 1;
        return { ...p, currentPhotoIndex: newIndex };
      }
      return p;
    }));

    if (selectedPet?.id === petId) {
      setSelectedPet(prev => {
        if (!prev) return null;
        const newIndex = prev.currentPhotoIndex === 0 ? prev.photos.length - 1 : prev.currentPhotoIndex - 1;
        return { ...prev, currentPhotoIndex: newIndex };
      });
    }
  };

  const handlePhotoClick = (petId: string, index: number) => {
    setPets(prev => prev.map(p => {
      if (p.id === petId) {
        return { ...p, currentPhotoIndex: index };
      }
      return p;
    }));

    if (selectedPet?.id === petId) {
      setSelectedPet(prev => {
        if (!prev) return null;
        return { ...prev, currentPhotoIndex: index };
      });
    }
  };

  const speciesMap = {
    dog: "Cachorro",
    cat: "Gato",
    bird: "Pássaro",
    other: "Outro",
  };

  const formatDate = (date: string) => {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
      locale: ptBR,
    });
  };

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold">Pets Disponíveis para Adoção</h1>
            <Link href="/pets/new">
              <Button>Doar um Pet</Button>
            </Link>
          </div>
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">Pets Disponíveis para Adoção</h1>
          <Link href="/pets/new">
            <Button>Doar um Pet</Button>
          </Link>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="w-full sm:w-48">
            <Select
              value={selectedState || "all"}
              onValueChange={handleStateChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state.uf} value={state.uf}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedState && selectedState !== "all" && cities.length > 0 && (
            <div className="w-full sm:w-48">
              <Select
                value={cityFilter || "all"}
                onValueChange={handleCityChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por cidade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as cidades</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {pets.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border">
            <p className="text-lg text-muted-foreground mb-4">
              Nenhum pet disponível para adoção no momento.
            </p>
            <p className="mt-2 text-muted-foreground">Seja o primeiro a doar um pet!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {pets.map((pet) => (
              <Card key={pet.id} className="flex flex-col h-full">
                {pet.photos.length > 0 && (
                  <div className="aspect-square relative">
                    <img
                      src={pet.photos[pet.currentPhotoIndex].url}
                      alt={pet.name}
                      className="object-cover w-full h-full rounded-t-lg"
                    />
                    {pet.photos.length > 1 && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                          onClick={(e) => {
                            e.stopPropagation();
                            previousPhoto(pet.id);
                          }}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                          onClick={(e) => {
                            e.stopPropagation();
                            nextPhoto(pet.id);
                          }}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                          {pet.photos.map((_, index) => (
                            <button
                              key={index}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === pet.currentPhotoIndex
                                  ? "bg-primary"
                                  : "bg-primary/30"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePhotoClick(pet.id, index);
                              }}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
                <CardContent className="p-4 flex-grow">
                  <h2 className="text-xl font-semibold mb-2">{pet.name}</h2>
                  {pet.breed && <p className="text-muted-foreground mb-2">{pet.breed}</p>}
                  <p className="text-sm text-muted-foreground line-clamp-3">{pet.description}</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {pet.city}, {pet.state}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button 
                    className="w-full"
                    onClick={() => setSelectedPet(pet)}
                  >
                    Ver Detalhes
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={!!selectedPet} onOpenChange={() => setSelectedPet(null)}>
          <DialogContent className="max-w-3xl">
            {selectedPet && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedPet.name}</DialogTitle>
                </DialogHeader>
                <div className="grid md:grid-cols-2 gap-6">
                  {selectedPet.photos.length > 0 && (
                    <div className="aspect-square relative">
                      <img
                        src={selectedPet.photos[selectedPet.currentPhotoIndex].url}
                        alt={selectedPet.name}
                        className="object-cover w-full h-full rounded-lg"
                      />
                      {selectedPet.photos.length > 1 && (
                        <>
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                            onClick={() => previousPhoto(selectedPet.id)}
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                            onClick={() => nextPhoto(selectedPet.id)}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                            {selectedPet.photos.map((_, index) => (
                              <button
                                key={index}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                  index === selectedPet.currentPhotoIndex
                                    ? "bg-primary"
                                    : "bg-primary/30"
                                }`}
                                onClick={() => handlePhotoClick(selectedPet.id, index)}
                              />
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  <div>
                    <div className="mb-6">
                      <p className="text-lg text-muted-foreground mb-2">
                        {speciesMap[selectedPet.species]}
                        {selectedPet.breed && ` • ${selectedPet.breed}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Publicado {formatDate(selectedPet.created_at)}
                      </p>
                    </div>

                    {selectedPet.is_litter && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Informações da Ninhada</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-muted p-3 rounded">
                            <p className="text-sm text-muted-foreground">Total de filhotes</p>
                            <p className="text-lg font-medium">{selectedPet.litter_size}</p>
                          </div>
                          <div className="bg-muted p-3 rounded">
                            <p className="text-sm text-muted-foreground">Disponíveis</p>
                            <p className="text-lg font-medium">
                              {selectedPet.males_count} machos, {selectedPet.females_count} fêmeas
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">Sobre</h3>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {selectedPet.description}
                      </p>
                    </div>

                    {selectedPet.birth_date && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold mb-3">Data de Nascimento</h3>
                        <p className="text-muted-foreground">
                          {new Date(selectedPet.birth_date).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    )}

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3">Localização</h3>
                      <p className="text-muted-foreground">
                        {selectedPet.city}, {selectedPet.state}
                      </p>
                    </div>

                    <a 
                      href={`https://wa.me/55${selectedPet.contact_whatsapp}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Button className="w-full" size="lg">
                        Entrar em Contato
                      </Button>
                    </a>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}