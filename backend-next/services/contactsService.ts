import { prisma } from "@/lib/prisma";

export type ContactFilter = {
  email?: string;
  subject?: string;
  isRead?: boolean;
};

export async function getContacts(filter: ContactFilter = {}) {
  const where: any = {};

  if (filter.email) where.email = filter.email;
  if (filter.subject) where.subject = filter.subject;
  if (typeof filter.isRead === 'boolean') where.isRead = filter.isRead;

  return prisma.contact.findMany({
    where,
    orderBy: { submittedAt: "desc" },
  });
}

export async function getContactById(id: string) {
  return prisma.contact.findUnique({
    where: { id },
  });
}

export async function createContact(data: {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}) {
  return prisma.contact.create({
    data,
  });
}

export async function updateContactById(
  id: string,
  updatedData: Partial<{
    fullName: string;
    email: string;
    subject: string;
    message: string;
    isRead: boolean;
  }>
) {
  return prisma.contact.update({
    where: { id },
    data: updatedData,
  });
}

export async function deleteContactById(id: string) {
  return prisma.contact.delete({
    where: { id },
  });
}