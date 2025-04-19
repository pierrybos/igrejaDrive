// src/utils/authMiddleware.ts
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function withRole(
  req: Request,
  allowedRoles: string | string[]
) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 })
  }

  // normalize para array
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]

  // session.user.role vem do NextAuth
  if (!roles.includes(session.user.role as string)) {
    return NextResponse.json({ message: "Acesso negado" }, { status: 403 })
  }

  return null
}



/*/ src/utils/authMiddleware.ts
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Ajuste o caminho conforme seu setup
import { checkRole } from "./authUtils";

export const withRole = async (req: Request, roles: string[]) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Não autenticado" }, { status: 401 });
  }

  if (!checkRole(session.user, roles)) {
    return NextResponse.json({ message: "Acesso negado" }, { status: 403 });
  }

  return null; // Retorna null se o usuário tiver a role necessária
};
*/