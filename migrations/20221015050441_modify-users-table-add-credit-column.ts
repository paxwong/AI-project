import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    if (await knex.schema.hasTable("users")) {
        await knex.schema.table("users", (table) => {
            table.integer('credit').defaultTo(5);
        });
    }
}


export async function down(knex: Knex): Promise<void> {
    if (await knex.schema.hasTable("users")) {
        await knex.schema.table("users", (table) => {
            table.dropColumn('credit')
        });
    }
}

