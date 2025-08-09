# 📄 Sistema de Relatórios PDF Profissionais

## 🎯 Inspirado no FineShape - Relatórios de Classe Mundial

### **1. Template HTML/CSS Profissional**

#### **Estrutura Base do Relatório**
```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório de Avaliação Física - {{cliente.nome}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #2d3748;
            background: white;
        }
        
        .container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 20mm;
            min-height: 297mm;
        }
        
        /* Header com logo e informações */
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #4a90e2;
        }
        
        .logo-section {
            flex: 1;
        }
        
        .logo {
            font-size: 24px;
            font-weight: 700;
            color: #4a90e2;
            margin-bottom: 5px;
        }
        
        .tagline {
            font-size: 11px;
            color: #718096;
        }
        
        .report-info {
            text-align: right;
            font-size: 11px;
            color: #4a5568;
        }
        
        /* Seção do cliente */
        .client-section {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 25px;
        }
        
        .client-name {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 10px;
        }
        
        .client-details {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 15px;
            font-size: 11px;
        }
        
        .client-detail {
            text-align: center;
        }
        
        .detail-label {
            opacity: 0.8;
            margin-bottom: 2px;
            text-transform: uppercase;
            font-size: 9px;
            letter-spacing: 0.5px;
        }
        
        .detail-value {
            font-weight: 600;
            font-size: 14px;
        }
        
        /* Resumo executivo */
        .executive-summary {
            background: #f7fafc;
            border-left: 4px solid #48bb78;
            padding: 20px;
            margin-bottom: 25px;
            border-radius: 0 8px 8px 0;
        }
        
        .summary-title {
            font-size: 16px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 12px;
            display: flex;
            align-items: center;
        }
        
        .summary-icon {
            margin-right: 8px;
            font-size: 18px;
        }
        
        /* Grid de indicadores */
        .indicators-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-bottom: 25px;
        }
        
        .indicator-card {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .indicator-label {
            font-size: 10px;
            color: #718096;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
        }
        
        .indicator-value {
            font-size: 24px;
            font-weight: 700;
            color: #2d3748;
            margin-bottom: 3px;
        }
        
        .indicator-classification {
            font-size: 10px;
            padding: 2px 8px;
            border-radius: 12px;
            font-weight: 500;
        }
        
        .classification-excellent { background: #c6f6d5; color: #22543d; }
        .classification-good { background: #bee3f8; color: #2a4365; }
        .classification-normal { background: #fef5e7; color: #744210; }
        .classification-attention { background: #fed7d7; color: #742a2a; }
        
        /* Gráficos */
        .charts-section {
            margin-bottom: 25px;
        }
        
        .section-title {
            font-size: 16px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e2e8f0;
        }
        
        .charts-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        .chart-container {
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
            height: 200px;
            position: relative;
        }
        
        .chart-title {
            font-size: 12px;
            font-weight: 600;
            color: #4a5568;
            margin-bottom: 10px;
            text-align: center;
        }
        
        /* Tabela de medidas */
        .measurements-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 25px;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .measurements-table th {
            background: #4a90e2;
            color: white;
            padding: 12px 10px;
            font-weight: 600;
            font-size: 11px;
            text-align: left;
        }
        
        .measurements-table td {
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 11px;
        }
        
        .measurements-table tr:nth-child(even) {
            background: #f8f9fa;
        }
        
        .measurement-value {
            font-weight: 600;
            color: #2d3748;
        }
        
        /* Análise e recomendações */
        .analysis-section {
            background: #f7fafc;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 25px;
        }
        
        .analysis-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        .analysis-item {
            background: white;
            border-radius: 6px;
            padding: 15px;
        }
        
        .analysis-item h4 {
            font-size: 13px;
            font-weight: 600;
            color: #2d3748;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
        }
        
        .analysis-item ul {
            list-style: none;
        }
        
        .analysis-item li {
            padding: 3px 0;
            font-size: 11px;
            position: relative;
            padding-left: 15px;
        }
        
        .analysis-item li:before {
            content: "•";
            color: #4a90e2;
            font-weight: bold;
            position: absolute;
            left: 0;
        }
        
        /* Comparação temporal */
        .comparison-section {
            margin-bottom: 25px;
        }
        
        .comparison-table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .comparison-table th {
            background: #805ad5;
            color: white;
            padding: 12px 10px;
            font-weight: 600;
            font-size: 11px;
            text-align: center;
        }
        
        .comparison-table td {
            padding: 10px;
            border-bottom: 1px solid #e2e8f0;
            font-size: 11px;
            text-align: center;
        }
        
        .variation-positive {
            color: #22543d;
            background: #c6f6d5;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 600;
        }
        
        .variation-negative {
            color: #742a2a;
            background: #fed7d7;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 600;
        }
        
        .variation-neutral {
            color: #4a5568;
            background: #e2e8f0;
            padding: 2px 6px;
            border-radius: 4px;
            font-weight: 600;
        }
        
        /* Footer */
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            font-size: 10px;
            color: #718096;
            text-align: center;
        }
        
        .footer-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 15px;
        }
        
        .footer-section h5 {
            font-weight: 600;
            color: #4a5568;
            margin-bottom: 5px;
        }
        
        /* Quebras de página */
        .page-break {
            page-break-before: always;
        }
        
        /* Gráficos usando CSS */
        .progress-bar {
            width: 100%;
            height: 20px;
            background: #e2e8f0;
            border-radius: 10px;
            overflow: hidden;
            position: relative;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4a90e2, #667eea);
            border-radius: 10px;
            transition: width 0.3s ease;
        }
        
        .progress-text {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 10px;
            font-weight: 600;
            color: white;
        }
        
        /* Responsividade para impressão */
        @media print {
            body { 
                font-size: 11px; 
                -webkit-print-color-adjust: exact;
            }
            .container { 
                padding: 15mm; 
            }
            .page-break { 
                page-break-before: always; 
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <header class="header">
            <div class="logo-section">
                <div class="logo">APC FIT PRO</div>
                <div class="tagline">Avaliação • Prescrição • Controle</div>
            </div>
            <div class="report-info">
                <div><strong>Relatório de Avaliação Física</strong></div>
                <div>Data: {{data_avaliacao}}</div>
                <div>Código: #{{codigo_avaliacao}}</div>
            </div>
        </header>
        
        <!-- Seção do Cliente -->
        <section class="client-section">
            <div class="client-name">{{cliente.nome}}</div>
            <div class="client-details">
                <div class="client-detail">
                    <div class="detail-label">Idade</div>
                    <div class="detail-value">{{cliente.idade}} anos</div>
                </div>
                <div class="client-detail">
                    <div class="detail-label">Sexo</div>
                    <div class="detail-value">{{cliente.sexo}}</div>
                </div>
                <div class="client-detail">
                    <div class="detail-label">Altura</div>
                    <div class="detail-value">{{cliente.altura}} cm</div>
                </div>
                <div class="client-detail">
                    <div class="detail-label">Peso</div>
                    <div class="detail-value">{{avaliacao.peso}} kg</div>
                </div>
            </div>
        </section>
        
        <!-- Resumo Executivo -->
        <section class="executive-summary">
            <h3 class="summary-title">
                <span class="summary-icon">📊</span>
                Resumo Executivo
            </h3>
            <p>{{resumo_executivo}}</p>
        </section>
        
        <!-- Grid de Indicadores Principais -->
        <section class="indicators-grid">
            <div class="indicator-card">
                <div class="indicator-label">IMC</div>
                <div class="indicator-value">{{imc.valor}}</div>
                <div class="indicator-classification {{imc.classe_css}}">
                    {{imc.classificacao}}
                </div>
            </div>
            <div class="indicator-card">
                <div class="indicator-label">% Gordura</div>
                <div class="indicator-value">{{percentual_gordura.valor}}%</div>
                <div class="indicator-classification {{percentual_gordura.classe_css}}">
                    {{percentual_gordura.classificacao}}
                </div>
            </div>
            <div class="indicator-card">
                <div class="indicator-label">Massa Magra</div>
                <div class="indicator-value">{{massa_magra.valor}} kg</div>
                <div class="indicator-classification {{massa_magra.classe_css}}">
                    {{massa_magra.classificacao}}
                </div>
            </div>
        </section>
        
        <!-- Seção de Gráficos -->
        <section class="charts-section">
            <h3 class="section-title">📈 Análise Visual</h3>
            <div class="charts-grid">
                <div class="chart-container">
                    <div class="chart-title">Composição Corporal</div>
                    <!-- Gráfico de pizza em CSS/SVG -->
                    <div id="composition-chart">{{{grafico_composicao}}}</div>
                </div>
                <div class="chart-container">
                    <div class="chart-title">Distribuição de Gordura</div>
                    <!-- Gráfico de barras -->
                    <div id="distribution-chart">{{{grafico_distribuicao}}}</div>
                </div>
            </div>
        </section>
        
        <!-- Tabela de Medidas Detalhadas -->
        <section>
            <h3 class="section-title">📏 Medidas Detalhadas</h3>
            <table class="measurements-table">
                <thead>
                    <tr>
                        <th>Medida</th>
                        <th>Valor</th>
                        <th>Classificação</th>
                        <th>Observações</th>
                    </tr>
                </thead>
                <tbody>
                    {{#each medidas}}
                    <tr>
                        <td>{{this.nome}}</td>
                        <td class="measurement-value">{{this.valor}} {{this.unidade}}</td>
                        <td>
                            <span class="indicator-classification {{this.classe_css}}">
                                {{this.classificacao}}
                            </span>
                        </td>
                        <td>{{this.observacao}}</td>
                    </tr>
                    {{/each}}
                </tbody>
            </table>
        </section>
        
        <!-- Nova página -->
        <div class="page-break"></div>
        
        <!-- Análise e Recomendações -->
        <section class="analysis-section">
            <h3 class="section-title">🎯 Análise e Recomendações</h3>
            <div class="analysis-grid">
                <div class="analysis-item">
                    <h4>✅ Pontos Fortes</h4>
                    <ul>
                        {{#each pontos_fortes}}
                        <li>{{this}}</li>
                        {{/each}}
                    </ul>
                </div>
                <div class="analysis-item">
                    <h4>⚠️ Pontos de Atenção</h4>
                    <ul>
                        {{#each pontos_atencao}}
                        <li>{{this}}</li>
                        {{/each}}
                    </ul>
                </div>
                <div class="analysis-item">
                    <h4>🏋️ Recomendações de Treino</h4>
                    <ul>
                        {{#each recomendacoes_treino}}
                        <li>{{this}}</li>
                        {{/each}}
                    </ul>
                </div>
                <div class="analysis-item">
                    <h4>🥗 Recomendações Nutricionais</h4>
                    <ul>
                        {{#each recomendacoes_nutricao}}
                        <li>{{this}}</li>
                        {{/each}}
                    </ul>
                </div>
            </div>
        </section>
        
        <!-- Comparação Temporal (se houver avaliações anteriores) -->
        {{#if avaliacoes_anteriores}}
        <section class="comparison-section">
            <h3 class="section-title">📊 Evolução Temporal</h3>
            <table class="comparison-table">
                <thead>
                    <tr>
                        <th>Indicador</th>
                        <th>Avaliação Anterior</th>
                        <th>Avaliação Atual</th>
                        <th>Variação</th>
                        <th>Tendência</th>
                    </tr>
                </thead>
                <tbody>
                    {{#each evolucao}}
                    <tr>
                        <td>{{this.indicador}}</td>
                        <td>{{this.valor_anterior}}</td>
                        <td>{{this.valor_atual}}</td>
                        <td>
                            <span class="{{this.variacao_classe}}">
                                {{this.variacao_texto}}
                            </span>
                        </td>
                        <td>{{this.tendencia}}</td>
                    </tr>
                    {{/each}}
                </tbody>
            </table>
        </section>
        {{/if}}
        
        <!-- Metas e Objetivos -->
        <section class="analysis-section">
            <h3 class="section-title">🎯 Metas e Objetivos</h3>
            <div class="analysis-grid">
                {{#each metas}}
                <div class="analysis-item">
                    <h4>{{this.titulo}}</h4>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: {{this.progresso}}%"></div>
                        <div class="progress-text">{{this.progresso}}%</div>
                    </div>
                    <p style="margin-top: 8px; font-size: 10px; color: #4a5568;">
                        {{this.descricao}}
                    </p>
                </div>
                {{/each}}
            </div>
        </section>
        
        <!-- Footer -->
        <footer class="footer">
            <div class="footer-grid">
                <div class="footer-section">
                    <h5>Personal Trainer</h5>
                    <p>{{personal.nome}}</p>
                    <p>CREF: {{personal.cref}}</p>
                    <p>{{personal.contato}}</p>
                </div>
                <div class="footer-section">
                    <h5>Metodologia</h5>
                    <p>Protocolo: {{protocolo_utilizado}}</p>
                    <p>Equação: {{equacao_utilizada}}</p>
                    <p>Precisão: ±{{margem_erro}}%</p>
                </div>
                <div class="footer-section">
                    <h5>Observações</h5>
                    <p>Avaliação realizada em condições controladas</p>
                    <p>Resultados podem variar com hidratação e alimentação</p>
                    <p>Reavaliar em {{proxima_avaliacao}} semanas</p>
                </div>
            </div>
            <div style="text-align: center; margin-top: 15px; font-size: 9px; color: #a0aec0;">
                Relatório gerado automaticamente pelo sistema APC FIT PRO em {{data_geracao}}
            </div>
        </footer>
    </div>
</body>
</html>
```

