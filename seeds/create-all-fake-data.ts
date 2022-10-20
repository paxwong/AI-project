import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex.raw('truncate table converted_images restart identity cascade ')
    await knex.raw('truncate table raw_images restart identity cascade ')
    await knex.raw('truncate table comments restart identity cascade ')
    await knex.raw('truncate table posts restart identity cascade ')
    await knex.raw('truncate table users restart identity cascade ')
    // await knex("converted_images").del();
    // await knex("raw_images").del();
    // await knex("comments").del();
    // await knex("posts").del();
    // await knex("users").del();


    // Inserts seed entries
    await knex("users").insert([
        { nickname: "Ling", email: "ling@gmail.com", password: "$2a$10$4H0vD93F55kLIhktVX/o8.McC0gjIrA8/5I2oG1XW8tUe7vY65HBG", is_admin: "true",credit:9999999 },
        { nickname: "Pax", email: "pax@gmail.com", password: "$2a$10$H1e9epNeoEI/dUa8sHLvTORmRdfOrhoFfC4iDOAlC0QOkt4d1m0wO", is_admin: "true",credit:9999999 },
        { nickname: "Matthew", email: "matthew@gmail.com", password: "$2a$10$.IAgoir.hdj0zzSZIcz/5uLp2bRqrPZL4K7J3KGjyPRW.xPTyvakC", is_admin: "true" ,credit:9999999}
    ]);

    await knex("posts").insert([
        { caption: "One Punch!!!!!!", status: "public", user_id: "1" },
        { caption: "Attack on Titan", status: "public", user_id: "2" },
        { caption: "NARUTO", status: "public", user_id: "3" },
    ]);

    await knex("likes").insert([
        { user_id: "1", post_id: "1" },
        { user_id: "2", post_id: "2" },
        { user_id: "3", post_id: "3" },
        { user_id: "3", post_id: "1" },
        { user_id: "2", post_id: "1" },
    ]);

    await knex("comments").insert([
        { content: "Ging!!!", user_id: "1", post_id: "1" },
        { content: "Chiu Ging!!", user_id: "2", post_id: "2" },
        { content: "WOW!!!", user_id: "3", post_id: "3" },
        { content: "WOW!!!", user_id: "2", post_id: "3" },
        { content: "WOW!!!", user_id: "3", post_id: "3" },
        { content: "WOW!!!", user_id: "3", post_id: "3" },
        { content: "WOW!!!", user_id: "2", post_id: "3" },
        { content: "WOW!!!", user_id: "3", post_id: "3" },
        { content: "WOW!!!", user_id: "2", post_id: "3" },
        { content: "WOW!!!", user_id: "3", post_id: "3" },
        { content: "WOW!!!", user_id: "2", post_id: "3" }
    ]);

    await knex("raw_images").insert([
        { image: "one-punch-man-raw.jpeg", post_id: "1" },
        { image: "attack-on-titan-ss2-raw.jpeg", post_id: "2" },
        { image: "naruto-raw.jpeg", post_id: "3" },
        { image: "one-punch-man-2-raw.jpg", post_id: "1" },
    ]);

    await knex("converted_images").insert([
        { image: "one-punch-man.jpeg", post_id: "1", raw_id: "1" },
        { image: "attack-on-titan-ss2.jpeg", post_id: "2", raw_id: "2" },
        { image: "naruto.jpeg", post_id: "3", raw_id: "3" },
        { image: "one-punch-man-2.jpeg", post_id: "1", raw_id: "4" },
    ]);

};
