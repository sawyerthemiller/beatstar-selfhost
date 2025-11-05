import { PrismaClient } from '@prisma/client';

const oldPrisma = new PrismaClient({
	datasources: {
		db: {
			url: "postgresql://postgres:postgres@localhost:5432/beatstar"
		}
	}
});

export default oldPrisma;
