/**
 * Utilitários para manipulação de nomes e iniciais de usuários
 */

/**
 * Gera as iniciais de um nome, lidando com casos onde o nome pode ser undefined/null
 * @param name - Nome do usuário (pode ser undefined ou null)
 * @returns String com as iniciais (máximo 2 caracteres) ou '??' se nome inválido
 */
export function getInitials(name: string | undefined | null): string {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return '??';
  }
  
  return name
    .trim()
    .split(' ')
    .filter(n => n.length > 0) // Remove strings vazias
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Formata um nome para exibição, fornecendo fallback para nomes vazios
 * @param name - Nome do usuário (pode ser undefined ou null)
 * @param fallback - Texto alternativo (padrão: 'Sem nome')
 * @returns Nome formatado ou texto alternativo
 */
export function formatDisplayName(name: string | undefined | null, fallback: string = 'Sem nome'): string {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return fallback;
  }
  
  return name.trim();
}

/**
 * Formata um email para exibição, fornecendo fallback para emails vazios
 * @param email - Email do usuário (pode ser undefined ou null)
 * @param fallback - Texto alternativo (padrão: 'Sem email')
 * @returns Email formatado ou texto alternativo
 */
export function formatDisplayEmail(email: string | undefined | null, fallback: string = 'Sem email'): string {
  if (!email || typeof email !== 'string' || email.trim() === '') {
    return fallback;
  }
  
  return email.trim();
}
