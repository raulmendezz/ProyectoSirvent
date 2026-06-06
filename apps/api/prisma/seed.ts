import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash("S!rv3nt@Adm1n#2026", 12);

  const user = await prisma.user.upsert({
    where: { email: "sirventAdminSystem@sirvent.com" },
    update: {},
    create: {
      email: "sirventAdminSystem@sirvent.com",
      password: hash,
      role: "ADMIN",
    },
  });

  console.log("Usuario creado:", user.email, "| rol:", user.role);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
