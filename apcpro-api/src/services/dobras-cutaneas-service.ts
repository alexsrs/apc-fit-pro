/**
 * Service para Avaliação de Dobras Cutâneas
 * Centraliza a lógica de negócio para processamento de avaliações
 */

import {
  ProtocoloDisponivel,
  getProtocoloPorId,
  calcularFaulkner,
  calcularPollock3,
  calcularPollock7,
  calcularPollock9,
  calcularGuedes,
  validarMedidasFaulkner,
  validarMedidasPollock3Homens,
  validarMedidasPollock3Mulheres,
  validarMedidasPollock7,
  validarMedidasPollock9,
  validarMedidasGuedes,
  type MedidasFaulkner,
  type MedidasPollock3Homens,
  type MedidasPollock3Mulheres,
  type MedidasPollock7,
  type MedidasPollock9,
  type MedidasGuedes,
  type ResultadoFaulkner,
  type ResultadoPollock,
  type ResultadoGuedes
} from '../utils/protocolos-dobras';

import {
  DobrasCutaneasInput,
  AvaliacaoDobrasCutaneas,
  DobrasCutaneasResponse,
  ValidacaoMedidas,
  GeneroType
} from '../models/dobras-cutaneas-model';

import prisma from '../prisma';

export class DobrasCutaneasService {
  
  /**
   * Valida se o protocolo é adequado para os dados fornecidos
   */
  private validarProtocolo(protocolo: ProtocoloDisponivel, genero: GeneroType, idade?: number): void {
    const info = getProtocoloPorId(protocolo);
    
    // Validar idade para protocolos que requerem
    if (info.requerIdade && (!idade || idade < 1 || idade > 120)) {
      throw new Error(`Protocolo ${info.nome} requer idade válida (1-120 anos)`);
    }
    
    // Validar faixa etária específica para Pollock
    if (protocolo.startsWith('pollock') && idade) {
      if (idade < 18 || idade > 61) {
        throw new Error('Protocolos de Pollock são válidos para idades entre 18-61 anos');
      }
    }
    
    // Validar gênero para protocolos específicos
    if (info.sexoEspecifico) {
      if (protocolo === 'pollock-3-homens' && genero !== 'M') {
        throw new Error('Protocolo Pollock 3 dobras (homens) requer gênero masculino');
      }
      if (protocolo === 'pollock-3-mulheres' && genero !== 'F') {
        throw new Error('Protocolo Pollock 3 dobras (mulheres) requer gênero feminino');
      }
    }
  }

