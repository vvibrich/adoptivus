'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { supabase } from "@/lib/supabase";
import { Database } from "@/lib/database.types";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter } from "next/navigation";

type AdoptionRequest = Database['public']['Tables']['adoption_requests']['Row'] & {
  pet: {
    id: string;
    name: string;
    breed: string | null;
    description: string;
    city: string;
    state: string;
    created_at: string;
    species: "dog" | "cat" | "bird" | "other";
    status: "available" | "adopted";
    image_url: string | null;
  };
  requester_profile: {
    full_name: string;
    whatsapp: string;
  } | null;
  owner_profile: {
    full_name: string;
    whatsapp: string;
  } | null;
};

export default function AdoptionRequestsPage() {
  const [myRequests, setMyRequests] = useState<AdoptionRequest[]>([]);
  const [receivedRequests, setReceivedRequests] = useState<AdoptionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  // const supabase = createClientComponentClient<Database>();
  const { toast } = useToast();
  const router = useRouter();
  useEffect(() => {
    console.log('myRequests', myRequests);
  }, [myRequests]);

  useEffect(() => {
    fetchRequests();
  }, [router]);

  const fetchRequests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      console.log('user', user);
      if (!user) {
        toast({
          title: "Você precisa estar logado para ver suas solicitações.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Minhas solicitações (onde sou o requester)
      const { data: myRequestsData } = await supabase
        .from('adoption_requests')
        .select('*')
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false });

      if (!myRequestsData) {
        setMyRequests([]);
        setLoading(false);
        return;
      }

      const petIds = myRequestsData.map(r => r.pet_id);
      const { data: petsData } = await supabase
        .from('pets')
        .select('*')
        .in('id', petIds);

      const ownerIds = myRequestsData.map(r => r.owner_id);
      const { data: ownersProfiles } = await supabase
        .from('profiles')
        .select('id, full_name, whatsapp')
        .in('id', ownerIds);
      console.log('ownersProfiles', ownersProfiles);

      if (!petsData || !ownersProfiles) {
        setMyRequests([]);
        setLoading(false);
        return;
      }

      // Solicitações recebidas (onde sou o dono do pet)
      const { data: receivedRequestsData } = await supabase
        .from('adoption_requests')
        .select(`
          *,
          pet:pets(*),
          requester_profile:profiles(requester_id:id, name, whatsapp),
          owner_profile:profiles(owner_id:id, name, whatsapp)
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      const myRequestsWithDetails = myRequestsData.map(request => ({
        ...request,
        pet: petsData.find(pet => pet.id === request.pet_id),
        owner_profile: ownersProfiles.find(profile => profile.id === request.owner_id)
      }));
      setMyRequests(myRequestsWithDetails);
      setReceivedRequests(receivedRequestsData || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as solicitações.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestStatus = async (requestId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('adoption_requests')
        .update({ status: newStatus })
        .eq('id', requestId);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Solicitação ${newStatus === 'accepted' ? 'aceita' : 'rejeitada'} com sucesso.`,
      });

      fetchRequests();
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a solicitação.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "outline",
      accepted: "default",
      rejected: "destructive",
    } as const;

    const labels = {
      pending: "Pendente",
      accepted: "Aceita",
      rejected: "Rejeitada",
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const RequestCard = ({ request, isReceived }: { request: AdoptionRequest; isReceived: boolean }) => (
    <Card className="mb-6 flex flex-col md:flex-row overflow-hidden">
      {/* Imagem do pet */}
      {request.pet?.image_url && (
        <div className="md:w-48 w-full h-48 md:h-auto flex-shrink-0 bg-muted flex items-center justify-center">
          <img
            src={request.pet.image_url}
            alt={request.pet.name}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{request.pet?.name}</CardTitle>
            {getStatusBadge(request.status)}
          </div>
          <CardDescription className="mb-2">
            {request.pet?.city}, {request.pet?.state}
          </CardDescription>
          <p className="text-sm text-muted-foreground mb-2">
            Data da solicitação: {format(new Date(request.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </p>
          <p className="text-sm">
            {isReceived
              ? <>Solicitado por: <span className="font-medium">{request.requester_profile?.full_name || 'Não informado'}</span></>
              : <>Anunciado por: <span className="font-medium">{request.owner_profile?.full_name || 'Não informado'}</span></>
            }
          </p>
          {request.status === 'accepted' && (
            <div className="mt-3 p-3 bg-muted rounded-lg">
              <p className="font-medium mb-1">WhatsApp do anunciante:</p>
              <a
                href={`https://wa.me/55${request.owner_profile?.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                {request.owner_profile?.whatsapp}
              </a>
            </div>
          )}
        </div>
        {isReceived && request.status === 'pending' && (
          <div className="flex gap-2 mt-4">
            <Button
              variant="default"
              onClick={() => handleRequestStatus(request.id, 'accepted')}
            >
              Aceitar
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleRequestStatus(request.id, 'rejected')}
            >
              Recusar
            </Button>
          </div>
        )}
      </div>
    </Card>
  );

  if (loading) {
    return <div className="container py-8 px-4 sm:px-8 lg:px-16">Carregando...</div>;
  }

  return (
    <div className="container py-8 px-4 sm:px-8 lg:px-16">
      <h1 className="text-3xl font-bold mb-8">Solicitações de Adoção</h1>
      
      <Tabs defaultValue="my-requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="my-requests">Minhas Solicitações</TabsTrigger>
          <TabsTrigger value="received-requests">Solicitações Recebidas</TabsTrigger>
        </TabsList>

        <TabsContent value="my-requests" className="space-y-4">
          {myRequests.length === 0 ? (
            <p className="text-muted-foreground">Você ainda não fez nenhuma solicitação de adoção.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myRequests.map((request) => (
                <RequestCard key={request.id} request={request} isReceived={false} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="received-requests" className="space-y-4">
          {receivedRequests.length === 0 ? (
            <p className="text-muted-foreground">Você ainda não recebeu nenhuma solicitação de adoção.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {receivedRequests.map((request) => (
                <RequestCard key={request.id} request={request} isReceived={true} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 