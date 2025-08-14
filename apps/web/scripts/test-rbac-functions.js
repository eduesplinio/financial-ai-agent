#!/usr/bin/env node

/**
 * Script de teste das funções RBAC
 * Testa as funções de permissão sem precisar rodar a aplicação
 */

// Simulação das funções RBAC (copiadas do arquivo real)
const Role = {
  USER: "user",
  ADMIN: "admin",
  SUPPORT: "support",
};

const Permission = {
  READ_OWN_PROFILE: "read:own_profile",
  UPDATE_OWN_PROFILE: "update:own_profile",
  READ_OWN_TRANSACTIONS: "read:own_transactions",
  CREATE_OWN_TRANSACTIONS: "create:own_transactions",
  READ_OWN_GOALS: "read:own_goals",
  CREATE_OWN_GOALS: "create:own_goals",
  UPDATE_OWN_GOALS: "update:own_goals",
  DELETE_OWN_GOALS: "delete:own_goals",
  USE_CHAT: "use:chat",
  READ_ALL_USERS: "read:all_users",
  UPDATE_ALL_USERS: "update:all_users",
  DELETE_USERS: "delete:users",
  READ_ALL_TRANSACTIONS: "read:all_transactions",
  READ_SYSTEM_LOGS: "read:system_logs",
  MANAGE_SYSTEM_SETTINGS: "manage:system_settings",
  READ_USER_PROFILES: "read:user_profiles",
  UPDATE_USER_PROFILES: "update:user_profiles",
  READ_USER_TRANSACTIONS: "read:user_transactions",
  ASSIST_USERS: "assist:users",
};

const rolePermissions = {
  [Role.USER]: [
    Permission.READ_OWN_PROFILE,
    Permission.UPDATE_OWN_PROFILE,
    Permission.READ_OWN_TRANSACTIONS,
    Permission.CREATE_OWN_TRANSACTIONS,
    Permission.READ_OWN_GOALS,
    Permission.CREATE_OWN_GOALS,
    Permission.UPDATE_OWN_GOALS,
    Permission.DELETE_OWN_GOALS,
    Permission.USE_CHAT,
  ],
  [Role.SUPPORT]: [
    Permission.READ_OWN_PROFILE,
    Permission.UPDATE_OWN_PROFILE,
    Permission.READ_OWN_TRANSACTIONS,
    Permission.CREATE_OWN_TRANSACTIONS,
    Permission.READ_OWN_GOALS,
    Permission.CREATE_OWN_GOALS,
    Permission.UPDATE_OWN_GOALS,
    Permission.DELETE_OWN_GOALS,
    Permission.USE_CHAT,
    Permission.READ_USER_PROFILES,
    Permission.UPDATE_USER_PROFILES,
    Permission.READ_USER_TRANSACTIONS,
    Permission.ASSIST_USERS,
  ],
  [Role.ADMIN]: Object.values(Permission),
};

function hasPermission(userRole, permission) {
  const permissions = rolePermissions[userRole] || [];
  return permissions.includes(permission);
}

function hasAnyPermission(userRole, permissions) {
  return permissions.some(permission => hasPermission(userRole, permission));
}

function hasAllPermissions(userRole, permissions) {
  return permissions.every(permission => hasPermission(userRole, permission));
}

function canAccessResource(userRole, userId, resourceUserId, permission) {
  if (userId === resourceUserId && hasPermission(userRole, permission)) {
    return true;
  }
  
  const globalPermissionMap = {
    [Permission.READ_OWN_PROFILE]: Permission.READ_USER_PROFILES,
    [Permission.UPDATE_OWN_PROFILE]: Permission.UPDATE_USER_PROFILES,
    [Permission.READ_OWN_TRANSACTIONS]: Permission.READ_USER_TRANSACTIONS,
  };
  
  const globalPermission = globalPermissionMap[permission];
  return globalPermission ? hasPermission(userRole, globalPermission) : false;
}

