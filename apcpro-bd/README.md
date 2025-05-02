### Resumo dos Relacionamentos:

#### **User 1:1 UserPerfil**
- **Descrição:** Um usuário tem um perfil, e um perfil pertence a um usuário.

#### **User 1:N Account**
- **Descrição:** Um usuário pode ter várias contas de login externas.

#### **User 1:N Session**
- **Descrição:** Um usuário pode ter várias sessões abertas.

#### **UserPerfil 1:N Grupo (como criador)**
- **Descrição:** Um perfil pode criar vários grupos.

#### **UserPerfil N:1 UserPerfil (professor-aluno)**
- **Descrição:** Um aluno tem um professor, e um professor tem vários alunos.

#### **UserPerfil N:M Grupo (como membro)**
- **Descrição:** Muitos perfis podem participar de muitos grupos.