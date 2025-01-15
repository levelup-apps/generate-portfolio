import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { resumeSchema } from "./resume-schema.js";

async function generate() {

    const systemPrompt = `
You are a helpful assistant. Your job is to extract data from the input and generate a structured output. 
`;

    const fileContent = `
Liza George
UIUC BS+MCS in CS '25 | Microsoft SWE Intern
Urbana, Illinois, United States

Summary
I'm a graduate student pursuing a BS+MCS joint degree in Computer
Science in the University of Illinois Urbana Champaign. Through
university courses and projects, I have worked with Python, C, C
++, Java, and Rust, and studied the fundamentals of CS through
fourth-year level courses. I have also gained leadership roles in the
Society of Women Engineers and the Outdoor Adventure Club, and
contributed to volunteer software services through Hack4Impact.

Contact
hi.liza.george@gmail.com

www.linkedin.com/in/george-liza
(LinkedIn)

liza-george.chiramattel.com/
(Portfolio)

Top Skills
Team Management
University Teaching
Semantic Kernel

Honors-Awards
AdaHacks III - First Place in Social
Justice Division
Flex Factor Finalist
    `;

    const userPrompt = `
Extract structured data from this input. The output must match the schema given to you. 
Input: ${fileContent}
    `;

    try {
        const { object } = await generateObject({
            model: openai("gpt-4"),
            system: systemPrompt,
            prompt: userPrompt,
            schema: resumeSchema,
        });

        console.log('......Generated JSON object....\n', object);

        return object;
    } catch (error) {
        console.error("Error generating object:", error);
        throw error;
    }
}

async function extract() {
    console.log(`Extracting resume sections from file..`);

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
