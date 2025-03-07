import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

type Pet = {
  id: string;
  name: string;
  species: "dog" | "cat" | "bird" | "other";
  breed?: string;
  description: string;
  image_url?: string;
  contact_whatsapp: string;
  created_at: string;
  is_litter: boolean;
  litter_size?: number;
  males_count?: number;
  females_count?: number;
  birth_date?: string;
};

export async function generateStaticParams() {
  const { data: pets } = await supabase
    .from("pets")
    .select("id")
    .order("created_at", { ascending: false });

  return (pets || []).map((pet) => ({
    id: pet.id,
  }));
}

async function getPet(id: string) {
  const { data, error } = await supabase
    .from("pets")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching pet:", error);
    return null;
  }

  return data as Pet;
}

export default async function PetPage({ params }: { params: { id: string } }) {
  const pet = await getPet(params.id);

  if (!pet) {
    return (
      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">Pet não encontrado</p>
            <Link href="/pets" className="text-primary hover:underline mt-4 inline-block">
              Voltar para lista
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const whatsappLink = `https://wa.me/55${pet.contact_whatsapp}`;
  const formattedDate = pet.created_at
    ? formatDistanceToNow(new Date(pet.created_at), {
        addSuffix: true,
        locale: ptBR,
      })
    : "";

  const speciesMap = {
    dog: "Cachorro",
    cat: "Gato",
    bird: "Pássaro",
    other: "Outro",
  };

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/pets" className="text-primary hover:underline">
            ← Voltar para lista
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2 gap-6">
            {pet.image_url && (
              <div className="aspect-square relative w-full h-full">
                <img
                  src={pet.image_url}
                  alt={pet.name}
                  className="object-cover w-full h-full"
                />
              </div>
            )}

            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2 dark:text-black ">{pet.name}</h1>
                <p className="text-lg text-gray-600 mb-2">
                  {speciesMap[pet.species]}
                  {pet.breed && ` • ${pet.breed}`}
                </p>
                <p className="text-sm text-gray-500">Publicado {formattedDate}</p>
              </div>

              {pet.is_litter ? (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3 dark:text-black">Informações da Ninhada</h2>
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

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3 dark:text-black">Sobre</h2>
                <p className="text-gray-600 whitespace-pre-wrap">{pet.description}</p>
              </div>

              {pet.birth_date && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-3 dark:text-black">Data de Nascimento</h2>
                  <p className="text-gray-600">
                    {new Date(pet.birth_date).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              )}

              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <Button className="w-full dark:bg-black dark:text-white" size="lg">
                  Entrar em Contato
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}