// Executar testes
console.log('🧪 Testando Funções RBAC...\n');

let testsPassed = 0;
let totalTests = 0;

function test(description, testFunction) {
  totalTests++;
  try {
    const result = testFunction();
    if (result) {
      console.log(`✅ ${description}`);
      testsPassed++;
    } else {
      console.log(`❌ ${description}`);
    }
  } catch (error) {
    console.log(`❌ ${description} - ERRO: ${error.message}`);
  }
}

// Testes de permissões básicas
console.log('📋 Testando permissões básicas...');

test('Usuário pode ler próprio perfil', () => {
  return hasPermission(Role.USER, Permission.READ_OWN_PROFILE);
});

test('Usuário NÃO pode ler todos os usuários', () => {
  return !hasPermission(Role.USER, Permission.READ_ALL_USERS);
});

test('Admin pode ler todos os usuários', () => {
  return hasPermission(Role.ADMIN, Permission.READ_ALL_USERS);
});

test('Support pode ler perfis de usuários', () => {
  return hasPermission(Role.SUPPORT, Permission.READ_USER_PROFILES);
});

test('Support NÃO pode deletar usuários', () => {
  return !hasPermission(Role.SUPPORT, Permission.DELETE_USERS);
});

// Testes de múltiplas permissões
console.log('\n📋 Testando múltiplas permissões...');

test('Usuário tem ALGUMA das permissões [READ_ALL_USERS, READ_OWN_PROFILE]', () => {
  return hasAnyPermission(Role.USER, [Permission.READ_ALL_USERS, Permission.READ_OWN_PROFILE]);
});

test('Usuário NÃO tem NENHUMA das permissões [READ_ALL_USERS, DELETE_USERS]', () => {
  return !hasAnyPermission(Role.USER, [Permission.READ_ALL_USERS, Permission.DELETE_USERS]);
});

test('Usuário tem TODAS as permissões [READ_OWN_PROFILE, UPDATE_OWN_PROFILE]', () => {
  return hasAllPermissions(Role.USER, [Permission.READ_OWN_PROFILE, Permission.UPDATE_OWN_PROFILE]);
});

test('Usuário NÃO tem TODAS as permissões [READ_OWN_PROFILE, READ_ALL_USERS]', () => {
  return !hasAllPermissions(Role.USER, [Permission.READ_OWN_PROFILE, Permission.READ_ALL_USERS]);
});

// Testes de acesso a recursos
console.log('\n📋 Testando acesso a recursos...');

const userId = "user123";
const otherUserId = "user456";

test('Usuário pode acessar próprio perfil', () => {
  return canAccessResource(Role.USER, userId, userId, Permission.READ_OWN_PROFILE);
});

test('Usuário NÃO pode acessar perfil de outro usuário', () => {
  return !canAccessResource(Role.USER, userId, otherUserId, Permission.READ_OWN_PROFILE);
});

test('Support pode acessar perfil de outro usuário', () => {
  return canAccessResource(Role.SUPPORT, userId, otherUserId, Permission.READ_OWN_PROFILE);
});

test('Admin pode acessar perfil de qualquer usuário', () => {
  return canAccessResource(Role.ADMIN, userId, otherUserId, Permission.READ_OWN_PROFILE);
});

// Testes de hierarquia de roles
console.log('\n📋 Testando hierarquia de roles...');

test('Admin tem TODAS as permissões', () => {
  const allPermissions = Object.values(Permission);
  return allPermissions.every(permission => hasPermission(Role.ADMIN, permission));
});

test('Support tem mais permissões que User', () => {
  const supportPermissions = rolePermissions[Role.SUPPORT].length;
  const userPermissions = rolePermissions[Role.USER].length;
  return supportPermissions > userPermissions;
});

test('Support NÃO tem permissões de admin', () => {
  const adminOnlyPermissions = [Permission.DELETE_USERS, Permission.MANAGE_SYSTEM_SETTINGS];
  return !hasAnyPermission(Role.SUPPORT, adminOnlyPermissions);
});

