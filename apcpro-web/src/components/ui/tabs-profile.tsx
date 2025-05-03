import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TabsProfile() {
  return (
    <Tabs defaultValue="professional" className="w-[460px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="professional">Profissional</TabsTrigger>
        <TabsTrigger value="student">Aluno</TabsTrigger>
      </TabsList>
      <TabsContent value="professional">
        <Card>
          <CardHeader>
            <CardTitle>Você é profissional de educação física</CardTitle>
            <CardDescription>
              Faça alterações na sua conta aqui. Clique em salvar quando terminar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone celular</Label>
              <Input id="telefone" defaultValue="(21) 9xxxx-xxxx" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataNascimento">Data de Nascimento</Label>
              <Input id="dataNascimento" type="Date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genero">Gênero</Label>
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Salvar</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="student">
        <Card>
          <CardHeader>
            <CardTitle>Você é aluno com acompanhamento profissional</CardTitle>
            <CardDescription>
              Faça alterações na sua conta aqui. Clique em salvar quando terminar.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone celular</Label>
              <Input id="telefone" defaultValue="(21) 9xxxx-xxxx" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataNascimento">Data de Nascimento</Label>
              <Input id="dataNascimento" type="Date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genero">Gênero</Label>
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="professorId">Professor ID</Label>
              <Input id="professorId" type="text" defaultValue="xxxx-xxxx-xxxx" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Salvar</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}