  /**
   * Valida as medidas de acordo com o protocolo selecionado
   */
  private validarMedidas(protocolo: ProtocoloDisponivel, medidas: any): ValidacaoMedidas {
    const erros: string[] = [];
    let valida = true;

    try {
      switch (protocolo) {
        case 'faulkner':
          const medidasFaulkner: MedidasFaulkner = {
            triceps: medidas.triceps,
            subescapular: medidas.subescapular,
            suprailiaca: medidas.suprailiaca,
            bicipital: medidas.bicipital
          };
          
          if (!validarMedidasFaulkner(medidasFaulkner)) {
            erros.push('Medidas do protocolo Faulkner inválidas (devem estar entre 3-50mm)');
            valida = false;
          }
          break;

        case 'pollock-3-homens':
          const medidasP3H: MedidasPollock3Homens = {
            peitoral: medidas.peitoral,
            abdominal: medidas.abdominal,
            coxa: medidas.coxa
          };
          
          if (!validarMedidasPollock3Homens(medidasP3H)) {
            erros.push('Medidas do protocolo Pollock 3 dobras (homens) inválidas');
            valida = false;
          }
          break;

        case 'pollock-3-mulheres':
          const medidasP3M: MedidasPollock3Mulheres = {
            triceps: medidas.triceps,
            suprailiaca: medidas.suprailiaca,
            coxa: medidas.coxa
          };
          
          if (!validarMedidasPollock3Mulheres(medidasP3M)) {
            erros.push('Medidas do protocolo Pollock 3 dobras (mulheres) inválidas');
            valida = false;
          }
          break;

        case 'pollock-7':
          const medidasP7: MedidasPollock7 = {
            triceps: medidas.triceps,
            subescapular: medidas.subescapular,
            suprailiaca: medidas.suprailiaca,
            abdominal: medidas.abdominal,
            peitoral: medidas.peitoral,
            axilarMedia: medidas.axilarMedia,
            coxa: medidas.coxa
          };
          
          if (!validarMedidasPollock7(medidasP7)) {
            erros.push('Medidas do protocolo Pollock 7 dobras inválidas');
            valida = false;
          }
          break;

        case 'pollock-9':
          const medidasP9: MedidasPollock9 = {
            triceps: medidas.triceps,
            subescapular: medidas.subescapular,
            suprailiaca: medidas.suprailiaca,
            abdominal: medidas.abdominal,
            peitoral: medidas.peitoral,
            axilarMedia: medidas.axilarMedia,
            coxa: medidas.coxa,
            biceps: medidas.biceps,
            panturrilha: medidas.panturrilha
          };
          
          if (!validarMedidasPollock9(medidasP9)) {
            erros.push('Medidas do protocolo Pollock 9 dobras inválidas');
            valida = false;
          }
          break;

        case 'guedes':
          const medidasGuedes: MedidasGuedes = {
            triceps: medidas.triceps,
            subescapular: medidas.subescapular,
            suprailiaca: medidas.suprailiaca,
            abdominal: medidas.abdominal,
            coxa: medidas.coxa,
            peito: medidas.peitoral,
            axilarMedia: medidas.axilarMedia
          };
          
          if (!validarMedidasGuedes(medidasGuedes)) {
            erros.push('Medidas do protocolo Guedes inválidas');
            valida = false;
          }
          break;

        default:
          erros.push(`Protocolo ${protocolo} não reconhecido`);
          valida = false;
      }
    } catch (error) {
      erros.push(`Erro na validação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      valida = false;
    }

    return { valida, erros };
  }

  /**
   * Executa o cálculo de acordo com o protocolo selecionado
   */
  private calcularProtocolo(
    protocolo: ProtocoloDisponivel, 
    medidas: any, 
    genero: GeneroType, 
    peso: number, 
    idade?: number
  ): any {
    switch (protocolo) {
      case 'faulkner':
        const medidasFaulkner: MedidasFaulkner = {
          triceps: medidas.triceps,
          subescapular: medidas.subescapular,
          suprailiaca: medidas.suprailiaca,
          bicipital: medidas.bicipital
        };
        return calcularFaulkner(medidasFaulkner, genero, peso);

      case 'pollock-3-homens':
        const medidasP3H: MedidasPollock3Homens = {
          peitoral: medidas.peitoral,
          abdominal: medidas.abdominal,
          coxa: medidas.coxa
        };
        return calcularPollock3(medidasP3H, genero, idade!, peso);

      case 'pollock-3-mulheres':
        const medidasP3M: MedidasPollock3Mulheres = {
          triceps: medidas.triceps,
          suprailiaca: medidas.suprailiaca,
          coxa: medidas.coxa
        };
        return calcularPollock3(medidasP3M, genero, idade!, peso);

      case 'pollock-7':
        const medidasP7: MedidasPollock7 = {
          triceps: medidas.triceps,
          subescapular: medidas.subescapular,
          suprailiaca: medidas.suprailiaca,
          abdominal: medidas.abdominal,
          peitoral: medidas.peitoral,
          axilarMedia: medidas.axilarMedia,
          coxa: medidas.coxa
        };
        return calcularPollock7(medidasP7, genero, idade!, peso);

      case 'pollock-9':
        const medidasP9: MedidasPollock9 = {
          triceps: medidas.triceps,
          subescapular: medidas.subescapular,
          suprailiaca: medidas.suprailiaca,
          abdominal: medidas.abdominal,
          peitoral: medidas.peitoral,
          axilarMedia: medidas.axilarMedia,
          coxa: medidas.coxa,
          biceps: medidas.biceps,
          panturrilha: medidas.panturrilha
        };
        return calcularPollock9(medidasP9, genero, idade!, peso);

      case 'guedes':
        const medidasGuedes: MedidasGuedes = {
          triceps: medidas.triceps,
          subescapular: medidas.subescapular,
          suprailiaca: medidas.suprailiaca,
          abdominal: medidas.abdominal,
          coxa: medidas.coxa,
          peito: medidas.peitoral,
          axilarMedia: medidas.axilarMedia
        };
        return calcularGuedes(medidasGuedes, genero, idade!, peso);

      default:
        throw new Error(`Protocolo ${protocolo} não implementado`);
    }
  }

  /**
   * Processa uma avaliação completa de dobras cutâneas
   */
  async processarAvaliacao(input: DobrasCutaneasInput): Promise<AvaliacaoDobrasCutaneas> {
    const { protocolo, dadosPessoais, medidas, observacoes } = input;
    const { genero, idade, peso } = dadosPessoais;

    // 1. Validar protocolo
    this.validarProtocolo(protocolo, genero, idade);

    // 2. Validar medidas
    const validacao = this.validarMedidas(protocolo, medidas);
    if (!validacao.valida) {
      throw new Error(`Medidas inválidas: ${validacao.erros.join(', ')}`);
    }

    // 3. Calcular resultados
    const resultadosCalculados = this.calcularProtocolo(protocolo, medidas, genero, peso, idade);

    // 4. Montar avaliação completa
    const avaliacaoCompleta: AvaliacaoDobrasCutaneas = {
      protocolo,
      dadosPessoais: {
        genero,
        idade,
        peso
      },
      medidas: {
        // Incluir apenas as medidas relevantes
        ...Object.fromEntries(
          Object.entries(medidas).filter(([, value]) => value !== undefined && value !== null)
        )
      },
      resultados: {
        somaTotal: resultadosCalculados.somaTotal,
        somaEquacao: resultadosCalculados.somaEquacao,
        percentualGordura: resultadosCalculados.percentualGordura,
        massaGorda: resultadosCalculados.massaGorda,
        massaMagra: resultadosCalculados.massaMagra,
        classificacao: resultadosCalculados.classificacao,
        densidadeCorporal: resultadosCalculados.densidadeCorporal
      },
      metadata: {
        dataAvaliacao: new Date().toISOString(),
        validadeFormula: getProtocoloPorId(protocolo).nome,
        observacoes
      }
    };

    return avaliacaoCompleta;
  }

  /**
   * Salva uma avaliação de dobras cutâneas no banco de dados
   */
  async salvarAvaliacao(input: DobrasCutaneasInput, calculadoPor?: string): Promise<DobrasCutaneasResponse> {
    // Processar avaliação
    const avaliacaoCompleta = await this.processarAvaliacao(input);
    
    // Adicionar quem calculou
    if (calculadoPor) {
      avaliacaoCompleta.metadata.calculadoPor = calculadoPor;
    }

    // Dobras cutâneas só podem ser feitas por professores, então sempre são 'aprovada'
    const status = 'aprovada';

    // Salvar no banco
    const avaliacaoSalva = await prisma.avaliacao.create({
      data: {
        userPerfilId: input.userPerfilId,
        tipo: 'dobras-cutaneas',
        status: status,
        resultado: avaliacaoCompleta as any // JSON
      }
    });

    return {
      id: avaliacaoSalva.id,
      userPerfilId: avaliacaoSalva.userPerfilId,
      tipo: 'dobras-cutaneas',
      status: avaliacaoSalva.status as any,
      data: avaliacaoSalva.createdAt.toISOString().split('T')[0],
      resultado: avaliacaoCompleta,
      createdAt: avaliacaoSalva.createdAt.toISOString(),
      updatedAt: avaliacaoSalva.updatedAt.toISOString()
    };
  }

  /**
   * Busca avaliações de dobras cutâneas por usuário
   */
  async buscarAvaliacoesPorUsuario(userPerfilId: string): Promise<DobrasCutaneasResponse[]> {
    const avaliacoes = await prisma.avaliacao.findMany({
      where: {
        userPerfilId,
        tipo: 'dobras-cutaneas'
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return avaliacoes.map(avaliacao => ({
      id: avaliacao.id,
      userPerfilId: avaliacao.userPerfilId,
      tipo: 'dobras-cutaneas',
      status: avaliacao.status as any,
      data: avaliacao.createdAt.toISOString().split('T')[0],
      resultado: avaliacao.resultado as unknown as AvaliacaoDobrasCutaneas,
      createdAt: avaliacao.createdAt.toISOString(),
      updatedAt: avaliacao.updatedAt.toISOString()
    }));
  }

  /**
   * Busca uma avaliação específica por ID
   */
  async buscarAvaliacaoPorId(id: string): Promise<DobrasCutaneasResponse | null> {
    const avaliacao = await prisma.avaliacao.findFirst({
      where: {
        id,
        tipo: 'dobras-cutaneas'
      }
    });

    if (!avaliacao) return null;

    return {
      id: avaliacao.id,
      userPerfilId: avaliacao.userPerfilId,
      tipo: 'dobras-cutaneas',
      status: avaliacao.status as any,
      data: avaliacao.createdAt.toISOString().split('T')[0],
      resultado: avaliacao.resultado as unknown as AvaliacaoDobrasCutaneas,
      createdAt: avaliacao.createdAt.toISOString(),
      updatedAt: avaliacao.updatedAt.toISOString()
    };
  }

  /**
   * Lista protocolos disponíveis com informações
   */
  listarProtocolosDisponiveis() {
    const protocolos: ProtocoloDisponivel[] = [
      'faulkner',
      'pollock-3-homens',
      'pollock-3-mulheres', 
      'pollock-7',
      'pollock-9',
      'guedes'
    ];

    // Mapear tempos médios estimados por número de dobras
    const tempoMedio = (numDobras: number) => {
      if (numDobras <= 3) return "5-8 min";
      if (numDobras <= 4) return "8-12 min";
      if (numDobras <= 7) return "12-18 min";
      return "18-25 min";
    };

    return protocolos.map(protocolo => {
      const info = getProtocoloPorId(protocolo);
      
      // Mapear pontos anatômicos para nomes de campos nas medidas
      const pontosParaChaves = (pontos: string[]): string[] => {
        const mapeamento: { [key: string]: string } = {
          'Tríceps': 'triceps',
          'Subescapular': 'subescapular',
          'Supra-ilíaca': 'suprailiaca',
          'Bicipital': 'bicipital',
          'Peitoral': 'peitoral',
          'Abdominal': 'abdominal',
          'Axilar média': 'axilarMedia',
          'Coxa': 'coxa',
          'Bíceps': 'biceps',
          'Panturrilha': 'panturrilha'
        };
        
        return pontos.map(ponto => mapeamento[ponto] || ponto.toLowerCase());
      };

      return {
        id: protocolo,
        nome: info.nome,
        descricao: info.descricao,
        numDobras: info.numDobras,
        dobrasNecessarias: pontosParaChaves(info.pontos), // Frontend espera este campo
        requerIdade: info.requerIdade,
        generoEspecifico: info.sexoEspecifico || false, // Frontend espera este nome
        tempoMedio: tempoMedio(info.numDobras),
        recomendado: info.indicacao
      };
    });
  }
}
