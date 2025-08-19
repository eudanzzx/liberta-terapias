import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from "@/components/Logo";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { DollarSign, TrendingUp, Calendar, Users, Download } from 'lucide-react';
import useUserDataService from "@/services/userDataService";
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';

const RelatoriosFinanceirosTarot = () => {
  const navigate = useNavigate();
  const { getAllTarotAnalyses } = useUserDataService();
  
  const analises = getAllTarotAnalyses();

  const financialData = useMemo(() => {
    let totalValue = 0;
    let totalAnalyses = 0;
    const monthlyData: { [key: string]: number } = {};
    const clientData: { [key: string]: { count: number; value: number } } = {};

    analises.forEach(analise => {
      const value = parseFloat(analise.valor || analise.preco || "0");
      totalValue += value;
      totalAnalyses++;

      // Group by month
      const date = new Date(analise.dataInicio);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[monthKey] = (monthlyData[monthKey] || 0) + value;

      // Group by client
      const client = analise.nomeCliente;
      if (!clientData[client]) {
        clientData[client] = { count: 0, value: 0 };
      }
      clientData[client].count++;
      clientData[client].value += value;
    });

    return {
      totalValue,
      totalAnalyses,
      averageValue: totalAnalyses > 0 ? totalValue / totalAnalyses : 0,
      monthlyData: Object.entries(monthlyData).map(([month, value]) => ({
        month: new Date(month + '-01').toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        value
      })),
      clientData: Object.entries(clientData)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10)
    };
  }, [analises]);

  const generateCustomFinancialReport = () => {
    try {
      const doc = new jsPDF();
      
      // Configurações de cores
      const primaryColor = [103, 49, 147] as const; // Purple
      const secondaryColor = [168, 85, 247] as const; // Light purple
      const textColor = [30, 30, 30] as const;
      const lightGray = [245, 245, 245] as const;
      
      // Header com gradiente visual
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(0, 0, 210, 35, 'F');
      
      // Logo e título
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont(undefined, 'bold');
      doc.text('RELATÓRIO FINANCEIRO', 105, 20, { align: 'center' });
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'normal');
      doc.text('Tarot Frequencial', 105, 28, { align: 'center' });
      
      // Data de geração
      doc.setFontSize(10);
      doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')}`, 20, 45);
      
      // Seção de métricas principais - layout em grid
      let yPos = 55;
      const boxWidth = 40;
      const boxHeight = 25;
      
      // Caixa 1 - Total Arrecadado
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.rect(20, yPos, boxWidth, boxHeight, 'F');
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(0.5);
      doc.rect(20, yPos, boxWidth, boxHeight, 'S');
      
      doc.setTextColor(textColor[0], textColor[1], textColor[2]);
      doc.setFontSize(8);
      doc.text('TOTAL ARRECADADO', 40, yPos + 6, { align: 'center' });
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`R$ ${financialData.totalValue.toFixed(2)}`, 40, yPos + 15, { align: 'center' });
      
      // Caixa 2 - Total de Análises
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.rect(70, yPos, boxWidth, boxHeight, 'F');
      doc.rect(70, yPos, boxWidth, boxHeight, 'S');
      
      doc.setFont(undefined, 'normal');
      doc.setFontSize(8);
      doc.text('TOTAL DE ANÁLISES', 90, yPos + 6, { align: 'center' });
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(financialData.totalAnalyses.toString(), 90, yPos + 15, { align: 'center' });
      
      // Caixa 3 - Valor Médio
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.rect(120, yPos, boxWidth, boxHeight, 'F');
      doc.rect(120, yPos, boxWidth, boxHeight, 'S');
      
      doc.setFont(undefined, 'normal');
      doc.setFontSize(8);
      doc.text('VALOR MÉDIO', 140, yPos + 6, { align: 'center' });
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(`R$ ${financialData.averageValue.toFixed(2)}`, 140, yPos + 15, { align: 'center' });
      
      // Caixa 4 - Clientes Únicos
      doc.setFillColor(lightGray[0], lightGray[1], lightGray[2]);
      doc.rect(170, yPos, boxWidth, boxHeight, 'F');
      doc.rect(170, yPos, boxWidth, boxHeight, 'S');
      
      doc.setFont(undefined, 'normal');
      doc.setFontSize(8);
      doc.text('CLIENTES ÚNICOS', 190, yPos + 6, { align: 'center' });
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.text(financialData.clientData.length.toString(), 190, yPos + 15, { align: 'center' });
      
      yPos += 35;
      
      // Seção Top 5 Clientes
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.text('TOP 5 CLIENTES', 20, yPos);
      
      yPos += 10;
      
      // Tabela compacta dos top clientes
      const topClients = financialData.clientData.slice(0, 5);
      
      // Header da tabela
      doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.rect(20, yPos, 170, 8, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont(undefined, 'bold');
      doc.text('CLIENTE', 25, yPos + 5);
      doc.text('ANÁLISES', 110, yPos + 5);
      doc.text('VALOR TOTAL', 150, yPos + 5);
      
      yPos += 8;
      
      // Dados da tabela
      topClients.forEach((client, index) => {
        const rowColor = index % 2 === 0 ? [255, 255, 255] as const : lightGray;
        doc.setFillColor(rowColor[0], rowColor[1], rowColor[2]);
        doc.rect(20, yPos, 170, 7, 'F');
        
        doc.setTextColor(textColor[0], textColor[1], textColor[2]);
        doc.setFontSize(8);
        doc.setFont(undefined, 'normal');
        doc.text(client.name.substring(0, 25), 25, yPos + 4);
        doc.text(client.count.toString(), 110, yPos + 4);
        doc.text(`R$ ${client.value.toFixed(2)}`, 150, yPos + 4);
        
        yPos += 7;
      });
      
      yPos += 10;
      
      // Seção de Faturamento Mensal
      if (financialData.monthlyData.length > 0) {
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.text('FATURAMENTO MENSAL', 20, yPos);
        
        yPos += 10;
        
        // Mini gráfico de barras textual
        const maxValue = Math.max(...financialData.monthlyData.map(d => d.value));
        
        financialData.monthlyData.slice(0, 6).forEach((month, index) => {
          const barWidth = (month.value / maxValue) * 80;
          
          // Barra
          doc.setFillColor(secondaryColor[0], secondaryColor[1], secondaryColor[2]);
          doc.rect(20, yPos, barWidth, 4, 'F');
          
          // Texto
          doc.setTextColor(textColor[0], textColor[1], textColor[2]);
          doc.setFontSize(8);
          doc.text(`${month.month}: R$ ${month.value.toFixed(2)}`, 110, yPos + 3);
          
          yPos += 8;
        });
      }
      
      // Linha decorativa no final
      doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setLineWidth(1);
      doc.line(20, 280, 190, 280);
      
      // Footer
      doc.setTextColor(150, 150, 150);
      doc.setFontSize(8);
      doc.text('Libertá - Sistema de Gestão', 105, 290, { align: 'center' });
      
      // Salvar o PDF
      const fileName = `Relatorio_Financeiro_Tarot_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
      doc.save(fileName);
      
      toast.success('Relatório financeiro personalizado gerado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('Erro ao gerar relatório financeiro');
    }
  };

  const COLORS = ['#8B5CF6', '#A78BFA', '#C4B5FD', '#DDD6FE', '#EDE9FE'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-violet-50 to-purple-100">
      <DashboardHeader />

      <main className="pt-20 p-2 sm:p-4">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="transform hover:scale-110 transition-all duration-300">
              <Logo height={40} width={40} className="sm:h-[50px] sm:w-[50px]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent">
                Relatórios Financeiros - Tarot
              </h1>
              <p className="text-purple-600/80 mt-1 text-sm sm:text-base">Análise financeira das consultas de Tarot</p>
            </div>
          </div>
          
          <Button
            onClick={generateCustomFinancialReport}
            className="bg-[#673193] hover:bg-[#673193]/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
          >
            <Download className="h-4 w-4 mr-2" />
            <span>Relatório PDF</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
          <Card className="bg-white/90 backdrop-blur-sm border border-white/30 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
              <div className="flex justify-between items-center">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">Total Arrecadado</p>
                  <p className="text-lg sm:text-3xl font-bold text-slate-800 truncate">R$ {financialData.totalValue.toFixed(2)}</p>
                </div>
                <div className="rounded-xl p-2 sm:p-3 bg-purple-600/10 flex-shrink-0">
                  <DollarSign className="h-5 w-5 sm:h-8 sm:w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border border-white/30 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
              <div className="flex justify-between items-center">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">Total de Análises</p>
                  <p className="text-lg sm:text-3xl font-bold text-slate-800">{financialData.totalAnalyses}</p>
                </div>
                <div className="rounded-xl p-2 sm:p-3 bg-purple-600/10 flex-shrink-0">
                  <Calendar className="h-5 w-5 sm:h-8 sm:w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border border-white/30 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
              <div className="flex justify-between items-center">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">Valor Médio</p>
                  <p className="text-lg sm:text-3xl font-bold text-slate-800 truncate">R$ {financialData.averageValue.toFixed(2)}</p>
                </div>
                <div className="rounded-xl p-2 sm:p-3 bg-purple-600/10 flex-shrink-0">
                  <TrendingUp className="h-5 w-5 sm:h-8 sm:w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border border-white/30 shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300">
            <CardContent className="pt-4 sm:pt-6 p-3 sm:p-6">
              <div className="flex justify-between items-center">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">Clientes Únicos</p>
                  <p className="text-lg sm:text-3xl font-bold text-slate-800">{financialData.clientData.length}</p>
                </div>
                <div className="rounded-xl p-2 sm:p-3 bg-purple-600/10 flex-shrink-0">
                  <Users className="h-5 w-5 sm:h-8 sm:w-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 mb-8">
          {/* Monthly Revenue */}
          <Card className="bg-white/90 backdrop-blur-sm border border-white/30 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-purple-800 text-lg sm:text-xl">Faturamento Mensal</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-6">
              <div className="h-[250px] sm:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={financialData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="month" 
                      fontSize={10}
                      interval={0}
                      angle={-45}
                      textAnchor="end"
                      height={50}
                    />
                    <YAxis fontSize={10} />
                    <Tooltip 
                      formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Valor']}
                      contentStyle={{ fontSize: '12px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Clients */}
          <Card className="bg-white/90 backdrop-blur-sm border border-white/30 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-purple-800 text-lg sm:text-xl">Top 10 Clientes (Valor)</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-6">
              <div className="h-[250px] sm:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialData.clientData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      fontSize={9}
                      interval={0}
                    />
                    <YAxis fontSize={10} />
                    <Tooltip 
                      formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Valor Total']}
                      contentStyle={{ fontSize: '12px' }}
                    />
                    <Bar dataKey="value" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Client Distribution */}
          <Card className="bg-white/90 backdrop-blur-sm border border-white/30 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-purple-800 text-lg sm:text-xl">Distribuição por Cliente</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-6">
              <div className="h-[250px] sm:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={financialData.clientData.slice(0, 5)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name.substring(0, 8)} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={60}
                      fill="#8884d8"
                      dataKey="value"
                      fontSize={10}
                    >
                      {financialData.clientData.slice(0, 5).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: number) => [`R$ ${value.toFixed(2)}`, 'Valor Total']}
                      contentStyle={{ fontSize: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Count by Client */}
          <Card className="bg-white/90 backdrop-blur-sm border border-white/30 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="pb-2">
              <CardTitle className="text-purple-800 text-lg sm:text-xl">Análises por Cliente</CardTitle>
            </CardHeader>
            <CardContent className="p-2 sm:p-6">
              <div className="h-[250px] sm:h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialData.clientData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="name" 
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      fontSize={9}
                      interval={0}
                    />
                    <YAxis fontSize={10} />
                    <Tooltip 
                      formatter={(value: number) => [value, 'Análises']}
                      contentStyle={{ fontSize: '12px' }}
                    />
                    <Bar dataKey="count" fill="#A78BFA" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default RelatoriosFinanceirosTarot;