### **2. Geração de Gráficos em SVG**

#### **Componente para Gráfico de Pizza (Composição Corporal)**
```typescript
// src/utils/charts/pie-chart-svg.ts
export function generateCompositionPieChart(data: {
  percentualGordura: number;
  massaMuscular: number;
  musculoEsqueletico: number;
  outros: number;
}): string {
  const { percentualGordura, massaMuscular, musculoEsqueletico, outros } = data;
  
  const radius = 80;
  const cx = 100;
  const cy = 100;
  const total = 100;
  
  let cumulativePercentage = 0;
  
  const createSlice = (percentage: number, color: string) => {
    const startAngle = cumulativePercentage * 360;
    const endAngle = (cumulativePercentage + percentage / total) * 360;
    
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const largeArcFlag = percentage > 50 ? 1 : 0;
    
    const x1 = cx + radius * Math.cos(startAngleRad);
    const y1 = cy + radius * Math.sin(startAngleRad);
    const x2 = cx + radius * Math.cos(endAngleRad);
    const y2 = cy + radius * Math.sin(endAngleRad);
    
    const pathData = [
      `M ${cx} ${cy}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      'Z'
    ].join(' ');
    
    cumulativePercentage += percentage / total;
    
    return `<path d="${pathData}" fill="${color}" stroke="#fff" stroke-width="2"/>`;
  };
  
  const slices = [
    createSlice(percentualGordura, '#ef4444'),     // Vermelho - Gordura
    createSlice(massaMuscular, '#3b82f6'),        // Azul - Massa Muscular  
    createSlice(musculoEsqueletico, '#10b981'),   // Verde - Músculo Esquelético
    createSlice(outros, '#e5e7eb')                // Cinza - Outros
  ];
  
  return `
    <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
      ${slices.join('')}
      
      <!-- Legenda -->
      <g transform="translate(210, 20)">
        <rect x="0" y="0" width="15" height="15" fill="#ef4444"/>
        <text x="20" y="12" font-size="12" font-family="Inter">Gordura (${percentualGordura}%)</text>
        
        <rect x="0" y="25" width="15" height="15" fill="#3b82f6"/>
        <text x="20" y="37" font-size="12" font-family="Inter">M. Muscular (${massaMuscular}%)</text>
        
        <rect x="0" y="50" width="15" height="15" fill="#10b981"/>
        <text x="20" y="62" font-size="12" font-family="Inter">M. Esquelético (${musculoEsqueletico}%)</text>
        
        <rect x="0" y="75" width="15" height="15" fill="#e5e7eb"/>
        <text x="20" y="87" font-size="12" font-family="Inter">Outros (${outros}%)</text>
      </g>
    </svg>
  `;
}
```

#### **Gráfico de Barras para Distribuição de Gordura**
```typescript
// src/utils/charts/bar-chart-svg.ts
export function generateDistributionBarChart(dobras: Record<string, number>): string {
  const maxValue = Math.max(...Object.values(dobras));
  const barWidth = 25;
  const barSpacing = 35;
  const chartHeight = 150;
  const chartWidth = Object.keys(dobras).length * barSpacing;
  
  const bars = Object.entries(dobras).map(([nome, valor], index) => {
    const barHeight = (valor / maxValue) * chartHeight;
    const x = index * barSpacing + 10;
    const y = chartHeight - barHeight + 20;
    
    return `
      <rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" 
            fill="#4a90e2" stroke="none" rx="2"/>
      <text x="${x + barWidth/2}" y="${chartHeight + 35}" 
            text-anchor="middle" font-size="10" font-family="Inter"
            transform="rotate(-45, ${x + barWidth/2}, ${chartHeight + 35})">
        ${nome}
      </text>
      <text x="${x + barWidth/2}" y="${y - 5}" 
            text-anchor="middle" font-size="10" font-family="Inter" font-weight="600">
        ${valor}mm
      </text>
    `;
  }).join('');
  
  return `
    <svg width="${chartWidth + 20}" height="${chartHeight + 60}" 
         viewBox="0 0 ${chartWidth + 20} ${chartHeight + 60}" 
         xmlns="http://www.w3.org/2000/svg">
      
      <!-- Linha base -->
      <line x1="10" y1="${chartHeight + 20}" x2="${chartWidth}" y2="${chartHeight + 20}" 
            stroke="#e2e8f0" stroke-width="1"/>
      
      ${bars}
    </svg>
  `;
}
```

### **3. Serviço de Geração de PDF**

#### **PDF Service com Templates Dinâmicos**
```typescript
// src/services/pdf/pdf-relatorio.service.ts
import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';

