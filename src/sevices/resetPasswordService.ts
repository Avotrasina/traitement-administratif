import prisma from "../lib/prisma";

export async function makeTokenAsUsed(id: number) {
  return await prisma.password_reset_tokens.update({
    where: {id},
    data: {
      is_used: true
    }
  })
}


export async function findTokenInfo(token: string) {
  return await prisma.password_reset_tokens.findUnique({
    where: { token },
    select: {
      id: true,
      user_id: true,
      token: true,
      expires_at: true,
      is_used: true
    }
  })
}

export async function saveToken(data: any) {
  return await prisma.password_reset_tokens.create({
    data: data,
    select: {
      id: true,
      user_id: true,
      token: true,
      expires_at: true,
      is_used: true
    }
  })
}