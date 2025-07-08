import React from "react";
import { ModalPadrao } from "@/components/ui/ModalPadrao";
import { ListaAvaliacoes } from "@/components/ListaAvaliacoes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  UserCheck,
  Activity,
  Users
} from "lucide-react";
import { getInitials, formatDisplayName } from "@/utils/name-utils";

type Aluno = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  telefone?: string;
  genero?: string;
  dataNascimento?: string | null;
  grupos?: Array<{
    id: string;
    nome: string;
  }>;
};

type ModalDetalhesAlunoProps = {
  open: boolean;
  onClose: () => void;
  aluno: Aluno | null;
};

export function ModalDetalhesAluno({ 
  open, 
  onClose, 
  aluno 
}: ModalDetalhesAlunoProps) {
  if (!aluno) return null;

  // Calcular idade
  const calcularIdade = (dataNascimento: string) => {
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  return (
    <ModalPadrao
      open={open}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={aluno.image || undefined} alt={aluno.name || 'Aluno'} />
            <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-semibold">
              {getInitials(aluno.name)}
            </AvatarFallback>
          </Avatar>
          <span>{formatDisplayName(aluno.name)}</span>
        </div>
      }
      description="Informações detalhadas do aluno"
      maxWidth="xl"
    >
      {/* Header com informações complementares */}
      <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {aluno.dataNascimento ? `${calcularIdade(aluno.dataNascimento)} anos` : 'Idade não informada'}
            </p>
            <p className="text-xs text-gray-500">
              {aluno.genero ? `${aluno.genero.charAt(0).toUpperCase() + aluno.genero.slice(1)}` : 'Gênero não informado'}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <UserCheck className="h-3 w-3 mr-1" />
          Ativo
        </Badge>
      </div>

      {/* Informações Pessoais */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Informações Pessoais
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <p className="text-sm text-gray-600">{aluno.email}</p>
              </div>
            </div>
            
            {aluno.telefone && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Phone className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Telefone</p>
                  <p className="text-sm text-gray-600">{aluno.telefone}</p>
                </div>
              </div>
            )}
            
            {aluno.dataNascimento && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Data de Nascimento</p>
                  <p className="text-sm text-gray-600">
                    {formatarData(aluno.dataNascimento)} ({calcularIdade(aluno.dataNascimento)} anos)
                  </p>
                </div>
              </div>
            )}
            
            {aluno.genero && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Gênero</p>
                  <p className="text-sm text-gray-600 capitalize">{aluno.genero}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Grupos do Aluno */}
      {aluno.grupos && aluno.grupos.length > 0 && (
        <Card className="border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Grupos
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              {aluno.grupos.map((grupo) => (
                <Badge
                  key={grupo.id}
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  {grupo.nome}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Histórico de Avaliações */}
      <Card className="border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-600" />
            Histórico de Avaliações
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ListaAvaliacoes userPerfilId={aluno.id} />
        </CardContent>
      </Card>
    </ModalPadrao>
  );
}
