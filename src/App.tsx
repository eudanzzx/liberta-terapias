
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import Index from "@/pages/Index";
import NovoAtendimento from "@/pages/NovoAtendimento";
import EditarAtendimento from "@/pages/EditarAtendimento";
import RelatorioGeral from "@/pages/RelatorioGeral";
import RelatorioIndividual from "@/pages/RelatorioIndividual";
import NotFound from "@/pages/NotFound";
import AnaliseFrequencial from "@/pages/AnaliseFrequencial";
import ListagemTarot from "@/pages/ListagemTarot";
import EditarAnaliseFrequencial from "@/pages/EditarAnaliseFrequencial";
import RelatoriosFrequencial from "@/pages/RelatoriosFrequencial";
import RelatoriosFinanceiros from "@/pages/RelatoriosFinanceiros";
import RelatoriosFinanceirosTarot from "@/pages/RelatoriosFinanceirosTarot";
import RelatoriosFrequenciaisTarot from "@/pages/RelatoriosFrequenciaisTarot";
import RelatorioGeralTarot from "@/pages/RelatorioGeralTarot";
import RelatorioIndividualTarot from "@/pages/RelatorioIndividualTarot";
import Login from "@/pages/Login";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  console.log('App - Inicializando aplicação');
  console.log('React version:', React.version);
  console.log('QueryClient:', queryClient);
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/novo-atendimento" element={<ProtectedRoute><NovoAtendimento /></ProtectedRoute>} />
              <Route path="/editar-atendimento/:id" element={<ProtectedRoute><EditarAtendimento /></ProtectedRoute>} />
              <Route path="/relatorio-geral" element={<ProtectedRoute><RelatorioGeral /></ProtectedRoute>} />
              <Route path="/relatorio-geral-tarot" element={<ProtectedRoute><RelatorioGeralTarot /></ProtectedRoute>} />
              <Route path="/relatorio-individual" element={<ProtectedRoute><RelatorioIndividual /></ProtectedRoute>} />
              <Route path="/relatorio-individual-tarot" element={<ProtectedRoute><RelatorioIndividualTarot /></ProtectedRoute>} />
              <Route path="/analise-frequencial" element={<ProtectedRoute><AnaliseFrequencial /></ProtectedRoute>} />
              <Route path="/listagem-tarot" element={<ProtectedRoute><ListagemTarot /></ProtectedRoute>} />
              <Route path="/editar-analise-frequencial/:id" element={<ProtectedRoute><EditarAnaliseFrequencial /></ProtectedRoute>} />
              <Route path="/relatorios-frequencial" element={<ProtectedRoute><RelatoriosFrequencial /></ProtectedRoute>} />
              <Route path="/relatorios-financeiros" element={<ProtectedRoute><RelatoriosFinanceiros /></ProtectedRoute>} />
              <Route path="/relatorios-financeiros-tarot" element={<ProtectedRoute><RelatoriosFinanceirosTarot /></ProtectedRoute>} />
              <Route path="/relatorios-frequenciais-tarot" element={<ProtectedRoute><RelatoriosFrequenciaisTarot /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
