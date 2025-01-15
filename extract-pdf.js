import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import fs from 'fs/promises';
import { resumeSchema } from "./resume-schema.js";

async function getStaticFileContent() {

    const filePath = "./resume-sample.txt";

    // Read file as plain text
    const textContent = await fs.readFile(filePath, "utf8");
    return textContent;

    // if you want to read as base64 encoded string, do this
    // const fileBuffer = await fs.readFile(filePath);
    // const base64Pdf = fileBuffer.toString("base64");
    // return base64Pdf;
}

async function getPdfFileContent() {
    const pdfBuffer = await fs.readFile('./resume-sample.pdf');
    const base64Pdf = pdfBuffer.toString("base64");

    return base64Pdf;
}

async function generate() {
    
    // Read the resume file from a static text file or given PDF file
    const fileContent = await getStaticFileContent();
    // const fileContent = await getPdfFileContent();

    const systemPrompt = `
You are a helpful assistant. Your job is to extract data from the input and generate a structured output. 
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

        console.log("......Generated JSON object....\n", object);

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
