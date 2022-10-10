import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    if (!(await knex.schema.hasTable("users"))) {
        await knex.schema.createTable("users", (table) => {
            table.increments();
            table.string("nickname").unique().notNullable();
            table.string("email").unique().notNullable();
            table.string("password").notNullable();
            table.boolean('is_admin').notNullable();
            table.timestamps(false, true);
        });
    }
    if (!(await knex.schema.hasTable("posts"))) {
        await knex.schema.createTable("posts", (table) => {
            table.increments();
            table.string("caption");
            table.string("status").notNullable();
            table.integer("user_id").unsigned().notNullable();
            table.foreign("user_id").references("users.id");
            table.timestamps(false, true);
        });
    }
    if (!(await knex.schema.hasTable("likes"))) {
        await knex.schema.createTable("likes", (table) => {
            table.increments();
            table.integer("user_id").unsigned().notNullable();
            table.foreign("user_id").references("users.id");
            table.integer("post_id").unsigned().notNullable();
            table.foreign("post_id").references("posts.id");
            table.timestamps(false, true);
        });
    }
    if (!(await knex.schema.hasTable("comments"))) {
        await knex.schema.createTable("comments", (table) => {
            table.increments();
            table.string("content").notNullable();
            table.integer("user_id").unsigned().notNullable();
            table.foreign("user_id").references("users.id");
            table.integer("post_id").unsigned().notNullable();
            table.foreign("post_id").references("posts.id");
            table.timestamps(false, true);
        });
    }
    if (!(await knex.schema.hasTable("raw_images"))) {
        await knex.schema.createTable("raw_images", (table) => {
            table.increments();
            table.string("image").notNullable();
            table.integer("post_id").unsigned().notNullable();
            table.foreign("post_id").references("posts.id");
        });
    }
    if (!(await knex.schema.hasTable("converted_images"))) {
        await knex.schema.createTable("converted_images", (table) => {
            table.increments();
            table.string("image").notNullable();
            table.integer("post_id").unsigned().notNullable();
            table.foreign("post_id").references("posts.id");
            table.integer("raw_id").unsigned().notNullable();
            table.foreign("raw_id").references("raw_images.id");
        });
    }
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists("users");
    await knex.schema.dropTableIfExists("posts");
    await knex.schema.dropTableIfExists("likes");
    await knex.schema.dropTableIfExists("comments");
    await knex.schema.dropTableIfExists("raw_images");
    await knex.schema.dropTableIfExists("converted_images");
}

