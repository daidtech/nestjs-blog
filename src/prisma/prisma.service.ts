// prisma.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	private readonly pool: Pool;

	constructor() {
		const connectionString = process.env.DATABASE_URL;
		// Fall back to PG* env vars when DATABASE_URL is not explicitly set.
		const pool = connectionString
			? new Pool({ connectionString })
			: new Pool();

		super({
			adapter: new PrismaPg(pool),
		});

		this.pool = pool;
	}

	async onModuleInit() {
		await this.$connect();
	}

	async onModuleDestroy() {
		await this.$disconnect();
		await this.pool.end();
	}
}