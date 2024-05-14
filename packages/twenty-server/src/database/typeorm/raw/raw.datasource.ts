import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
config();

const typeORMRawModuleOptions: DataSourceOptions = {
  url: process.env.PG_DATABASE_URL,
  type: 'postgres',
  logging: ['error'],
  ssl:
    process.env.PG_SSL_ALLOW_SELF_SIGNED === 'true'
      ? {
          rejectUnauthorized: false,
        }
      : undefined,
};

export const rawDataSource = new DataSource(typeORMRawModuleOptions);
