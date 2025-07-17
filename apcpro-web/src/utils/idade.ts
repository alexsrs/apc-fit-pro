/**
 * Utilitários para cálculo de idade
 */

/**
 * Calcula a idade baseada na data de nascimento
 * @param dataNascimento - Data de nascimento (string ou Date)
 * @returns Idade em anos (number)
 */
export function calcularIdade(dataNascimento?: string | Date): number {
  if (!dataNascimento) return 0;
  // Força sempre UTC para evitar erro de fuso
  let nascimento: Date;
  if (typeof dataNascimento === 'string') {
    // Se vier só ano-mês-dia, força UTC
    if (/^\d{4}-\d{2}-\d{2}$/.test(dataNascimento)) {
      nascimento = new Date(dataNascimento + 'T00:00:00Z');
    } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(dataNascimento)) {
      nascimento = new Date(dataNascimento);
    } else {
      nascimento = new Date(dataNascimento);
    }
  } else {
    nascimento = new Date(dataNascimento);
  }
  if (isNaN(nascimento.getTime())) return 0;
  // Calcula idade sempre em UTC
  const hoje = new Date();
  let idade = hoje.getUTCFullYear() - nascimento.getUTCFullYear();
  const m = hoje.getUTCMonth() - nascimento.getUTCMonth();
  if (m < 0 || (m === 0 && hoje.getUTCDate() < nascimento.getUTCDate())) {
    idade--;
  }
  return idade >= 0 ? idade : 0;

}

/**
 * Formata data de nascimento para padrão BR (DD/MM/YYYY), sempre em UTC
 * @param dataNascimento - Data de nascimento (string ou Date)
 * @returns String formatada da data (DD/MM/YYYY)
 */
export function formatarDataNascimentoBR(dataNascimento?: string | Date): string {
  if (!dataNascimento) return '';
  let data: Date;
  if (typeof dataNascimento === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dataNascimento)) {
      data = new Date(dataNascimento + 'T00:00:00Z');
    } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/.test(dataNascimento)) {
      data = new Date(dataNascimento);
    } else {
      data = new Date(dataNascimento);
    }
  } else {
    data = new Date(dataNascimento);
  }
  if (isNaN(data.getTime())) return '';
  // Sempre UTC
  const dia = String(data.getUTCDate()).padStart(2, '0');
  const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
  const ano = data.getUTCFullYear();
  return `${dia}/${mes}/${ano}`;
}

/**
 * Calcula a idade com retorno opcional para melhor tipagem
 * @param dataNascimento - Data de nascimento (string ou Date)
 * @returns Idade em anos ou undefined se inválida
 */
export function calcularIdadeOpcional(dataNascimento?: string | Date): number | undefined {
  if (!dataNascimento) return undefined;
  
  const nascimento = new Date(dataNascimento);
  if (isNaN(nascimento.getTime())) return undefined;
  
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  
  return idade >= 0 ? idade : undefined;
}

/**
 * Verifica se uma avaliação está vencida baseada na data de validade
 * @param validadeAte - Data de validade da avaliação (string ISO ou Date)
 * @returns true se a avaliação está vencida, false caso contrário
 */
export function isAvaliacaoVencida(validadeAte?: string | Date): boolean {
  if (!validadeAte) return false;
  
  const dataValidade = new Date(validadeAte);
  if (isNaN(dataValidade.getTime())) return false;
  
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0); // Zerar horas para comparar apenas a data
  dataValidade.setHours(0, 0, 0, 0);
  
  return hoje > dataValidade;
}

/**
 * Calcula a data de validade baseada em uma data base e número de dias
 * @param dataBase - Data base para o cálculo (padrão: hoje)
 * @param diasValidade - Número de dias de validade
 * @returns Data de validade no formato ISO string
 */
export function calcularDataValidade(diasValidade: number, dataBase?: Date): string {
  const data = dataBase ? new Date(dataBase) : new Date();
  data.setDate(data.getDate() + diasValidade);
  return data.toISOString();
}

/**
 * Formata uma data de validade para exibição
 * @param validadeAte - Data de validade
 * @returns String formatada da data (DD/MM/YYYY)
 */
/**
 * Formata uma data para exibição (DD/MM/YYYY), garantindo fuso UTC
 * @param dataInput - Data (string ou Date)
 * @returns String formatada da data (DD/MM/YYYY)
 */
export function formatarDataValidade(dataInput?: string | Date): string {
  if (!dataInput) return 'Sem validade definida';
  let data: Date;
  if (typeof dataInput === 'string') {
    // Se vier só ano-mês-dia, força UTC
    if (/^\d{4}-\d{2}-\d{2}$/.test(dataInput)) {
      data = new Date(dataInput + 'T00:00:00Z');
    } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(.\d+)?Z$/.test(dataInput)) {
      // ISO completa UTC
      data = new Date(dataInput);
    } else {
      // Tenta converter normalmente
      data = new Date(dataInput);
    }
  } else {
    data = new Date(dataInput);
  }
  if (isNaN(data.getTime())) return 'Data inválida';
  // Garante exibição sempre em UTC
  return `${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}/${data.getFullYear()}`;
}