export class PDFRelatorioService {
  private templateCache = new Map<string, HandlebarsTemplateDelegate>();
  
  async gerarRelatorioProfissional(
    avaliacaoId: string,
    opcoes: OpcoesRelatorio = {}
  ): Promise<Buffer> {
    
    // 1. Buscar dados da avaliação
    const dadosCompletos = await this.compilarDadosRelatorio(avaliacaoId);
    
    // 2. Processar dados para o template
    const dadosProcessados = await this.processarDadosTemplate(dadosCompletos);
    
    // 3. Gerar gráficos SVG
    const graficos = await this.gerarGraficos(dadosCompletos);
    
    // 4. Compilar template HTML
    const htmlFinal = await this.compilarTemplate('relatorio-profissional', {
      ...dadosProcessados,
      ...graficos,
      opcoes
    });
    
    // 5. Gerar PDF com Puppeteer
    return await this.gerarPDFPuppeteer(htmlFinal, opcoes);
  }
  
  private async compilarDadosRelatorio(avaliacaoId: string) {
    const avaliacao = await this.avaliacaoService.buscarCompleta(avaliacaoId);
    const cliente = await this.userService.buscarPorId(avaliacao.cliente_id);
    const personal = await this.userService.buscarPorId(avaliacao.personal_id);
    
    // Buscar avaliações anteriores para comparação
    const avaliacoesAnteriores = await this.avaliacaoService.buscarHistorico(
      avaliacao.cliente_id, 
      5
    );
    
    // Buscar metas do cliente
    const metas = await this.metasService.buscarPorCliente(avaliacao.cliente_id);
    
    return {
      avaliacao,
      cliente,
      personal,
      avaliacoesAnteriores,
      metas,
      dadosEvolucao: this.calcularEvolucao(avaliacoesAnteriores)
    };
  }
  
