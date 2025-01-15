import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const schema = z.object({
    notifications: z.array(
        z.object({
            name: z.string().describe("Name of a fictional person."),
            message: z.string().describe("Do not use emojis or links."),
            minutesAgo: z.number(),
        })
    ),
});

async function generate() {

    const systemPrompt = `You are a helpful assistant.`;

    const userPrompt = `You are a helpful assistant. Your job is to extract structured data out of this prompt. 
    The output should match the schema given to you.`;

    try {
        const { object } = await generateObject({
            model: openai("gpt-4"),
            system: systemPrompt,
            prompt: userPrompt,
            schema: schema,
        });

        console.log('......Object....\n', object);

        return object;
    } catch (error) {
        console.error("Error generating object:", error);
        throw error;
    }
}

async function extract() {
    console.log(`extracting resume sections from file..`);

    await generate();
}

// Use async IIFE to run the main function
(async function main() {
    try {
        await extract();
    } catch (error) {
        console.error("Error in main:", error);
        process.exit(1);
    }
})();
