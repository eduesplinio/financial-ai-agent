#!/usr/bin/env node

/**
 * Script de verificação do sistema de autenticação
 * Executa verificações básicas para garantir que tudo está configurado corretamente
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando Sistema de Autenticação...\n');

// Lista de arquivos críticos que devem existir
const criticalFiles = [
  'lib/auth.ts',
  'middleware.ts',
  'lib/rbac.ts',
  'lib/auth-middleware.ts',
  'hooks/use-permissions.ts',
  'components/auth/role-guard.tsx',
  'app/auth/signin/page.tsx',
  'app/auth/signup/page.tsx',
  'app/api/auth/[...nextauth]/route.ts',
  'app/api/auth/register/route.ts',
  'app/api/user/profile/route.ts',
  'app/dashboard/page.tsx',
  'app/profile/page.tsx',
  'app/admin/page.tsx',
];

// Lista de componentes UI necessários
const uiComponents = [
  'components/ui/button.tsx',
  'components/ui/input.tsx',
  'components/ui/label.tsx',
  'components/ui/card.tsx',
  'components/ui/alert.tsx',
  'components/ui/dropdown-menu.tsx',
  'components/ui/avatar.tsx',
  'components/ui/icons.tsx',
];

let allFilesExist = true;

console.log('📁 Verificando arquivos críticos...');
criticalFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - ARQUIVO FALTANDO`);
    allFilesExist = false;
  }
});

console.log('\n🎨 Verificando componentes UI...');
uiComponents.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - COMPONENTE FALTANDO`);
    allFilesExist = false;
  }
});

// Verificar package.json
console.log('\n📦 Verificando dependências...');
const packageJsonPath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  const requiredDeps = [
    'next-auth',
    '@auth/mongodb-adapter',
    'bcryptjs',
    'mongodb',
    'react-hook-form',
    '@hookform/resolvers',
    'zod'
  ];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`❌ ${dep} - DEPENDÊNCIA FALTANDO`);
      allFilesExist = false;
    }
  });
} else {
  console.log('❌ package.json não encontrado');
  allFilesExist = false;
}

// Verificar variáveis de ambiente
console.log('\n🔐 Verificando configuração de ambiente...');
const envExamplePath = path.join(__dirname, '..', '..', '..', '.env.example');
if (fs.existsSync(envExamplePath)) {
  console.log('✅ .env.example existe');
  
  const envContent = fs.readFileSync(envExamplePath, 'utf8');
  const requiredEnvVars = [
    'MONGODB_URI',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'GOOGLE_CLIENT_ID',
    'GITHUB_CLIENT_ID'
  ];
  
  requiredEnvVars.forEach(envVar => {
    if (envContent.includes(envVar)) {
      console.log(`✅ ${envVar} configurado no .env.example`);
    } else {
      console.log(`❌ ${envVar} - VARIÁVEL FALTANDO`);
    }
  });
} else {
  console.log('❌ .env.example não encontrado');
}

// Verificar estrutura RBAC
console.log('\n🛡️  Verificando estrutura RBAC...');
const rbacPath = path.join(__dirname, '..', 'lib', 'rbac.ts');
if (fs.existsSync(rbacPath)) {
  const rbacContent = fs.readFileSync(rbacPath, 'utf8');
  
  const rbacChecks = [
    { name: 'Role enum', pattern: /enum Role/ },
    { name: 'Permission enum', pattern: /enum Permission/ },
    { name: 'rolePermissions mapping', pattern: /rolePermissions/ },
    { name: 'hasPermission function', pattern: /function hasPermission/ },
    { name: 'canAccessResource function', pattern: /function canAccessResource/ }
  ];
  
  rbacChecks.forEach(check => {
    if (check.pattern.test(rbacContent)) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`❌ ${check.name} - ESTRUTURA FALTANDO`);
      allFilesExist = false;
    }
  });
} else {
  console.log('❌ rbac.ts não encontrado');
  allFilesExist = false;
}

// Verificar testes
console.log('\n🧪 Verificando testes...');
const testFiles = [
  '__tests__/rbac.test.ts',
  '__tests__/auth-middleware.test.ts'
];

testFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - TESTE FALTANDO`);
  }
});

// Resultado final
console.log('\n' + '='.repeat(50));
if (allFilesExist) {
  console.log('🎉 VERIFICAÇÃO CONCLUÍDA COM SUCESSO!');
  console.log('✅ Todos os arquivos críticos estão presentes');
  console.log('✅ Dependências estão configuradas');
  console.log('✅ Estrutura RBAC está implementada');
  console.log('\n📋 Próximos passos:');
  console.log('1. Configure as variáveis de ambiente no .env.local');
  console.log('2. Inicie o MongoDB');
  console.log('3. Execute npm run dev');
  console.log('4. Teste o registro e login de usuários');
  console.log('5. Verifique o funcionamento do RBAC');
} else {
  console.log('❌ VERIFICAÇÃO FALHOU!');
  console.log('Alguns arquivos críticos estão faltando.');
  console.log('Revise a implementação antes de prosseguir.');
}
console.log('='.repeat(50));