import prisma from "../lib/prisma";



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