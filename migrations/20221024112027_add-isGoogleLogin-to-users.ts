import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    if (await knex.schema.hasTable("users")) {
        await knex.schema.table("users", (table) => {
            table.boolean('is_google').defaultTo(false);
        });
    }
}


export async function down(knex: Knex): Promise<void> {
    if (await knex.schema.hasTable("users")) {
        await knex.schema.table("users", (table) => {
            table.dropColumn('is_google')
        });
    }
}

