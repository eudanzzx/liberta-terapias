
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, CreditCard, Calendar, Package } from "lucide-react";

interface AtendimentoFormProps {
  formData: any;
  dataNascimento: string;
  signo: string;
  atencao: boolean;
  planoAtivo: boolean;
  semanalAtivo: boolean;
  planoData: {
    meses: string;
    valorMensal: string;
    diaVencimento: string;
  };
  semanalData: {
    semanas: string;
    valorSemanal: string;
    diaVencimento: string;
  };
  pacoteAtivo: boolean;
  pacoteData: {
    dias: string;
    pacoteDias: Array<{
      id: string;
      data: string;
      valor: string;
    }>;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (field: string, value: string) => void;
  onDataNascimentoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAtencaoChange: (value: boolean) => void;
  onPlanoAtivoChange: (value: boolean) => void;
  onSemanalAtivoChange: (value: boolean) => void;
  onPacoteAtivoChange: (value: boolean) => void;
  onPlanoDataChange: (field: string, value: string) => void;
  onSemanalDataChange: (field: string, value: string) => void;
  onPacoteDataChange: (field: string, value: string) => void;
  onPacoteDiaChange: (id: string, field: string, value: string) => void;
}

const AtendimentoForm: React.FC<AtendimentoFormProps> = ({
  formData,
  dataNascimento,
  signo,
  atencao,
  planoAtivo,
  semanalAtivo,
  pacoteAtivo,
  planoData,
  semanalData,
  pacoteData,
  onInputChange,
  onSelectChange,
  onDataNascimentoChange,
  onAtencaoChange,
  onPlanoAtivoChange,
  onSemanalAtivoChange,
  onPacoteAtivoChange,
  onPlanoDataChange,
  onSemanalDataChange,
  onPacoteDataChange,
  onPacoteDiaChange,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pago":
        return "bg-emerald-500 text-white border-emerald-600";
      case "pendente":
        return "bg-amber-500 text-white border-amber-600";
      case "parcelado":
        return "bg-rose-500 text-white border-rose-600";
      default:
        return "bg-slate-200 text-slate-800 border-slate-300";
    }
  };