  private async processarDadosTemplate(dados: any) {
    const { avaliacao, cliente, personal } = dados;
    
    return {
      // Dados básicos
      cliente: {
        nome: cliente.nome,
        idade: this.calcularIdade(cliente.data_nascimento),
        sexo: cliente.genero === 'masculino' ? 'Masculino' : 'Feminino',
        altura: cliente.altura || avaliacao.altura
      },
      
      personal: {
        nome: personal.nome,
        cref: personal.cref || 'Não informado',
        contato: personal.email
      },
      
      // Dados da avaliação
      data_avaliacao: this.formatarData(avaliacao.data_avaliacao),
      codigo_avaliacao: avaliacao.id.substring(0, 8).toUpperCase(),
      protocolo_utilizado: avaliacao.protocolo,
      
      // Indicadores principais
      imc: {
        valor: avaliacao.resultados.imc.toFixed(1),
        classificacao: this.classificarIMC(avaliacao.resultados.imc),
        classe_css: this.obterClasseCSS('imc', avaliacao.resultados.imc)
      },
      
      percentual_gordura: {
        valor: avaliacao.resultados.percentualGordura.toFixed(1),
        classificacao: this.classificarPercentualGordura(
          avaliacao.resultados.percentualGordura, 
          cliente.genero, 
          this.calcularIdade(cliente.data_nascimento)
        ),
        classe_css: this.obterClasseCSS('gordura', avaliacao.resultados.percentualGordura)
      },
      
      massa_magra: {
        valor: avaliacao.resultados.massaMagra.toFixed(1),
        classificacao: this.classificarMassaMagra(avaliacao.resultados.massaMagra),
        classe_css: this.obterClasseCSS('massa_magra', avaliacao.resultados.massaMagra)
      },
      
      // Resumo executivo inteligente
      resumo_executivo: await this.gerarResumoExecutivo(dados),
      
      // Medidas detalhadas
      medidas: this.formatarMedidasDetalhadas(avaliacao),
      
      // Análise e recomendações
      pontos_fortes: await this.analisarPontosFortes(dados),
      pontos_atencao: await this.analisarPontosAtencao(dados),
      recomendacoes_treino: await this.gerarRecomendacoesTreino(dados),
      recomendacoes_nutricao: await this.gerarRecomendacoesNutricao(dados),
      
      // Evolução temporal
      evolucao: dados.dadosEvolucao,
      
      // Metas e progresso
      metas: this.processarMetas(dados.metas, avaliacao),
      
      // Metadados
      data_geracao: this.formatarDataHora(new Date()),
      margem_erro: this.calcularMargemErro(avaliacao.protocolo),
      proxima_avaliacao: this.calcularProximaAvaliacao(avaliacao.data_avaliacao)
    };
  }
  
