import { useState } from "react";
import { getSession } from "next-auth/react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TabsProfile() {
  const [formData, setFormData] = useState({
    role: "",
    telefone: "",
    dataNascimento: "",
    genero: "",
    professorId: "",
  });

  const [activeTab, setActiveTab] = useState("professional");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.telefone || !formData.dataNascimento || !formData.genero) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const session = await getSession();
    if (!session || !session.user || !session.user.id) {
      alert("Usuário não autenticado");
      return;
    }

    const userId = session.user.id;
    const role = activeTab === "professional" ? "prof" : "aluno";

    // Atualiza o estado formData com o valor de role
    setFormData((prev) => ({ ...prev, role }));

    try {
      console.log(role);
      console.log("Dados do formulário:", { ...formData, role });
      console.log("ID do usuário:", userId);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/${userId}/profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...formData, role }), // Inclui o campo role no objeto enviado
        }
      );

      console.log("Resposta da API:", response);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro da API:", errorData);
        throw new Error("Erro ao salvar os dados");
      }

      alert("Dados salvos com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar os dados");
    }
  };

  return (
    <Tabs
      defaultValue="professional"
      className="w-[460px]"
      onValueChange={(value) => setActiveTab(value)} // Atualiza a aba ativa
    >
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="professional">Sou profissional</TabsTrigger>
        <TabsTrigger value="student">Sou aluno</TabsTrigger>
      </TabsList>
      <TabsContent value="professional">
        <Card>
          <CardHeader>
            <CardTitle>Estamos quase lá!</CardTitle>
            <CardDescription>
              Complete as informações abaixo para finalizar seu cadastro como
              profissional de Educação Física. Não se esqueça de clicar em
              Salvar no final.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                placeholder="(DDD) 9xxxx-xxxx"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataNascimento">Data de Nascimento</Label>
              <Input
                id="dataNascimento"
                type="date"
                value={formData.dataNascimento}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genero">Gênero</Label>
              <Select
                onValueChange={(value) => handleSelectChange("genero", value)}
              >
                <SelectTrigger>
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
            <Button onClick={handleSubmit}>Salvar</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="student">
        <Card>
          <CardHeader>
            <CardTitle>Estamos quase lá!</CardTitle>
            <CardDescription>
              Complete as informações abaixo para finalizar seu cadastro como
              aluno. Não se esqueça de clicar em Salvar no final.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone celular</Label>
              <Input
                id="telefone"
                value={formData.telefone}
                onChange={handleInputChange}
                placeholder="(21) 9xxxx-xxxx"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataNascimento">Data de Nascimento</Label>
              <Input
                id="dataNascimento"
                type="date"
                value={formData.dataNascimento}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="genero">Gênero</Label>
              <Select
                onValueChange={(value) => handleSelectChange("genero", value)}
              >
                <SelectTrigger>
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
              <Input
                id="professorId"
                value={formData.professorId}
                onChange={handleInputChange}
                placeholder="xxxx-xxxx-xxxx"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit}>Salvar</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
