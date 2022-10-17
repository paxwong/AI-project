import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    if (await knex.schema.hasTable("posts")) {
        await knex.schema.table("posts", (table) => {
            table.boolean('is_deleted').defaultTo(false);
        });
    }

    if (await knex.schema.hasTable("likes")) {
        await knex.schema.table("likes", (table) => {
            table.boolean('is_deleted').defaultTo(false);
        });
    }
}


export async function down(knex: Knex): Promise<void> {
    if (await knex.schema.hasTable("posts")) {
        await knex.schema.table("posts", (table) => {
            table.dropColumn('is_deleted')
        });
    }

    if (await knex.schema.hasTable("likes")) {
        await knex.schema.table("likes", (table) => {
            table.dropColumn('is_deleted')
        });
    }
}

