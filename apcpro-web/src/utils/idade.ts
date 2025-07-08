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
  
  const nascimento = new Date(dataNascimento);
  if (isNaN(nascimento.getTime())) return 0;
  
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  
  return idade >= 0 ? idade : 0;
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
export function formatarDataValidade(validadeAte?: string | Date): string {
  if (!validadeAte) return 'Sem validade definida';
  
  const data = new Date(validadeAte);
  if (isNaN(data.getTime())) return 'Data inválida';
  
  return data.toLocaleDateString('pt-BR');
}
