
import { useState, useCallback } from "react";
import { toast } from "sonner";

interface FormData {
  nome: string;
  dataNascimento: string;
  telefone: string;
  tipoServico: string;
  statusPagamento: 'pago' | 'pendente' | 'parcelado' | "";
  dataAtendimento: string;
  valor: string;
  destino: string;
  cidade: string;
  ano: string;
  atencaoNota: string;
  detalhes: string;
  tratamento: string;
  indicacao: string;
}

interface PlanoData {
  meses: string;
  valorMensal: string;
  diaVencimento: string;
}

interface SemanalData {
  semanas: string;
  valorSemanal: string;
  diaVencimento: string;
}

interface PacoteData {
  dias: string;
  pacoteDias: Array<{
    id: string;
    data: string;
    valor: string;
  }>;
}

const useAtendimentoForm = () => {
  const [dataNascimento, setDataNascimento] = useState("");
  const [signo, setSigno] = useState("");
  const [atencao, setAtencao] = useState(false);
  const [planoAtivo, setPlanoAtivo] = useState(false);
  const [semanalAtivo, setSemanalAtivo] = useState(false);
  const [pacoteAtivo, setPacoteAtivo] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    dataNascimento: "",
    telefone: "",
    tipoServico: "",
    statusPagamento: "",
    dataAtendimento: "",
    valor: "",
    destino: "",
    cidade: "",
    ano: "",
    atencaoNota: "",
    detalhes: "",
    tratamento: "",
    indicacao: "",
  });
  const [planoData, setPlanoData] = useState<PlanoData>({
    meses: "",
    valorMensal: "",
    diaVencimento: "",
  });
  const [semanalData, setSemanalData] = useState<SemanalData>({
    semanas: "",
    valorSemanal: "",
    diaVencimento: "",
  });
  const [pacoteData, setPacoteData] = useState<PacoteData>({
    dias: "",
    pacoteDias: [],
  });

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    
    // Corrigir problema de timezone para campos de data
    let correctedValue = value;
    if (id === 'dataAtendimento' && value && e.target.type === 'date') {
      // Para campos de data, garantir que seja salvo no formato correto sem problemas de timezone
      correctedValue = value; // Manter como string YYYY-MM-DD
    }
    
    setFormData(prev => ({
      ...prev,
      [id]: correctedValue,
    }));
  }, []);

  const handleSelectChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handlePlanoDataChange = useCallback((field: string, value: string) => {
    setPlanoData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleSemanalDataChange = useCallback((field: string, value: string) => {
    setSemanalData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handlePacoteDataChange = useCallback((field: string, value: string) => {
    if (field === "dias") {
      const numDias = parseInt(value) || 0;
      const novosPacoteDias = Array.from({ length: numDias }, (_, index) => ({
        id: `pacote-dia-${Date.now()}-${index}`,
        data: "",
        valor: "",
      }));
      
      setPacoteData(prev => ({
        ...prev,
        dias: value,
        pacoteDias: novosPacoteDias,
      }));
    } else {
      setPacoteData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  }, []);

  const handlePacoteDiaChange = useCallback((id: string, field: string, value: string) => {
    setPacoteData(prev => ({
      ...prev,
      pacoteDias: prev.pacoteDias.map(dia => 
        dia.id === id ? { ...dia, [field]: value } : dia
      ),
    }));
  }, []);

  const checkIfBirthday = useCallback((birthDate: string) => {
    console.log('NovoAtendimento - Verificando se é aniversário para data:', birthDate);
    
    if (!birthDate) return;
    
    try {
      const today = new Date();
      const todayDay = today.getDate();
      const todayMonth = today.getMonth() + 1;
      
      const [year, month, day] = birthDate.split('-').map(Number);
      
      console.log('NovoAtendimento - Comparação de datas:', {
        birthDate,
        parsedDay: day,
        parsedMonth: month,
        todayDay,
        todayMonth
      });
      
      const isSameDay = day === todayDay;
      const isSameMonth = month === todayMonth;
      const isToday = isSameDay && isSameMonth;
      
      console.log('NovoAtendimento - Resultado da comparação:', {
        isSameDay,
        isSameMonth,
        isToday
      });
      
      if (isToday) {
        const age = today.getFullYear() - year;
        console.log('NovoAtendimento - É aniversário! Idade:', age);
        
        toast.success(
          `🎉 Hoje é aniversário desta pessoa! ${age} anos`,
          {
            duration: 8000,
            description: "Não esqueça de parabenizar!"
          }
        );
      } else {
        console.log('NovoAtendimento - Não é aniversário hoje');
      }
    } catch (error) {
      console.error('NovoAtendimento - Erro ao processar data:', error);
    }
  }, []);

  const handleDataNascimentoChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    console.log('NovoAtendimento - Data de nascimento alterada para:', value);
    
    setDataNascimento(value);
    setFormData(prev => ({
      ...prev,
      dataNascimento: value,
    }));
    
    if (value) {
      checkIfBirthday(value);
    }
    
    if (value) {
      // Corrigir problema de timezone - processar data como string sem conversão
      const [year, month, day] = value.split('-').map(Number);
      
      let signoCalculado = "";
      if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) signoCalculado = "Áries";
      else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) signoCalculado = "Touro";
      else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) signoCalculado = "Gêmeos";
      else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) signoCalculado = "Câncer";
      else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) signoCalculado = "Leão";
      else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) signoCalculado = "Virgem";
      else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) signoCalculado = "Libra";
      else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) signoCalculado = "Escorpião";
      else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) signoCalculado = "Sagitário";
      else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) signoCalculado = "Capricórnio";
      else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) signoCalculado = "Aquário";
      else signoCalculado = "Peixes";
      
      setSigno(signoCalculado);
    } else {
      setSigno("");
    }
  }, [checkIfBirthday]);

  return {
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
    handleInputChange,
    handleSelectChange,
    handlePlanoDataChange,
    handleSemanalDataChange,
    handlePacoteDataChange: (field: string, value: string) => {
      console.log('🔍 HOOK - handlePacoteDataChange chamado:', { field, value });
      handlePacoteDataChange(field, value);
    },
    handlePacoteDiaChange: (id: string, field: string, value: string) => {
      console.log('🔍 HOOK - handlePacoteDiaChange chamado:', { id, field, value });
      handlePacoteDiaChange(id, field, value);
    },
    handleDataNascimentoChange,
    setAtencao,
    setPlanoAtivo,
    setSemanalAtivo,
    setPacoteAtivo: (value: boolean) => {
      console.log('🔍 HOOK - setPacoteAtivo chamado:', value);
      setPacoteAtivo(value);
    },
  };
};

export default useAtendimentoForm;
