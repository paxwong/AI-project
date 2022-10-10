import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    // Deletes ALL existing entries
    await knex("users").del();
    await knex("posts").del();
    await knex("likes").del();
    await knex("comments").del();
    await knex("raw_images").del();
    await knex("converted_images").del();

    // Inserts seed entries
    await knex("users").insert([
        { id: 1, nickname: "ling", email: "ling@gmail.com", password: "123", is_admin: "true" },
        { id: 2, nickname: "pax", email: "pax@gmail.com", password: "123", is_admin: "true" },
        { id: 3, nickname: "matthew", email: "matthew@gmail.com", password: "123", is_admin: "true" }
    ]);

    await knex("posts").insert([
        { id: 1, caption: "One Punch!!!!!!", status: "completed", user_id: "1" },
        { id: 2, caption: "Attack on Titan", status: "completed", user_id: "2" },
        { id: 3, caption: "NARUTO", status: "completed", user_id: "3" },
    ]);

    await knex("likes").insert([
        { id: 1, user_id: "1", post_id: "1" },
        { id: 2, user_id: "2", post_id: "2" },
        { id: 3, user_id: "3", post_id: "3" },
    ]);

    await knex("comments").insert([
        { id: 1, content: "Ging!!!", user_id: "1", post_id: "1" },
        { id: 2, content: "Chiu Ging!!", user_id: "2", post_id: "2" },
        { id: 3, content: "WOW!!!", user_id: "3", post_id: "3" }
    ]);

    await knex("raw_images").insert([
        { id: 1, image: "one-punch-man-raw.jpeg", post_id: "1" },
        { id: 2, image: "attack-on-titan-ss2-raw.jpeg", post_id: "2" },
        { id: 3, image: "naruto-raw.jpeg", post_id: "3" }
    ]);

    await knex("converted_images").insert([
        { id: 1, image: "one-punch-man.jpeg", post_id: "1", raw_id: "1" },
        { id: 2, image: "attack-on-titan-ss2.jpeg", post_id: "2", raw_id: "2" },
        { id: 3, image: "naruto.jpeg", post_id: "3", raw_id: "3" }
    ]);

};