  const diasSemana = [
    { value: "segunda", label: "Segunda-feira" },
    { value: "terca", label: "Terça-feira" },
    { value: "quarta", label: "Quarta-feira" },
    { value: "quinta", label: "Quinta-feira" },
    { value: "sexta", label: "Sexta-feira" },
    { value: "sabado", label: "Sábado" },
    { value: "domingo", label: "Domingo" },
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border border-white/20 shadow-lg">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="text-[#0EA5E9] text-lg">Cadastro de Atendimento</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-slate-700 font-medium">Nome do Cliente</Label>
              <Input 
                id="nome" 
                placeholder="Nome completo" 
                value={formData.nome}
                onChange={onInputChange}
                className="bg-white/50 border-white/20 focus:border-[#0EA5E9] focus:ring-[#0EA5E9]/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataNascimento" className="text-slate-700 font-medium">Data de Nascimento</Label>
              <Input 
                id="dataNascimento" 
                type="date" 
                value={dataNascimento}
                onChange={onDataNascimentoChange}
                className="bg-white/50 border-white/20 focus:border-[#0EA5E9] focus:ring-[#0EA5E9]/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signo" className="text-slate-700 font-medium">Signo</Label>
              <Input 
                id="signo" 
                value={signo} 
                readOnly 
                className="bg-slate-50 border-white/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone" className="text-slate-700 font-medium">Telefone</Label>
              <Input 
                id="telefone" 
                placeholder="(00) 00000-0000" 
                value={formData.telefone}
                onChange={onInputChange}
                className="bg-white/50 border-white/20 focus:border-[#0EA5E9] focus:ring-[#0EA5E9]/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipoServico" className="text-slate-700 font-medium">Tipo de Serviço</Label>
              <Select onValueChange={(value) => onSelectChange("tipoServico", value)}>
                <SelectTrigger className="bg-white/50 border-white/20 focus:border-[#0EA5E9]">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tarot">Tarot</SelectItem>
                  <SelectItem value="terapia">Terapia</SelectItem>
                  <SelectItem value="mesa-radionica">Mesa Radiônica</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dataAtendimento" className="text-slate-700 font-medium">Data do Atendimento</Label>
              <Input 
                id="dataAtendimento" 
                type="date" 
                value={formData.dataAtendimento}
                onChange={onInputChange}
                className="bg-white/50 border-white/20 focus:border-[#0EA5E9] focus:ring-[#0EA5E9]/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor" className="text-slate-700 font-medium">Valor Cobrado (R$)</Label>
              <Input 
                id="valor" 
                type="number" 
                placeholder="0.00" 
                value={formData.valor}
                onChange={onInputChange}
                className="bg-white/50 border-white/20 focus:border-[#0EA5E9] focus:ring-[#0EA5E9]/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="statusPagamento" className="text-slate-700 font-medium">Status de Pagamento</Label>
              <Select onValueChange={(value) => onSelectChange("statusPagamento", value)}>
                <SelectTrigger className={formData.statusPagamento ? `border-2 ${getStatusColor(formData.statusPagamento)}` : "bg-white/50 border-white/20 focus:border-[#0EA5E9]"}>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pago" className="text-emerald-700">Pago</SelectItem>
                  <SelectItem value="pendente" className="text-amber-700">Pendente</SelectItem>
                  <SelectItem value="parcelado" className="text-rose-700">Parcelado</SelectItem>
                </SelectContent>
              </Select>
              
              {formData.statusPagamento && (
                <div className={`mt-2 px-3 py-1 rounded-md text-sm flex items-center ${getStatusColor(formData.statusPagamento)}`}>
                  <span className="h-2 w-2 rounded-full bg-white mr-2"></span>
                  <span className="capitalize">{formData.statusPagamento}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="destino" className="text-slate-700 font-medium">Destino</Label>
              <Input 
                id="destino" 
                placeholder="Destino do cliente" 
                value={formData.destino}
                onChange={onInputChange}
                className="bg-white/50 border-white/20 focus:border-[#0EA5E9] focus:ring-[#0EA5E9]/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade" className="text-slate-700 font-medium">Cidade</Label>
              <Input 
                id="cidade" 
                placeholder="Cidade do cliente" 
                value={formData.cidade}
                onChange={onInputChange}
                className="bg-white/50 border-white/20 focus:border-[#0EA5E9] focus:ring-[#0EA5E9]/20"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ano" className="text-slate-700 font-medium">Ano</Label>
              <Input 
                id="ano" 
                placeholder="Ano específico" 
                value={formData.ano}
                onChange={onInputChange}
                className="bg-white/50 border-white/20 focus:border-[#0EA5E9] focus:ring-[#0EA5E9]/20"
              />
            </div>

            <div className="space-y-2 flex flex-col">
              <div className="flex items-center justify-between">
                <Label htmlFor="atencao" className="text-slate-700 font-medium flex items-center">
                  <AlertTriangle className={`mr-2 h-4 w-4 ${atencao ? "text-rose-500" : "text-slate-400"}`} />
                  ATENÇÃO
                </Label>
                <Switch 
                  checked={atencao} 
                  onCheckedChange={onAtencaoChange} 
                  className="data-[state=checked]:bg-rose-500"
                />
              </div>
              <Input 
                id="atencaoNota" 
                placeholder="Pontos de atenção" 
                className={atencao ? "border-rose-500 bg-rose-50" : "bg-white/50 border-white/20 focus:border-[#0EA5E9] focus:ring-[#0EA5E9]/20"}
                value={formData.atencaoNota}
                onChange={onInputChange}
              />
            </div>

            <div className="space-y-2 flex flex-col">
              <div className="flex items-center justify-between">
                <Label htmlFor="plano" className="text-slate-700 font-medium flex items-center">
                  <CreditCard className={`mr-2 h-4 w-4 ${planoAtivo ? "text-[#0EA5E9]" : "text-slate-400"}`} />
                  PLANO MENSAL
                </Label>
                <Switch 
                  checked={planoAtivo} 
                  onCheckedChange={onPlanoAtivoChange} 
                  className="data-[state=checked]:bg-[#0EA5E9]"
                />
              </div>
              
              {planoAtivo && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="space-y-1">
                    <Label className="text-sm text-slate-600">Meses</Label>
                    <Select onValueChange={(value) => onPlanoDataChange("meses", value)}>
                      <SelectTrigger className="bg-[#0EA5E9]/10 border-[#0EA5E9]/30 focus:border-[#0EA5E9]">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(12)].map((_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1} {i === 0 ? 'mês' : 'meses'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-slate-600">Valor Mensal (R$)</Label>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      value={planoData.valorMensal}
                      onChange={(e) => onPlanoDataChange("valorMensal", e.target.value)}
                      className="bg-[#0EA5E9]/10 border-[#0EA5E9]/30 focus:border-[#0EA5E9] focus:ring-[#0EA5E9]/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-slate-600">Dia Vencimento</Label>
                    <Select onValueChange={(value) => onPlanoDataChange("diaVencimento", value)}>
                      <SelectTrigger className="bg-[#0EA5E9]/10 border-[#0EA5E9]/30 focus:border-[#0EA5E9]">
                        <SelectValue placeholder="Dia" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(30)].map((_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            Dia {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 flex flex-col">
              <div className="flex items-center justify-between">
                <Label htmlFor="semanal" className="text-slate-700 font-medium flex items-center">
                  <Calendar className={`mr-2 h-4 w-4 ${semanalAtivo ? "text-[#10B981]" : "text-slate-400"}`} />
                  PLANO SEMANAL
                </Label>
                <Switch 
                  checked={semanalAtivo} 
                  onCheckedChange={onSemanalAtivoChange} 
                  className="data-[state=checked]:bg-[#10B981]"
                />
              </div>
              
              {semanalAtivo && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <div className="space-y-1">
                    <Label className="text-sm text-slate-600">Semanas</Label>
                    <Select onValueChange={(value) => onSemanalDataChange("semanas", value)}>
                      <SelectTrigger className="bg-[#10B981]/10 border-[#10B981]/30 focus:border-[#10B981]">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(12)].map((_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1} {i === 0 ? 'semana' : 'semanas'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-slate-600">Valor Semanal (R$)</Label>
                    <Input 
                      type="number" 
                      placeholder="0.00" 
                      value={semanalData.valorSemanal}
                      onChange={(e) => onSemanalDataChange("valorSemanal", e.target.value)}
                      className="bg-[#10B981]/10 border-[#10B981]/30 focus:border-[#10B981] focus:ring-[#10B981]/20"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-sm text-slate-600">Dia Vencimento</Label>
                    <Select onValueChange={(value) => onSemanalDataChange("diaVencimento", value)}>
                      <SelectTrigger className="bg-[#10B981]/10 border-[#10B981]/30 focus:border-[#10B981]">
                        <SelectValue placeholder="Dia" />
                      </SelectTrigger>
                      <SelectContent>
                        {diasSemana.map((dia) => (
                          <SelectItem key={dia.value} value={dia.value}>
                            {dia.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2 flex flex-col">
              <div className="flex items-center justify-between">
                <Label htmlFor="pacote" className="text-slate-700 font-medium flex items-center">
                  <Package className={`mr-2 h-4 w-4 ${pacoteAtivo ? "text-[#8B5CF6]" : "text-slate-400"}`} />
                  PACOTES
                </Label>
                <Switch 
                  checked={pacoteAtivo} 
                  onCheckedChange={onPacoteAtivoChange}
                  className="data-[state=checked]:bg-[#8B5CF6]"
                />
              </div>
              
              {pacoteAtivo && (
                <div className="space-y-4 mt-2 p-4 bg-[#8B5CF6]/5 border border-[#8B5CF6]/20 rounded-lg">
                  <div className="space-y-1">
                    <Label className="text-sm text-slate-600">Quantidade de Dias</Label>
                    <Select onValueChange={(value) => onPacoteDataChange("dias", value)} value={pacoteData.dias}>
                      <SelectTrigger className="bg-[#8B5CF6]/10 border-[#8B5CF6]/30 focus:border-[#8B5CF6]">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {[...Array(30)].map((_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            {i + 1} {i === 0 ? 'dia' : 'dias'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {pacoteData.pacoteDias.length > 0 && (
                    <div className="space-y-3 max-h-64 overflow-y-auto border border-[#8B5CF6]/20 rounded-lg p-3 bg-[#8B5CF6]/5">
                      <Label className="text-sm font-medium text-slate-700">Configuração dos Dias</Label>
                      {pacoteData.pacoteDias.map((dia, index) => (
                        <div key={dia.id} className="grid grid-cols-3 gap-2 p-3 bg-white rounded-lg border border-[#8B5CF6]/20">
                          <div className="space-y-1">
                            <Label className="text-xs text-slate-600">Dia {index + 1}</Label>
                            <div className="text-xs text-slate-500 p-2 bg-slate-50 rounded">
                              Sessão {index + 1}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-slate-600">Data</Label>
                            <Input 
                              type="date" 
                              value={dia.data}
                              onChange={(e) => onPacoteDiaChange(dia.id, "data", e.target.value)}
                              className="bg-white border-[#8B5CF6]/30 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/20 text-sm"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs text-slate-600">Valor (R$)</Label>
                            <Input 
                              type="number" 
                              placeholder="0.00" 
                              value={dia.valor}
                              onChange={(e) => onPacoteDiaChange(dia.id, "valor", e.target.value)}
                              className="bg-white border-[#8B5CF6]/30 focus:border-[#8B5CF6] focus:ring-[#8B5CF6]/20 text-sm"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <Label htmlFor="detalhes" className="text-slate-700 font-medium">Detalhes da Sessão</Label>
            <Textarea 
              id="detalhes" 
              placeholder="Revelações, conselhos e orientações..." 
              className="min-h-[100px] bg-white/50 border-white/20 focus:border-[#0EA5E9] focus:ring-[#0EA5E9]/20"
              value={formData.detalhes}
              onChange={onInputChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="tratamento" className="text-slate-700 font-medium">Tratamento</Label>
              <Textarea 
                id="tratamento" 
                placeholder="Observações sobre o tratamento..." 
                className="min-h-[80px] bg-white/50 border-white/20 focus:border-[#0EA5E9] focus:ring-[#0EA5E9]/20"
                value={formData.tratamento}
                onChange={onInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="indicacao" className="text-slate-700 font-medium">Indicação</Label>
              <Textarea 
                id="indicacao" 
                placeholder="Informações adicionais e indicações..." 
                className="min-h-[80px] bg-white/50 border-white/20 focus:border-[#0EA5E9] focus:ring-[#0EA5E9]/20"
                value={formData.indicacao}
                onChange={onInputChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AtendimentoForm;
