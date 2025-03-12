"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/masked-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { states } from "@/lib/states";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const profileFormSchema = z.object({
  full_name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  birth_date: z.string().min(1, "Data de nascimento é obrigatória"),
  phone: z.string().min(14, "Telefone inválido"),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().length(2, "Estado inválido"),
});

export default function ProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: "",
      birth_date: "",
      phone: "",
      city: "",
      state: "",
    },
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push("/login");
          return;
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (profile) {
          form.reset({
            full_name: profile.full_name || "",
            birth_date: profile.birth_date || "",
            phone: profile.phone || "",
            city: profile.city || "",
            state: profile.state || "",
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, [form, router]);

  async function onSubmit(values: z.infer<typeof profileFormSchema>) {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("Usuário não encontrado");

      const cleanPhone = values.phone.replace(/\D/g, "");

      console.log("Dados do perfil a serem salvos:", {
        ...values,
        phone: cleanPhone,
        updated_at: new Date().toISOString(),
      });

      const { error, status } = await supabase
        .from("profiles")
        .upsert({
          ...values,
          phone: cleanPhone,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      console.log("Status do upsert:", status);

      if (error) throw error;

      toast({
        title: "Perfil atualizado com sucesso!",
        description: "Suas informações foram salvas.",
      });
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Ocorreu um erro ao salvar suas informações.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="container py-6 sm:py-8 px-4 sm:px-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6">Carregando...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 sm:py-8 px-4 sm:px-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Meu Perfil</h1>

        <div className="bg-card p-4 sm:p-6 rounded-lg border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite seu nome completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="birth_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <MaskedInput
                          mask="(99) 99999-9999"
                          placeholder="(00) 00000-0000"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione seu estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem key={state.uf} value={state.uf}>
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite sua cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto"
                  disabled={isLoading}
                >
                  {isLoading ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}