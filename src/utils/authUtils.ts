// src/utils/authUtils.ts
type User = {
  role?: string;
};

export const checkRole = (user: User, requiredRole: string|string[]| null): boolean => {
  const userRole = user?.role;
  const roles = ["USER", "ADMIN", "SUPERADMIN"]; // Ordem de permissões
  if(requiredRole){
    return requiredRole.indexOf(userRole as string);
  }
  return roles.indexOf(userRole as string) >= roles.indexOf(requiredRole);
};

export const isAdmin = (user: User) => {
  return checkRole(user, "admin");
};
