import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    if (await knex.schema.hasTable("users")) {
        await knex.schema.table("users", (table) => {
            table.string('icon').defaultTo('default-icon.jpg');
        });
    }
}


export async function down(knex: Knex): Promise<void> {
    if (await knex.schema.hasTable("users")) {
        await knex.schema.table("users", (table) => {
            table.dropColumn('icon')
        });
    }
}

