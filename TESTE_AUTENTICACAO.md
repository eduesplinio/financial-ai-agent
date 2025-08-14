# Plano de Testes - Sistema de Autenticação e Autorização

## ✅ Checklist de Verificação

### 1. Estrutura de Arquivos
- [x] `apps/web/lib/auth.ts` - Configuração NextAuth.js
- [x] `apps/web/middleware.ts` - Middleware de proteção de rotas
- [x] `apps/web/lib/rbac.ts` - Sistema RBAC
- [x] `apps/web/hooks/use-permissions.ts` - Hooks de permissão
- [x] `apps/web/components/auth/role-guard.tsx` - Componentes de guarda
- [x] `apps/web/lib/auth-middleware.ts` - Middleware de API

### 2. Páginas de Autenticação
- [x] `apps/web/app/auth/signin/page.tsx` - Página de login
- [x] `apps/web/app/auth/signup/page.tsx` - Página de registro
- [x] `apps/web/app/profile/page.tsx` - Página de perfil
- [x] `apps/web/app/dashboard/page.tsx` - Dashboard com RBAC
- [x] `apps/web/app/admin/page.tsx` - Painel administrativo

### 3. API Endpoints
- [x] `apps/web/app/api/auth/[...nextauth]/route.ts` - NextAuth API
- [x] `apps/web/app/api/auth/register/route.ts` - Registro de usuário
- [x] `apps/web/app/api/user/profile/route.ts` - Gerenciamento de perfil
- [x] `apps/web/app/api/admin/users/route.ts` - Administração de usuários
- [x] `apps/web/app/api/test-rbac/route.ts` - Teste de RBAC

### 4. Componentes UI
- [x] Todos os componentes UI necessários criados
- [x] Navbar com navegação baseada em roles
- [x] Role guards funcionando

## 🧪 Testes Manuais para Executar

### Pré-requisitos
1. MongoDB rodando na porta 27017
2. Variáveis de ambiente configuradas no `.env.local`
3. Aplicação rodando com `npm run dev`

### Teste 1: Registro de Usuário
1. Acesse `http://localhost:3000/auth/signup`
2. Preencha o formulário de registro
3. Verifique se o usuário é criado no MongoDB
4. Verifique se é redirecionado para o dashboard

### Teste 2: Login com Credenciais
1. Acesse `http://localhost:3000/auth/signin`
2. Faça login com as credenciais criadas
3. Verifique se é redirecionado para o dashboard
4. Verifique se a sessão está ativa

### Teste 3: Proteção de Rotas
1. Tente acessar `/dashboard` sem estar logado
2. Deve ser redirecionado para `/auth/signin`
3. Após login, deve ser redirecionado de volta para `/dashboard`

### Teste 4: RBAC - Usuário Normal
1. Faça login como usuário normal
2. Verifique se vê apenas cards permitidos no dashboard
3. Tente acessar `/admin` - deve ser redirecionado
4. Verifique se não vê links de admin na navbar

### Teste 5: RBAC - Administrador
1. Altere o role do usuário para "admin" no MongoDB
2. Faça login novamente
3. Verifique se vê o card de admin no dashboard
4. Acesse `/admin` - deve funcionar
5. Verifique se vê links de admin na navbar

### Teste 6: API com Autenticação
1. Teste `GET /api/user/profile` (deve funcionar logado)
2. Teste `GET /api/admin/users` (só admin)
3. Teste `GET /api/test-rbac` (teste de permissões)

## 🔧 Comandos de Teste

### Verificar Compilação TypeScript
```bash
cd apps/web
npx tsc --noEmit
```

### Executar Testes Unitários
```bash
npm test -- --testPathPattern=rbac.test.ts
npm test -- --testPathPattern=auth-middleware.test.ts
```

### Iniciar Aplicação
```bash
npm run dev
```

### Verificar MongoDB
```bash
# Conectar ao MongoDB
mongosh mongodb://dev:dev123@localhost:27017/financial-ai-agent?authSource=admin

# Verificar usuários
db.users.find({})

# Alterar role de usuário para admin
db.users.updateOne(
  { email: "seu@email.com" },
  { $set: { role: "admin" } }
)
```

## 🐛 Possíveis Problemas e Soluções

### Problema: Dependências não instaladas
**Solução:** Execute `npm install` na raiz do projeto

### Problema: MongoDB não conecta
**Solução:** Verifique se o MongoDB está rodando e as credenciais estão corretas

### Problema: NextAuth não funciona
**Solução:** Verifique se `NEXTAUTH_SECRET` está definido no `.env.local`

### Problema: OAuth não funciona
**Solução:** Configure as credenciais do Google/GitHub no `.env.local`

### Problema: Tipos TypeScript
**Solução:** Execute `npm run type-check` para verificar erros

## 📋 Variáveis de Ambiente Necessárias

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Database
MONGODB_URI=mongodb://dev:dev123@localhost:27017/financial-ai-agent?authSource=admin

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=sua-chave-secreta-muito-segura-aqui

# OAuth Providers (opcional para teste inicial)
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret
GITHUB_CLIENT_ID=seu-github-client-id
GITHUB_CLIENT_SECRET=seu-github-client-secret
```

## ✅ Critérios de Sucesso

O sistema está funcionando corretamente se:

1. ✅ Usuários podem se registrar e fazer login
2. ✅ Rotas protegidas redirecionam usuários não autenticados
3. ✅ RBAC funciona (usuários veem diferentes conteúdos baseado no role)
4. ✅ APIs respeitam permissões de acesso
5. ✅ Middleware de autenticação funciona
6. ✅ Componentes de role guard funcionam
7. ✅ Navbar mostra opções baseadas no role do usuário
8. ✅ Perfil do usuário pode ser atualizado
9. ✅ Admin pode acessar painel administrativo
10. ✅ Sessões são gerenciadas corretamente

## 🚀 Próximos Passos

Após confirmar que tudo funciona:
1. Executar testes automatizados
2. Configurar OAuth providers
3. Implementar refresh token rotation
4. Adicionar logs de auditoria
5. Configurar rate limiting
6. Implementar 2FA (opcional)