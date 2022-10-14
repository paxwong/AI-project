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
        { nickname: "ling", email: "ling@gmail.com", password: "123", is_admin: "true" },
        { nickname: "pax", email: "pax@gmail.com", password: "123", is_admin: "true" },
        { nickname: "matthew", email: "matthew@gmail.com", password: "123", is_admin: "true" }
    ]);

    await knex("posts").insert([
        { caption: "One Punch!!!!!!", status: "completed", user_id: "1" },
        { caption: "Attack on Titan", status: "completed", user_id: "2" },
        { caption: "NARUTO", status: "completed", user_id: "3" },
    ]);

    await knex("likes").insert([
        { user_id: "1", post_id: "1" },
        { user_id: "2", post_id: "2" },
        { user_id: "3", post_id: "3" },
    ]);

    await knex("comments").insert([
        { content: "Ging!!!", user_id: "1", post_id: "1" },
        { content: "Chiu Ging!!", user_id: "2", post_id: "2" },
        { content: "WOW!!!", user_id: "3", post_id: "3" }
    ]);

    await knex("raw_images").insert([
        { image: "one-punch-man-raw.jpg", post_id: "1" },
        { image: "attack-on-titan-ss2-raw.jpg", post_id: "2" },
        { image: "naruto-raw.jpg", post_id: "3" }
    ]);

    await knex("converted_images").insert([
        { image: "one-punch-man.jpeg", post_id: "1", raw_id: "1" },
        { image: "attack-on-titan-ss2.jpeg", post_id: "2", raw_id: "2" },
        { image: "naruto.jpeg", post_id: "3", raw_id: "3" }
    ]);

};
