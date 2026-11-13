import { PrismaClient } from "@prisma/client";
import { doctorsSeed, reviewsSeed, servicesSeed } from "./seed-data";
import { legacyDoctorSlugs } from "./doctor-aliases";

const prisma = new PrismaClient();

// Match the original demo rows by name so localisation preserves their IDs.
const legacyPriceNames: Record<string, string[]> = {
  terapiya: ["Лечение кариеса", "Лечение пульпита"],
  gigiena: ["Комплексная гигиена"],
  otbelivanie: ["Кабинетное отбеливание"],
  implantaciya: ["Установка импланта", "Коронка на имплант"],
  ortodontiya: ["Металлическая брекет-система", "Лечение на элайнерах"],
  hirurgiya: ["Удаление зуба", "Удаление зуба мудрости"]
};

async function main() {
  for (const item of servicesSeed) {
    const { prices, ...service } = item;
    const serviceData = { ...service, treatmentSteps: [...service.treatmentSteps] };
    const savedService = await prisma.service.upsert({
      where: { slug: service.slug },
      update: serviceData,
      create: serviceData
    });

    for (const [index, price] of prices.entries()) {
      await prisma.$transaction(async (tx) => {
        const legacyName = legacyPriceNames[service.slug]?.[index];
        const current = await tx.price.findUnique({
          where: { serviceId_name: { serviceId: savedService.id, name: price.name } }
        });
        const legacy = legacyName ? await tx.price.findUnique({
          where: { serviceId_name: { serviceId: savedService.id, name: legacyName } }
        }) : null;
        const existing = current || legacy;
        const data = { ...price, priceTo: "priceTo" in price ? price.priceTo : null };
        if (existing) await tx.price.update({ where: { id: existing.id }, data });
        else await tx.price.create({ data: { ...data, serviceId: savedService.id } });
        // If both versions were seeded previously, keep the duplicate for reference.
        if (current && legacy) await tx.price.update({ where: { id: legacy.id }, data: { isActive: false } });
      });
    }
  }

  for (const item of doctorsSeed) {
    const { serviceSlugs, ...doctor } = item;
    const doctorData = {
      ...doctor,
      photoPublicId: null,
      specialties: [...doctor.specialties],
      education: [...doctor.education],
      certificates: [...doctor.certificates]
    };
    await prisma.$transaction(async (tx) => {
      const legacySlug = Object.keys(legacyDoctorSlugs).find((slug) => legacyDoctorSlugs[slug] === doctor.slug);
      const current = await tx.doctor.findUnique({ where: { slug: doctor.slug } });
      const legacy = legacySlug ? await tx.doctor.findUnique({ where: { slug: legacySlug } }) : null;
      if (current && legacy) throw new Error(`Both current and legacy profiles exist for ${doctor.slug}; reconcile them before seeding to preserve booking relationships.`);
      const existing = current || legacy;
      if (existing) {
        await tx.doctor.update({ where: { id: existing.id }, data: {
          ...doctorData, services: { set: serviceSlugs.map((slug) => ({ slug })) }
        } });
      } else {
        await tx.doctor.create({ data: {
          ...doctorData, services: { connect: serviceSlugs.map((slug) => ({ slug })) }
        } });
      }
    });
  }

  const legacyReviews = [
    { author: "Мария С.", text: "Впервые лечила зуб без тревоги. Анна подробно объяснила каждый этап, а результат выглядит совершенно естественно." },
    { author: "Алексей П.", text: "Понравились чёткий план и спокойное отношение. После установки импланта администратор сам позвонил и уточнил самочувствие." },
    { author: "Ольга К.", text: "Лечусь на элайнерах уже восемь месяцев. Вижу отличный прогресс, все визиты проходят вовремя и без спешки." },
    { author: "Ирина Л.", text: "Очень деликатная чистка и полезные рекомендации по домашнему уходу. Клиника светлая, команда внимательная." }
  ];
  for (const [index, review] of reviewsSeed.entries()) {
    await prisma.$transaction(async (tx) => {
      const current = await tx.review.findFirst({ where: { author: review.author, text: review.text } });
      const legacy = await tx.review.findFirst({ where: legacyReviews[index] });
      const existing = current || legacy;
      const data = { ...review, createdAt: new Date(Date.UTC(2026, 4 - index, 18 - index * 3, 12)) };
      if (existing) await tx.review.update({ where: { id: existing.id }, data });
      else await tx.review.create({ data });
      if (current && legacy) await tx.review.update({ where: { id: legacy.id }, data: { isVisible: false } });
    });
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
