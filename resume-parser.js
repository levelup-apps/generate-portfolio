import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic, createAnthropic } from "@ai-sdk/anthropic";

import fs from 'fs/promises';
import path from "path";
import { fileURLToPath } from "url";

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
You are an expert resume parser focused on accurately extracting structured data from resumes. When extracting information:
1. Parse the content systematically, section by section
2. Ensure all required fields from the schema are populated
3. Format dates according to ISO 8601 (YYYY-MM-DD) specification
4. Convert relative dates like "current" or "present" to today's date (2025-01-15)
5. Validate the output against the provided JSON schema
6. Flag any missing required fields or validation issues
7. For any optional fields that are not present in the source text, omit them entirely from the output JSON rather than using null values
8. Pay special attention to date fields - if a date is not known, the field should be omitted entirely from the output rather than being set to null
9. For work experience entries, ensure each company has at least one position entry with required fields
10. Handle nested optional fields (like technologies, team, location) by omitting them when not present

For each section you parse, think step by step and explain your reasoning if there are any assumptions or transformations made.`;

    const userPrompt = `
Please extract structured data from the following textual respresentation of the resume:

<resume>
${fileContent}
</resume>

Critical requirements:
1. All URLs must include https:// prefix
2. Dates must be in ISO 8601 format with time (YYYY-MM-DDT00:00:00Z)
3. If a date is unknown or not present in the resume, DO NOT include that field in the output JSON at all
4. For current/present positions, use today's date (2025-01-15T00:00:00Z)
5. The "socialProfiles" array must include all social profiles found
6. All dates should be interpreted as the first of the mentioned month (e.g. "May 2021" becomes "2021-05-01T00:00:00Z")

Date handling for education and work experience:
- If date is known: "startDate": "2021-05-01T00:00:00Z"
- If date is unknown: omit the field entirely, do not use null
- For current positions: use "endDate": "2025-01-15T00:00:00Z"

Work experience specific requirements:
1. Each work entry must have a company name and at least one position
2. For positions array:
   - Each position must have a title
   - Include startDate if known, omit if unknown
   - Include endDate if known, use current date for present positions, omit if unknown
   - Include location, team, description if available, omit if not
3. Technologies object should only be included if specific technologies are mentioned
4. Duration fields should be omitted if not explicitly stated

Example structure for work experience:
{
  "work": [
    {
      "company": "Company Name",
      "positions": [
        {
          "title": "Job Title",
          "startDate": "2020-08-01T00:00:00Z",
          "endDate": "2025-01-15T00:00:00Z",  // for current position
          "location": "City, State",
          "description": "Job description"
          // notice team and technologies are omitted when not present
        }
      ]
    }
  ]
}

Please process step by step and validate against these requirements.
`;

    try {
        // Read API key from env local, but this is not working yet.
        // const customAnthropic = createAnthropic({
        //     apiKey: process.env.ANTHROPIC_API_KEY,
        //     // Add other options as needed
        // });

        // const model = openai("gpt-4");
        const model = anthropic("claude-3-5-sonnet-latest");

        const { object } = await generateObject({
            model: model,
            system: systemPrompt,
            prompt: userPrompt,
            schema: resumeSchema,
        });

        console.log(`INFO: Success generating JSON object using LLM: ${model.provider} ${model.modelId}`);

        return object;

    } catch (error) {
        console.error("Error generating object:", error);
        throw error;
    }
}

async function parse(filePath) {
    
    if(!filePath) {
        console.log(`ERROR: Resume file not specified. Cannot parse the resume.`);
        return;
    }

    console.log(`INFO: Parsing resume file: ${filePath}`);

    const fileContent = await getFileContent(filePath);
    const resumeJson = await extractJson(fileContent);

    return resumeJson;
}

// Run the main function only if this file is being run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    (async function main() {
        try {
            // const filePath = "./resume-sample.pdf";
            const filePath = "./resume-sample.txt";
            const resumeJson = await parse(filePath);
            console.log("INFO: Generated JSON object..\n", resumeJson);
        } catch (error) {
            console.error("Error in main:", error);
            process.exit(1);
        }
    })();
}

export { parse };