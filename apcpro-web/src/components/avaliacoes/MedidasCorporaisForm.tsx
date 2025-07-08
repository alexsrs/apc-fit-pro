"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Save, Calculator, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import apiClient from "@/lib/api-client";

interface MedidasCorporaisData {
  peso: number;
  altura: number;
  circunferenciaTorax: number;
  circunferenciaCintura: number;
  circunferenciaQuadril: number;
  circunferenciaBracoEsquerdo: number;
  circunferenciaBracoDireito: number;
  circunferenciaCoxa: number;
  circunferenciaPanturrilha: number;
  observacoes?: string;
}

interface MedidasCorporaisFormProps {
  userId: string;
  onSuccess?: () => void;
  initialData?: Partial<MedidasCorporaisData>;
}

export function MedidasCorporaisForm({
  userId,
  onSuccess,
  initialData
}: MedidasCorporaisFormProps) {
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [formData, setFormData] = useState<MedidasCorporaisData>({
    peso: initialData?.peso || 0,
    altura: initialData?.altura || 0,
    circunferenciaTorax: initialData?.circunferenciaTorax || 0,
    circunferenciaCintura: initialData?.circunferenciaCintura || 0,
    circunferenciaQuadril: initialData?.circunferenciaQuadril || 0,
    circunferenciaBracoEsquerdo: initialData?.circunferenciaBracoEsquerdo || 0,
    circunferenciaBracoDireito: initialData?.circunferenciaBracoDireito || 0,
    circunferenciaCoxa: initialData?.circunferenciaCoxa || 0,
    circunferenciaPanturrilha: initialData?.circunferenciaPanturrilha || 0,
    observacoes: initialData?.observacoes || "",
  });

  // Cálculos automáticos
  const imc = formData.peso && formData.altura ? 
    (formData.peso / Math.pow(formData.altura / 100, 2)).toFixed(2) : "0";

  const rcq = formData.circunferenciaCintura && formData.circunferenciaQuadril ?
    (formData.circunferenciaCintura / formData.circunferenciaQuadril).toFixed(2) : "0";

  const handleInputChange = (field: keyof MedidasCorporaisData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? (field === 'observacoes' ? value : parseFloat(value) || 0) : value
    }));
  };

  const handleSave = async () => {
    if (!formData.peso || !formData.altura) {
      setErro("Peso e altura são obrigatórios.");
      return;
    }

    setLoading(true);
    setErro(null);
    try {
      const payload = {
        ...formData,
        userPerfilId: userId,
        imc: parseFloat(imc),
        rcq: parseFloat(rcq),
      };

      await apiClient.post('/api/medidas-corporais', payload);
      
      alert("Medidas corporais salvas com sucesso!");
      onSuccess?.();
    } catch (error) {
      console.error('Erro ao salvar medidas:', error);
      setErro("Erro ao salvar medidas corporais. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Medidas Corporais</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Medidas Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Medidas Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="peso">Peso (kg) *</Label>
              <Input
                id="peso"
                type="number"
                step="0.1"
                value={formData.peso || ""}
                onChange={(e) => handleInputChange("peso", e.target.value)}
                placeholder="Ex: 70.5"
              />
            </div>
            <div>
              <Label htmlFor="altura">Altura (cm) *</Label>
              <Input
                id="altura"
                type="number"
                step="0.1"
                value={formData.altura || ""}
                onChange={(e) => handleInputChange("altura", e.target.value)}
                placeholder="Ex: 175"
              />
            </div>
          </CardContent>
        </Card>

        {/* Cálculos Automáticos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Índices Calculados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>IMC (kg/m²)</Label>
              <Input value={imc} readOnly className="bg-gray-50" />
            </div>
            <div>
              <Label>RCQ (Relação Cintura/Quadril)</Label>
              <Input value={rcq} readOnly className="bg-gray-50" />
            </div>
          </CardContent>
        </Card>

        {/* Circunferências - Tronco */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Circunferências - Tronco</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="torax">Tórax (cm)</Label>
              <Input
                id="torax"
                type="number"
                step="0.1"
                value={formData.circunferenciaTorax || ""}
                onChange={(e) => handleInputChange("circunferenciaTorax", e.target.value)}
                placeholder="Ex: 95.5"
              />
            </div>
            <div>
              <Label htmlFor="cintura">Cintura (cm)</Label>
              <Input
                id="cintura"
                type="number"
                step="0.1"
                value={formData.circunferenciaCintura || ""}
                onChange={(e) => handleInputChange("circunferenciaCintura", e.target.value)}
                placeholder="Ex: 80.0"
              />
            </div>
            <div>
              <Label htmlFor="quadril">Quadril (cm)</Label>
              <Input
                id="quadril"
                type="number"
                step="0.1"
                value={formData.circunferenciaQuadril || ""}
                onChange={(e) => handleInputChange("circunferenciaQuadril", e.target.value)}
                placeholder="Ex: 98.0"
              />
            </div>
          </CardContent>
        </Card>

        {/* Circunferências - Membros */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Circunferências - Membros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="bracoEsq">Braço Esquerdo (cm)</Label>
              <Input
                id="bracoEsq"
                type="number"
                step="0.1"
                value={formData.circunferenciaBracoEsquerdo || ""}
                onChange={(e) => handleInputChange("circunferenciaBracoEsquerdo", e.target.value)}
                placeholder="Ex: 32.0"
              />
            </div>
            <div>
              <Label htmlFor="bracoDir">Braço Direito (cm)</Label>
              <Input
                id="bracoDir"
                type="number"
                step="0.1"
                value={formData.circunferenciaBracoDireito || ""}
                onChange={(e) => handleInputChange("circunferenciaBracoDireito", e.target.value)}
                placeholder="Ex: 32.5"
              />
            </div>
            <div>
              <Label htmlFor="coxa">Coxa (cm)</Label>
              <Input
                id="coxa"
                type="number"
                step="0.1"
                value={formData.circunferenciaCoxa || ""}
                onChange={(e) => handleInputChange("circunferenciaCoxa", e.target.value)}
                placeholder="Ex: 55.0"
              />
            </div>
            <div>
              <Label htmlFor="panturrilha">Panturrilha (cm)</Label>
              <Input
                id="panturrilha"
                type="number"
                step="0.1"
                value={formData.circunferenciaPanturrilha || ""}
                onChange={(e) => handleInputChange("circunferenciaPanturrilha", e.target.value)}
                placeholder="Ex: 36.0"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Observações */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Observações</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.observacoes}
            onChange={(e) => handleInputChange("observacoes", e.target.value)}
            placeholder="Observações sobre as medidas, condições de coleta, etc..."
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Exibição de erro */}
      {erro && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {erro}
          </AlertDescription>
        </Alert>
      )}

      {/* Alerta sobre campos obrigatórios */}
      <div className="flex items-center gap-2 text-sm text-amber-600">
        <AlertCircle className="h-4 w-4" />
        <span>Peso e altura são obrigatórios para cálculo do IMC</span>
      </div>

      {/* Botão de salvar */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={loading || !formData.peso || !formData.altura}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          {loading ? "Salvando..." : "Salvar Medidas"}
        </Button>
      </div>
    </div>
  );
}
