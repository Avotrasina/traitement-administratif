import prisma from "../lib/prisma";



export async function addDocument(documents: any) {
  const docs = await prisma.fichiers.createManyAndReturn({
    data: documents,    
  })

  return docs;
}

