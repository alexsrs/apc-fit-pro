/**
 * Teste rápido para verificar a estrutura dos protocolos
 */

// Simulação da função que está causando problema
const PROTOCOLOS_INFO = {
  'faulkner': {
    nome: 'Faulkner',
    descricao: 'Protocolo de 4 dobras cutâneas',
    numDobras: 4,
    pontos: ['Tríceps', 'Subescapular', 'Supra-ilíaca', 'Bicipital'],
    indicacao: 'População geral, adultos ativos',
    requerIdade: false,
    sexoEspecifico: false
  },
  'pollock-3-homens': {
    nome: 'Pollock 3 Dobras (Homens)',
    descricao: 'Protocolo simplificado para homens',
    numDobras: 3,
    pontos: ['Peitoral', 'Abdominal', 'Coxa'],
    indicacao: 'Homens, avaliação rápida',
    requerIdade: true,
    sexoEspecifico: true
  },
  'pollock-3-mulheres': {
    nome: 'Pollock 3 Dobras (Mulheres)',
    descricao: 'Protocolo simplificado para mulheres',
    numDobras: 3,
    pontos: ['Tríceps', 'Supra-ilíaca', 'Coxa'],
    indicacao: 'Mulheres, avaliação rápida',
    requerIdade: true,
    sexoEspecifico: true
  },
  'pollock-7': {
    nome: 'Pollock 7 Dobras',
    descricao: 'Protocolo completo de 7 dobras',
    numDobras: 7,
    pontos: ['Tríceps', 'Subescapular', 'Peitoral', 'Axilar média', 'Supra-ilíaca', 'Abdominal', 'Coxa'],
    indicacao: 'Avaliação completa, atletas',
    requerIdade: true,
    sexoEspecifico: false
  },
  'pollock-9': {
    nome: 'Pollock 9 Dobras',
    descricao: 'Protocolo extenso para atletas',
    numDobras: 9,
    pontos: ['Tríceps', 'Subescapular', 'Peitoral', 'Axilar média', 'Supra-ilíaca', 'Abdominal', 'Coxa', 'Bíceps', 'Panturrilha'],
    indicacao: 'Atletas profissionais, avaliação detalhada',
    requerIdade: true,
    sexoEspecifico: false
  },
  'guedes': {
    nome: 'Guedes',
    descricao: 'Protocolo específico para brasileiros',
    numDobras: 3,
    pontos: ['Tríceps', 'Subescapular', 'Supra-ilíaca'],
    indicacao: 'População brasileira, crianças e adolescentes',
    requerIdade: false,
    sexoEspecifico: false
  }
};

const protocolos = [
  'faulkner',
  'pollock-3-homens',
  'pollock-3-mulheres', 
  'pollock-7',
  'pollock-9',
  'guedes'
];

console.log('=== TESTE DE PROTOCOLOS ===\n');

const result = protocolos.map(protocolo => {
  const info = PROTOCOLOS_INFO[protocolo];
  return {
    id: protocolo,
    ...info
  };
});

console.log('Resultado esperado:');
console.log(JSON.stringify(result, null, 2));

// Verificar se todos os campos necessários existem
console.log('\n=== VERIFICAÇÃO DE CAMPOS ===');
result.forEach((protocolo, index) => {
  console.log(`\nProtocolo ${index + 1}: ${protocolo.id}`);
  console.log(`- nome: ${protocolo.nome || 'AUSENTE'}`);
  console.log(`- descricao: ${protocolo.descricao || 'AUSENTE'}`);
  console.log(`- numDobras: ${protocolo.numDobras || 'AUSENTE'}`);
  console.log(`- pontos: ${protocolo.pontos ? JSON.stringify(protocolo.pontos) : 'AUSENTE'}`);
  console.log(`- dobrasNecessarias: ${protocolo.dobrasNecessarias ? JSON.stringify(protocolo.dobrasNecessarias) : 'AUSENTE'}`);
  console.log(`- requerIdade: ${protocolo.requerIdade !== undefined ? protocolo.requerIdade : 'AUSENTE'}`);
  console.log(`- tempoMedio: ${protocolo.tempoMedio || 'AUSENTE'}`);
  console.log(`- recomendado: ${protocolo.recomendado || 'AUSENTE'}`);
});
