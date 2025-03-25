import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { HelpCircle, Mail, MessageSquare, Phone } from "lucide-react"
import Link from "next/link"

export default function SupportSection() {
  return (
    <section className="w-full min-h-screen flex items-center justify-center py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Precisa de Ajuda?</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Estamos aqui para te ajudar em cada etapa do processo. Confira nossas FAQs ou entre em contato conosco.
            </p>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl gap-8 py-12 lg:grid-cols-2">
          <div className="space-y-8">
            <h3 className="text-2xl font-bold">Perguntas Frequentes</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Como começar?</AccordionTrigger>
                <AccordionContent>
                  Começar é fácil! Basta se cadastrar, completar seu perfil e você já poderá começar a ajudar os animais.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Quanto custa?</AccordionTrigger>
                <AccordionContent>
                  O Adoptivus é uma plataforma gratuita. Você pode cadastrar animais, buscar por animais, ver os detalhes de cada animal e entrar em contato com o responsável pela adoção.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>O site é seguro?</AccordionTrigger>
                <AccordionContent>
                  Sim, o Adoptivus é uma plataforma segura e confiável. Todos os dados são criptografados e armazenados de forma segura.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Como posso ajudar os animais?</AccordionTrigger>
                <AccordionContent>
                  Você pode ajudar os animais de várias formas. Você pode cadastrar animais, buscar por animais, ver os detalhes de cada animal e entrar em contato com o responsável pela adoção.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Como contatar o adotante?</AccordionTrigger>
                <AccordionContent>
                  Você pode entrar em contato com o responsável pela adoção através do email ou telefone que está disponível no perfil do animal.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className="space-y-4">
              <h3 className="text-2xl font-bold">Ainda tem dúvidas?</h3>
              <p className="text-muted-foreground">
                Confira nosso{" "}
                <Link href="#" className="font-medium underline underline-offset-4">
                  base de conhecimento
                </Link>{" "}
                ou{" "}
                <Link href="#" className="font-medium underline underline-offset-4">
                  entre em contato conosco
                </Link>{" "}
                para mais informações.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <h3 className="text-2xl font-bold">Contate-nos</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="first-name"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Nome
                  </label>
                  <Input id="first-name" placeholder="Digite seu nome" />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="last-name"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Sobrenome
                  </label>
                  <Input id="last-name" placeholder="Digite seu sobrenome" />
                </div>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                Email
                </label>
                <Input id="email" type="email" placeholder="Digite seu email" />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="message"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Mensagem
                </label>
                <Textarea id="message" placeholder="Digite sua mensagem" className="min-h-[120px]" />
              </div>
              <Button type="submit" className="w-full">
                Enviar Mensagem
              </Button>
            </form>

            <div className="grid gap-4 md:grid-cols-1">
              {/* <Card>
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Phone className="h-4 w-4" />
                    Telefone
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardDescription>
                    <Link href="tel:+5551981726896" className="text-primary">
                      +55 (51) 98172-6896
                    </Link>
                  </CardDescription>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Mail className="h-4 w-4" />
                    Email
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardDescription>
                    <Link href="mailto:vibrichdev@gmail.com" className="text-primary">
                      vibrichdev@gmail.com
                    </Link>
                  </CardDescription>
                </CardContent>
              </Card> */}
              <Card>
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MessageSquare className="h-4 w-4" />
                    Nos chame no WhatsApp
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <CardDescription>
                    <Button variant="outline" size="sm" className="w-full">
                      <Link href="https://wa.me/5551981726896" className="text-primary">
                        Iniciar Conversa
                      </Link>
                    </Button>
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

