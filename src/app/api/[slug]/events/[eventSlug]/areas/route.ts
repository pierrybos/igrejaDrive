// src/app/api/[slug]/events/[eventSlug]/areas/route.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { slug: string; eventSlug: string } }
) {
  const { slug, eventSlug } = params;

  // 1) Busca a instituição pelo slug
  const institution = await prisma.institution.findUnique({
    where: { slug },
  });
  if (!institution) {
    return new Response(JSON.stringify({ error: "Institution not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 2) Busca o evento dentro daquela instituição
  const event = await prisma.event.findFirst({
    where: {
      slug: eventSlug,
      institutionId: institution.id,
    },
  });
  if (!event) {
    return new Response(JSON.stringify({ error: "Event not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 3) Busca as áreas relacionadas a esse evento
  const areas = await prisma.area.findMany({
    where: { eventId: event.id },
  });

  return new Response(JSON.stringify(areas), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
