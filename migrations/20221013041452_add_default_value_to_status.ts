import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    if (await knex.schema.hasTable("posts")) {
        await knex.schema.alterTable("posts", (table) => {
            table.string("status").notNullable().defaultTo("completed").alter();

        });
    }

}


export async function down(knex: Knex): Promise<void> {
    if (await knex.schema.hasTable("posts")) {
        await knex.schema.alterTable("posts", (table) => {
            table.string("status").notNullable().alter();
        });
    }
}

