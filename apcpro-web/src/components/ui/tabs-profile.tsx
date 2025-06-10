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
import apiClient from "@/lib/api-client";

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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
      apiClient
        .get("/professores")
        .then((res) => setProfessores(res.data))
        .catch(() => setProfessores([]))
        .finally(() => setLoadingProfessores(false));
    }
  }, [formData.role]);

  const handleSubmit = async () => {
    setErrorMsg(null);
    if (!formData.telefone || !formData.dataNascimento || !formData.genero) {
      setErrorMsg("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    if (formData.role === "aluno" && !formData.professorId) {
      setErrorMsg("Por favor, selecione o professor responsável.");
      return;
    }
    const session = await getSession();
    if (!session?.user?.id) {
      setErrorMsg("Usuário não autenticado");
      return;
    }

    const payload = { ...formData };
    if (formData.role === "professor" && "professorId" in payload) {
      (payload as { professorId?: string }).professorId = undefined;
    }
    try {
      await apiClient.post(`${session.user.id}/profile`, payload);
      await update();
      router.refresh();
      if (formData.role === "professor") {
        router.push("/dashboard/professores");
      } else if (formData.role === "aluno") {
        router.push("/dashboard/alunos");
      }
    } catch (error: unknown) {
      setErrorMsg(
        error instanceof Error ? error.message : "Erro ao salvar os dados"
      );
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
              <Label htmlFor="telefone">Telefone celular</Label>
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
                value={formData.genero}
              >
                <SelectTrigger id="genero">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2 items-stretch">
            <Button onClick={handleSubmit}>Salvar</Button>
            {errorMsg && (
              <div className="text-red-600 text-sm font-medium border border-red-200 bg-red-50 rounded p-2 mt-2">
                {errorMsg}
              </div>
            )}
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
                value={formData.genero}
              >
                <SelectTrigger id="genero">
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masculino">Masculino</SelectItem>
                  <SelectItem value="feminino">Feminino</SelectItem>
                  <SelectItem value="outro">Outro</SelectItem>
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
          <CardFooter className="flex flex-col gap-2 items-stretch">
            <Button onClick={handleSubmit}>Salvar</Button>
            {errorMsg && (
              <div className="text-red-600 text-sm font-medium border border-red-200 bg-red-50 rounded p-2 mt-2">
                {errorMsg}
              </div>
            )}
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
