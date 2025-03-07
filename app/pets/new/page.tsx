"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/ui/masked-input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { states } from "@/lib/states";

const petFormSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  species: z.enum(["dog", "cat", "bird", "other"], {
    required_error: "Selecione uma espécie",
  }),
  breed: z.string().optional(),
  description: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  whatsapp: z.string().optional(),
  is_litter: z.boolean().default(false),
  litter_size: z.number().optional(),
  males_count: z.number().optional(),
  females_count: z.number().optional(),
  birth_date: z.string().optional(),
  city: z.string().min(2, "Cidade é obrigatória"),
  state: z.string().length(2, "Estado inválido"),
});

export default function NewPetPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [userPhone, setUserPhone] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);

  useEffect(() => {
    async function loadUserProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("phone, city, state")
          .eq("id", user.id)
          .single();

        if (profile) {
          setUserProfile(profile);
          setUserPhone(profile.phone || "");
          form.setValue("city", profile.city || "");
          form.setValue("state", profile.state || "");
        }
      }
    }

    loadUserProfile();
  }, []);

  const form = useForm<z.infer<typeof petFormSchema>>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: "",
      species: undefined,
      breed: "",
      description: "",
      whatsapp: "",
      is_litter: false,
      litter_size: 0,
      males_count: 0,
      females_count: 0,
      birth_date: "",
      city: "",
      state: "",
    },
  });

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;

    setIsUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("pets")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from("pets")
        .getPublicUrl(filePath);

      setImageUrl(publicUrl);
      toast({
        title: "Imagem enviada com sucesso!",
        description: "A imagem do pet foi carregada.",
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar imagem",
        description: "Ocorreu um erro ao enviar a imagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  }

  async function onSubmit(values: z.infer<typeof petFormSchema>) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const contact_whatsapp = values.whatsapp ? values.whatsapp.replace(/\D/g, "") : userPhone;
      if (!contact_whatsapp) {
        toast({
          title: "Erro ao cadastrar pet",
          description: "É necessário fornecer um número de telefone para contato ou cadastrar um no seu perfil.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase.from("pets").insert({
        ...values,
        image_url: imageUrl,
        contact_whatsapp,
        user_id: user.id,
      });

      if (error) throw error;

      toast({
        title: "Pet cadastrado com sucesso!",
        description: "Seu pet foi adicionado à plataforma.",
      });

      router.push("/pets");
    } catch (error) {
      toast({
        title: "Erro ao cadastrar pet",
        description: "Ocorreu um erro ao cadastrar o pet. Tente novamente.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="container py-6 sm:py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Doar um Pet</h1>

        <div className="bg-card p-4 sm:p-6 rounded-lg border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Pet</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome do pet" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="species"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Espécie</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma espécie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="dog">Cachorro</SelectItem>
                          <SelectItem value="cat">Gato</SelectItem>
                          <SelectItem value="bird">Pássaro</SelectItem>
                          <SelectItem value="other">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="breed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Raça</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite a raça do pet" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o pet, sua personalidade, necessidades especiais, etc."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                            <SelectValue placeholder="Selecione o estado" />
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
                        <Input placeholder="Digite a cidade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp para Contato</FormLabel>
                      <FormControl>
                        <MaskedInput
                          mask="(99) 99999-9999"
                          placeholder={userPhone ? "Usando telefone do perfil" : "(00) 00000-0000"}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        {userPhone ? "Se não informado, será usado o telefone do seu perfil" : "Formato: (00) 00000-0000"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="birth_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>
                        Data aproximada de nascimento do pet
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="is_litter"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Ninhada</FormLabel>
                      <FormDescription>
                        Marque se você está doando uma ninhada de filhotes
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {form.watch("is_litter") && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="litter_size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Total de Filhotes</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="males_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Machos</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="females_count"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fêmeas</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="space-y-4">
                <FormLabel>Foto do Pet</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="cursor-pointer"
                />
                {imageUrl && (
                  <div className="relative aspect-square w-full max-w-[200px] mx-auto sm:mx-0">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="rounded-lg object-cover w-full h-full"
                    />
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={isUploading}
                  className="w-full sm:w-auto"
                >
                  {isUploading ? "Enviando..." : "Cadastrar Pet"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}