  private async gerarGraficos(dados: any) {
    const { avaliacao } = dados;
    const resultados = avaliacao.resultados;
    
    // Dados para gráfico de composição corporal
    const composicaoData = {
      percentualGordura: resultados.percentualGordura,
      massaMuscular: (resultados.massaMuscular / avaliacao.peso) * 100,
      musculoEsqueletico: (resultados.musculoEsqueletico / avaliacao.peso) * 100,
      outros: 100 - resultados.percentualGordura - 
              ((resultados.massaMuscular + resultados.musculoEsqueletico) / avaliacao.peso) * 100
    };
    
    // Dados para gráfico de distribuição
    const distribuicaoData = avaliacao.dobras || {};
    
    return {
      grafico_composicao: generateCompositionPieChart(composicaoData),
      grafico_distribuicao: generateDistributionBarChart(distribuicaoData)
    };
  }
  
  private async compilarTemplate(nomeTemplate: string, dados: any): Promise<string> {
    if (!this.templateCache.has(nomeTemplate)) {
      const templatePath = join(__dirname, '../../../templates', `${nomeTemplate}.hbs`);
      const templateSource = readFileSync(templatePath, 'utf8');
      const template = Handlebars.compile(templateSource);
      this.templateCache.set(nomeTemplate, template);
    }
    
    const template = this.templateCache.get(nomeTemplate)!;
    return template(dados);
  }
  
