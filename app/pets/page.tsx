"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { states } from "@/lib/states";

type Pet = {
  id: string;
  name: string;
  breed?: string;
  description: string;
  image_url?: string;
  city: string;
  state: string;
  created_at: string;
  contact_whatsapp: string;
  is_litter: boolean;
  litter_size?: number;
  males_count?: number;
  females_count?: number;
};

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<string | undefined>();
  const [cityFilter, setCityFilter] = useState<string | undefined>();
  const [cities, setCities] = useState<string[]>([]);

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

        const { data, error } = await query;

        if (error) throw error;
        setPets(data || []);
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

  if (isLoading) {
    return (
      <div className="container py-8 px-4">
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
    );
  }

  return (
    <div className="container py-8 px-4">
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
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">Nenhum pet disponível para adoção no momento.</p>
          <p className="mt-2 text-gray-500">Seja o primeiro a doar um pet!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {pets.map((pet) => (
            <Card key={pet.id} className="flex flex-col h-full">
              {pet.image_url && (
                <div className="aspect-square relative">
                  <img
                    src={pet.image_url}
                    alt={pet.name}
                    className="object-cover w-full h-full rounded-t-lg"
                  />
                </div>
              )}
              <CardContent className="p-4 flex-grow">
                <h2 className="text-xl font-semibold mb-2">{pet.name}</h2>
                {pet.breed && <p className="text-gray-600 mb-2">{pet.breed}</p>}
                {pet.is_litter ? (
                <div className="mb-6">
                  <h2 className="text-md font-semibold mb-3 dark:text-white">Informações da Ninhada</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm dark:text-black font-medium">Total de filhotes</p>
                      <p className="text-xl font-medium text-sm text-gray-600">{pet.litter_size}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm dark:text-black font-medium">Disponíveis</p>
                      <p className="text-lg font-medium text-gray-600">
                        {pet.males_count} machos, {pet.females_count} fêmeas
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
                <p className="text-sm text-gray-500 line-clamp-3">{pet.description}</p>
                <p className="text-sm text-gray-500 mt-2">
                  {pet.city}, {pet.state}
                </p>
              </CardContent>
              <CardFooter className="flex justify-center p-4 pt-0">
                {/* <Link href={`/pets/${pet.id}`} className="w-full mr-2">
                  <Button className="w-full">Ver Detalhes</Button>
                </Link> */}
                <Link href={`https://wa.me/55${pet.contact_whatsapp}`} className="w-full m-2">
                  <Button className="w-full">Entrar em contato</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}