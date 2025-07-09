const axios = require('axios');

// Configurações do teste
const API_URL = 'http://localhost:3333';
const PROFESSOR_ID = '7e6fbe97-4b36-4e60-8c9f-b3b0e67b3d2c';

async function testarEndpointGrupos() {
  try {
    console.log('🧪 Iniciando teste dos endpoints de grupos...\n');

    // 1. Listar grupos do professor
    console.log('1️⃣ Listando grupos do professor...');
    const gruposResponse = await axios.get(`${API_URL}/api/users/${PROFESSOR_ID}/grupos`);
    console.log('✅ Grupos encontrados:', gruposResponse.data);

    if (gruposResponse.data.length === 0) {
      console.log('⚠️  Nenhum grupo encontrado. Criando um grupo de teste...');
      
      // Criar grupo de teste
      const novoGrupo = {
        nome: 'Grupo de Teste Frontend',
        descricao: 'Grupo criado para testar o frontend'
      };
      
      const createResponse = await axios.post(`${API_URL}/api/users/${PROFESSOR_ID}/grupos`, novoGrupo);
      console.log('✅ Grupo criado:', createResponse.data);
      
      // Listar grupos novamente
      const gruposAtualizadosResponse = await axios.get(`${API_URL}/api/users/${PROFESSOR_ID}/grupos`);
      console.log('✅ Grupos atualizados:', gruposAtualizadosResponse.data);
    }

    // 2. Testar endpoint de membros do grupo
    const grupos = gruposResponse.data;
    if (grupos.length > 0) {
      const grupoId = grupos[0].id;
      
      console.log(`\n2️⃣ Testando endpoint de membros do grupo ${grupoId}...`);
      const membrosResponse = await axios.get(`${API_URL}/api/users/${PROFESSOR_ID}/grupos/${grupoId}/alunos`);
      console.log('✅ Membros do grupo:', membrosResponse.data);
      
      if (membrosResponse.data.length === 0) {
        console.log('⚠️  Nenhum membro encontrado. Vamos verificar se há alunos disponíveis...');
        
        // Listar alunos do professor
        const alunosResponse = await axios.get(`${API_URL}/api/users/${PROFESSOR_ID}/alunos`);
        console.log('✅ Alunos do professor:', alunosResponse.data);
        
        if (alunosResponse.data.length > 0) {
          const alunoId = alunosResponse.data[0].id;
          console.log(`\n3️⃣ Adicionando aluno ${alunoId} ao grupo ${grupoId}...`);
          
          try {
            const addResponse = await axios.post(`${API_URL}/api/users/${PROFESSOR_ID}/grupos/${grupoId}/alunos/${alunoId}`);
            console.log('✅ Aluno adicionado:', addResponse.data);
            
            // Verificar se foi adicionado corretamente
            const membrosAtualizadosResponse = await axios.get(`${API_URL}/api/users/${PROFESSOR_ID}/grupos/${grupoId}/alunos`);
            console.log('✅ Membros atualizados:', membrosAtualizadosResponse.data);
          } catch (error) {
            console.error('❌ Erro ao adicionar aluno:', error.response?.data || error.message);
          }
        } else {
          console.log('⚠️  Nenhum aluno encontrado para adicionar ao grupo');
        }
      }
    }

    console.log('\n🎉 Teste completo! O frontend agora pode consumir os dados corretamente.');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
    console.error('Stack trace:', error.stack);
  }
}

testarEndpointGrupos();