  private async gerarPDFPuppeteer(html: string, opcoes: OpcoesRelatorio): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    try {
      const page = await browser.newPage();
      
      // Configurar viewport e conteúdo
      await page.setViewport({ width: 1200, height: 1600 });
      await page.setContent(html, { waitUntil: 'networkidle0' });
      
      // Gerar PDF com configurações profissionais
      const pdfBuffer = await page.pdf({
        format: 'A4',
        margin: {
          top: '20mm',
          right: '15mm',
          bottom: '20mm',
          left: '15mm'
        },
        printBackground: true,
        preferCSSPageSize: true,
        displayHeaderFooter: false
      });
      
      return pdfBuffer;
      
    } finally {
      await browser.close();
    }
  }
  
  // Métodos auxiliares de análise inteligente
  private async gerarResumoExecutivo(dados: any): Promise<string> {
    const { avaliacao, cliente } = dados;
    const resultados = avaliacao.resultados;
    
    // Análise baseada em IA ou regras de negócio
    const idade = this.calcularIdade(cliente.data_nascimento);
    const classificacaoGordura = this.classificarPercentualGordura(
      resultados.percentualGordura, 
      cliente.genero, 
      idade
    );
    
    // Template de resumo baseado nos resultados
    if (classificacaoGordura === 'Adequado') {
      return `Excelente! Sua composição corporal está dentro da faixa ideal para ${cliente.genero === 'masculino' ? 'homens' : 'mulheres'} de ${idade} anos. Com ${resultados.percentualGordura.toFixed(1)}% de gordura corporal e ${resultados.massaMagra.toFixed(1)}kg de massa magra, você apresenta um perfil saudável e equilibrado. Continue mantendo seus hábitos atuais e considere pequenos ajustes para otimização.`;
    }
    
    if (resultados.percentualGordura > 20) { // para homens
      return `Sua avaliação indica oportunidades importantes de melhoria. Com ${resultados.percentualGordura.toFixed(1)}% de gordura corporal, está acima da faixa recomendada. Sua massa magra de ${resultados.massaMagra.toFixed(1)}kg é uma base sólida para implementar um programa focado em redução de gordura. Recomendamos ajustes no treino e nutrição para alcançar seus objetivos.`;
    }
    
    return `Sua composição corporal apresenta aspectos positivos e áreas para desenvolvimento. Continue acompanhando os indicadores e implementando as recomendações personalizadas para otimizar seus resultados.`;
  }
  
  private async analisarPontosFortes(dados: any): Promise<string[]> {
    const { avaliacao } = dados;
    const resultados = avaliacao.resultados;
    const pontos: string[] = [];
    
    if (resultados.imc >= 18.5 && resultados.imc <= 24.9) {
      pontos.push('IMC dentro da faixa normal e saudável');
    }
    
    if (resultados.massaMagra > 50) { // ajustar por gênero
      pontos.push('Excelente quantidade de massa muscular');
    }
    
    if (resultados.percentualGordura < 15) { // para homens
      pontos.push('Baixo percentual de gordura corporal');
    }
    
    return pontos.length > 0 ? pontos : ['Boa base para desenvolvimento corporal'];
  }
  
  private async analisarPontosAtencao(dados: any): Promise<string[]> {
    const { avaliacao } = dados;
    const resultados = avaliacao.resultados;
    const pontos: string[] = [];
    
    if (resultados.percentualGordura > 20) { // homens
      pontos.push('Percentual de gordura acima do recomendado');
    }
    
    if (resultados.imc > 25) {
      pontos.push('IMC acima da faixa normal - atenção ao peso');
    }
    
    if (resultados.massaMagra < 45) { // ajustar por gênero
      pontos.push('Massa muscular pode ser desenvolvida');
    }
    
    return pontos.length > 0 ? pontos : ['Manter monitoramento regular'];
  }
}

