import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

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

  type PetWithPhotos = Pet & {
    photos: PetPhoto[];
    currentPhotoIndex: number;
  };

  type PetPhoto = {
    id: string;
    pet_id: string;
    url: string;
    order: number;
  };

export function PetCard({...props}: PetWithPhotos){

    const [pets, setPets] = useState<PetWithPhotos[]>([]);
    const [selectedPet, setSelectedPet] = useState<PetWithPhotos | null>(null);

    const speciesMap = {
        dog: "Cachorro",
        cat: "Gato",
        bird: "Pássaro",
        other: "Outro",
      };

    const previousPhoto = (petId: string) => {
        setPets(prev => prev.map(p => {
          if (p.id === petId) {
            const newIndex = p.currentPhotoIndex === 0 ? p.photos.length - 1 : p.currentPhotoIndex - 1;
            return { ...p, currentPhotoIndex: newIndex };
          }
          return p;
        }));
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

      const formatDate = (date: string) => {
        return formatDistanceToNow(new Date(date), {
          addSuffix: true,
          locale: ptBR,
        });
      };

    return (
        <>
            <Card key={props.id} className="flex flex-col h-full">
                    {props.photos.length > 0 && (
                    <div className="aspect-square relative">
                        <img
                        src={props.photos[props.currentPhotoIndex].url}
                        alt={props.name}
                        className="object-cover w-full h-full rounded-t-lg"
                        />
                        {props.photos.length > 1 && (
                        <>
                            <Button
                            variant="outline"
                            size="icon"
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                            onClick={(e) => {
                                e.stopPropagation();
                                previousPhoto(props.id);
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
                                nextPhoto(props.id);
                            }}
                            >
                            <ChevronRight className="h-4 w-4" />
                            </Button>
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                            {props.photos.map((_, index) => (
                                <button
                                key={index}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                    index === props.currentPhotoIndex
                                    ? "bg-primary"
                                    : "bg-primary/30"
                                }`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handlePhotoClick(props.id, index);
                                }}
                                />
                            ))}
                            </div>
                        </>
                        )}
                    </div>
                    )}
                    <CardContent className="p-4 flex-grow">
                    <h2 className="text-xl font-semibold mb-2">{props.name}</h2>
                    {props.breed && <p className="text-muted-foreground mb-2">{props.breed}</p>}
                    <p className="text-sm text-muted-foreground line-clamp-3">{props.description}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                        {props.city}, {props.state}
                    </p>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                    <Button 
                        className="w-full"
                        onClick={() => setSelectedPet(props)}
                    >
                        Ver Detalhes
                    </Button>
                    </CardFooter>
            </Card>
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
        </>
    );
}