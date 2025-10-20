
interface AtendimentoData {
  id: string;
  nome: string;
  dataNascimento?: string;
  telefone?: string;
  signo?: string;
  tipoServico: string;
  statusPagamento: 'pago' | 'pendente' | 'parcelado';
  dataAtendimento: string;
  valor: string;
  destino?: string;
  cidade?: string;
  ano?: string;
  atencaoNota?: string;
  detalhes?: string;
  tratamento?: string;
  indicacao?: string;
  atencaoFlag?: boolean;
  data?: string;
  dataUltimaEdicao?: string;
  planoAtivo?: boolean;
  planoData?: {
    meses: string;
    valorMensal: string;
    diaVencimento?: string;
  } | null;
  semanalAtivo?: boolean;
  semanalData?: {
    semanas: string;
    valorSemanal: string;
    diaVencimento?: string;
  } | null;
  pacoteAtivo?: boolean;
  pacoteData?: {
    dias: string;
    pacoteDias: Array<{
      id: string;
      data: string;
      valor: string;
    }>;
  } | null;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

// Background sync with API
const syncWithAPI = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    const response = await fetch(`${API_URL}/api/atendimentos`, {
      headers: getAuthHeaders()
    });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("atendimentos", JSON.stringify(data));
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
};

export const useAtendimentoService = () => {
  // Sync in background on initialization
  syncWithAPI();

  const getAtendimentos = (): AtendimentoData[] => {
    try {
      const data = localStorage.getItem("atendimentos");
      return data ? JSON.parse(data) : [];
    } catch (error) {
      return [];
    }
  };

  const saveAtendimentos = (atendimentos: AtendimentoData[]) => {
    try {
      localStorage.setItem("atendimentos", JSON.stringify(atendimentos));
    } catch (error) {
      // Silent fail
    }
  };

  const createAtendimento = async (atendimento: AtendimentoData): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/atendimentos`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(atendimento)
      });
      
      if (response.ok) {
        // Update local cache
        const atendimentos = getAtendimentos();
        atendimentos.push(atendimento);
        saveAtendimentos(atendimentos);
        // Sync with API
        await syncWithAPI();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating atendimento:', error);
      return false;
    }
  };

  const updateAtendimento = async (id: string, atendimento: AtendimentoData): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/atendimentos/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(atendimento)
      });
      
      if (response.ok) {
        // Update local cache
        const atendimentos = getAtendimentos();
        const index = atendimentos.findIndex(a => a.id === id);
        if (index !== -1) {
          atendimentos[index] = atendimento;
          saveAtendimentos(atendimentos);
        }
        // Sync with API
        await syncWithAPI();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating atendimento:', error);
      return false;
    }
  };

  const deleteAtendimento = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/api/atendimentos/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        // Update local cache
        const atendimentos = getAtendimentos();
        const filtered = atendimentos.filter(a => a.id !== id);
        saveAtendimentos(filtered);
        // Sync with API
        await syncWithAPI();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting atendimento:', error);
      return false;
    }
  };

  const getClientsWithConsultations = () => {
    const atendimentos = getAtendimentos();
    return atendimentos.map(a => ({
      id: a.id,
      nome: a.nome,
      consultations: [a]
    }));
  };

  return {
    getAtendimentos,
    saveAtendimentos,
    createAtendimento,
    updateAtendimento,
    deleteAtendimento,
    getClientsWithConsultations,
  };
};

export type { AtendimentoData };