interface OpcoesRelatorio {
  incluirGraficos?: boolean;
  incluirEvolucao?: boolean;
  incluirRecomendacoes?: boolean;
  template?: 'completo' | 'resumido' | 'tecnico';
}
```

### **4. Controller para Geração de PDF**

```typescript
// src/controllers/relatorios.controller.ts
export class RelatoriosController {
  constructor(
    private pdfService: PDFRelatorioService,
    private avaliacaoService: AvaliacaoService
  ) {}
  
  async gerarRelatorioProfissional(req: Request, res: Response) {
    try {
      const { avaliacaoId } = req.params;
      const opcoes = req.body as OpcoesRelatorio;
      
      // Verificar permissões
      await this.verificarPermissoes(req.user.id, avaliacaoId);
      
      // Gerar PDF
      const pdfBuffer = await this.pdfService.gerarRelatorioProfissional(
        avaliacaoId, 
        opcoes
      );
      
      // Configurar headers para download
      const avaliacao = await this.avaliacaoService.buscarPorId(avaliacaoId);
      const nomeArquivo = `relatorio-avaliacao-${avaliacao.cliente.nome}-${new Date().toISOString().split('T')[0]}.pdf`;
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${nomeArquivo}"`,
        'Content-Length': pdfBuffer.length
      });
      
      res.send(pdfBuffer);
      
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro ao gerar relatório',
        message: error.message 
      });
    }
  }
  
  async visualizarRelatorioPDF(req: Request, res: Response) {
    try {
      const { avaliacaoId } = req.params;
      
      const pdfBuffer = await this.pdfService.gerarRelatorioProfissional(avaliacaoId);
      
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline'
      });
      
      res.send(pdfBuffer);
      
    } catch (error) {
      res.status(500).json({ 
        error: 'Erro ao visualizar relatório',
        message: error.message 
      });
    }
  }
}
```

---

💡 **Este sistema de relatórios PDF profissionais elevará significativamente a qualidade e apresentação das avaliações, proporcionando um diferencial competitivo importante!**
