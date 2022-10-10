import type { Knex } from "knex";
import { env } from "./utils/env";


// Update with your config settings.

const config: { [key: string]: Knex.Config } = {
  development: {
    client: "postgresql",
    connection: {
      database: env.DB_NAME,
      user: env.DB_USERNAME,
      password: env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  staging: {
    client: "postgresql",
    connection: {
      database: env.DB_NAME,
      user: env.DB_USERNAME,
      password: env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  },

  production: {
    client: "postgresql",
    connection: {
      database: env.DB_NAME,
      user: env.DB_USERNAME,
      password: env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }

};

module.exports = config;
