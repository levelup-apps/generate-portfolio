import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic, createAnthropic } from "@ai-sdk/anthropic";

import fs from 'fs/promises';
import path from "path";

import { resumeSchema } from "./resume-schema.js";

async function getFileContent(filePath) {
    try {
        const fileExtension = path.extname(filePath).toLowerCase();

        if (fileExtension === ".pdf") {
            // For pdf files, return as base64 encoded string
            const fileBuffer = await fs.readFile(filePath);
            return fileBuffer.toString("base64");
        } else {
            // For text files or any other format, return as plain text
            return await fs.readFile(filePath, "utf8");
        }
    } catch (error) {
        console.error(`Error reading file ${filePath}:`, error);
        throw error;
    }
}

async function extractJson(fileContent) {

    const systemPrompt = `
You are a helpful assistant. Your job is to extract data from the input and generate a structured output. 
`;
    const userPrompt = `
Extract structured data from this input. The output must match the schema given to you. 
Input: ${fileContent}
    `;

    try {
        // Read API key from env local, but this is not working yet.
        // const customAnthropic = createAnthropic({
        //     apiKey: process.env.ANTHROPIC_API_KEY,
        //     // Add other options as needed
        // });

        const { object } = await generateObject({
            // model: openai("gpt-4"),
            model: anthropic("claude-3-5-sonnet-latest"),
            system: systemPrompt,
            prompt: userPrompt,
            schema: resumeSchema,
        });

        return object;
    } catch (error) {
        console.error("Error generating object:", error);
        throw error;
    }
}

async function parse(filePath) {
    // Read the resume file from a static text file or PDF file
    // const filePath = "./resume-sample.txt";
    // const filePath = "./resume-sample.pdf";
    
    if(!filePath) {
        // If filePath is invalid, read the resume file from a static file - plain txt or PDF file
        console.log(`INFO: File not specified. Defaulting to the static file`);
        filePath = "./resume-sample.pdf";
        // filePath = "./resume-sample.txt";
    }
    console.log(`INFO: Parsing resume file: ${filePath}`);

    const fileContent = await getFileContent(filePath);
    const resumeJson = await extractJson(fileContent);

    console.log("INFO: Generated JSON object..\n", resumeJson);
}

// Use async IIFE to run the main function
(async function main() {
    try {
        await parse();
    } catch (error) {
        console.error("Error in main:", error);
        process.exit(1);
    }
})();
