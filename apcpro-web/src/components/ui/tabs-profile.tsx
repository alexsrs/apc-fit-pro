import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession, useSession } from "next-auth/react";
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
  const { update } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    role: "professor", // Define o valor inicial como "professor"
    telefone: "",
    dataNascimento: "",
    genero: "",
    professorId: "",
  });

  const [professores, setProfessores] = useState<
    { id: string; name: string }[]
  >([]);
  const [loadingProfessores, setLoadingProfessores] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleTabChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value === "professional" ? "professor" : "aluno",
    }));
  };

  useEffect(() => {
    if (formData.role === "aluno") {
      setLoadingProfessores(true);
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/professores`)
        .then((res) => res.json())
        .then((data) => {
          setProfessores(data);
        })
        .catch(() => setProfessores([]))
        .finally(() => setLoadingProfessores(false));
    }
  }, [formData.role]);

  const handleSubmit = async () => {
    if (!formData.telefone || !formData.dataNascimento || !formData.genero) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Validação extra para aluno
    if (formData.role === "aluno" && !formData.professorId) {
      alert("Por favor, selecione o professor responsável.");
      return;
    }

    const session = await getSession();
    if (!session || !session.user || !session.user.id) {
      alert("Usuário não autenticado");
      return;
    }

    const userId = session.user.id;

    const payload = {
      ...formData,
    };
    if (formData.role === "professor" && "professorId" in payload) {
      (payload as { professorId?: string }).professorId = undefined;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/${userId}/profile`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro da API:", errorData);
        throw new Error("Erro ao salvar os dados");
      }
      await update();
      alert("Dados salvos com sucesso!");
      router.refresh();
      if (formData.role === "professor") {
        router.push("/dashboard/professores");
      } else if (formData.role === "aluno") {
        router.push("/dashboard/alunos");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar os dados");
    }
  };

  return (
    <Tabs
      defaultValue="professional"
      className="w-[460px]"
      onValueChange={handleTabChange}
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
              <Label htmlFor="professorId">Professor responsável</Label>
              <Select
                value={formData.professorId}
                onValueChange={(value) =>
                  handleSelectChange("professorId", value)
                }
                disabled={loadingProfessores}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingProfessores
                        ? "Carregando..."
                        : "Selecione o professor"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {professores.length === 0 && !loadingProfessores && (
                    <SelectItem value="" disabled>
                      Nenhum professor encontrado
                    </SelectItem>
                  )}
                  {professores.map((prof) => (
                    <SelectItem key={prof.id} value={prof.id}>
                      {prof.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