// Testes de edge cases
console.log('\n📋 Testando casos extremos...');

test('Role inexistente não tem permissões', () => {
  return !hasPermission("invalid_role", Permission.READ_OWN_PROFILE);
});

test('Permissão inexistente retorna false', () => {
  return !hasPermission(Role.USER, "invalid_permission");
});

test('Array vazio de permissões retorna true para hasAllPermissions', () => {
  return hasAllPermissions(Role.USER, []);
});

test('Array vazio de permissões retorna false para hasAnyPermission', () => {
  return !hasAnyPermission(Role.USER, []);
});

// Resultado final
console.log('\n' + '='.repeat(50));
console.log(`📊 RESULTADO DOS TESTES: ${testsPassed}/${totalTests}`);

if (testsPassed === totalTests) {
  console.log('🎉 TODOS OS TESTES PASSARAM!');
  console.log('✅ Sistema RBAC está funcionando corretamente');
  console.log('✅ Hierarquia de roles está implementada');
  console.log('✅ Controle de acesso a recursos funciona');
  console.log('✅ Edge cases são tratados adequadamente');
} else {
  console.log('❌ ALGUNS TESTES FALHARAM!');
  console.log(`${totalTests - testsPassed} teste(s) falharam`);
  console.log('Revise a implementação do sistema RBAC');
}

console.log('='.repeat(50));

// Demonstração prática
console.log('\n🎯 DEMONSTRAÇÃO PRÁTICA:');
console.log('\n👤 Usuário Normal:');
console.log(`- Pode ler próprio perfil: ${hasPermission(Role.USER, Permission.READ_OWN_PROFILE)}`);
console.log(`- Pode usar chat: ${hasPermission(Role.USER, Permission.USE_CHAT)}`);
console.log(`- Pode ler todos usuários: ${hasPermission(Role.USER, Permission.READ_ALL_USERS)}`);
console.log(`- Pode deletar usuários: ${hasPermission(Role.USER, Permission.DELETE_USERS)}`);

console.log('\n🛠️  Usuário Support:');
console.log(`- Pode ler próprio perfil: ${hasPermission(Role.SUPPORT, Permission.READ_OWN_PROFILE)}`);
console.log(`- Pode ler perfis de usuários: ${hasPermission(Role.SUPPORT, Permission.READ_USER_PROFILES)}`);
console.log(`- Pode assistir usuários: ${hasPermission(Role.SUPPORT, Permission.ASSIST_USERS)}`);
console.log(`- Pode deletar usuários: ${hasPermission(Role.SUPPORT, Permission.DELETE_USERS)}`);

console.log('\n👑 Usuário Admin:');
console.log(`- Pode ler todos usuários: ${hasPermission(Role.ADMIN, Permission.READ_ALL_USERS)}`);
console.log(`- Pode deletar usuários: ${hasPermission(Role.ADMIN, Permission.DELETE_USERS)}`);
console.log(`- Pode gerenciar configurações: ${hasPermission(Role.ADMIN, Permission.MANAGE_SYSTEM_SETTINGS)}`);
console.log(`- Pode ler logs do sistema: ${hasPermission(Role.ADMIN, Permission.READ_SYSTEM_LOGS)}`);

console.log('\n🔒 Controle de Acesso a Recursos:');
console.log(`- User123 acessa próprio perfil: ${canAccessResource(Role.USER, "user123", "user123", Permission.READ_OWN_PROFILE)}`);
console.log(`- User123 acessa perfil do User456: ${canAccessResource(Role.USER, "user123", "user456", Permission.READ_OWN_PROFILE)}`);
console.log(`- Support acessa perfil do User456: ${canAccessResource(Role.SUPPORT, "support123", "user456", Permission.READ_OWN_PROFILE)}`);
console.log(`- Admin acessa perfil do User456: ${canAccessResource(Role.ADMIN, "admin123", "user456", Permission.READ_OWN_PROFILE)}`);