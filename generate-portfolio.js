import inquirer from 'inquirer';
import inquirerFuzzyPath from 'inquirer-fuzzy-path'; // P1e39
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import path from 'path';
import { parseResume } from './resume-parser.js';
import { generateAllMarkdowns } from './md-generator.js';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Register the fuzzy path prompt
inquirer.registerPrompt('fuzzypath', inquirerFuzzyPath); // P115e

const PORTFOLIO_SECTIONS = {
    SUMMARY: 'Professional summary',
    EXPERIENCE: 'Work experience',
    EDUCATION: 'Education',
    SKILLS: 'Skills',
    PROJECTS: 'Projects',
    CERTIFICATIONS: 'Certifications',
    AWARDS: 'Awards/Achievements',
};

const THEMES = {
    SIMPLE: 'Simple [View sample: https://portfolio-generator-sample.vercel.app/]',
    RETRO: 'Retro (coming soon)',
};

async function validateFile(filePath) {
    try {
        await fs.promises.stat(filePath);
        const lowerPath = filePath.toLowerCase();
        if (!lowerPath.endsWith('.pdf') && !lowerPath.endsWith('.txt')) {
            return 'Please provide a PDF or text file';
        }
        return true;
    } catch (error) {
        return 'File does not exist';
    }
}

async function promptUser() {
    const questions = [
        {
            type: 'fuzzypath', // Pf5f8
            name: 'resumeFile',
            message: 'Enter the path to your LinkedIn formatted resume (PDF):',
            itemType: 'any',
            rootPath: '.',
            suggestOnly: false,
            default: 'samples/',
            depthLimit: 5,
            excludePath: nodePath => nodePath.startsWith('node_modules'),
            excludeFilter: nodePath => !nodePath.endsWith('.pdf') && !nodePath.endsWith('.txt')
        },
        {
            type: 'checkbox',
            name: 'sections',
            message: 'Select sections to include in your portfolio:',
            choices: Object.values(PORTFOLIO_SECTIONS),
            validate: (answer) => {
                if (answer.length < 1) {
                    return 'You must choose at least one section.';
                }
                return true;
            },
        },
        {
            type: 'list',
            name: 'theme',
            message: 'Select a theme for your portfolio:',
            choices: Object.values(THEMES),
            default: THEMES.SIMPLE,
        },
    ];

    const answers = await inquirer.prompt(questions);

    // Show review screen
    console.log('\nReview your choices:');
    console.log('-------------------');
    console.log(`Resume File: ${answers.resumeFile}`);
    console.log('Selected Sections:');
    answers.sections.forEach((section) => console.log(`- ${section}`));
    console.log(`Theme: ${answers.theme}`);

    const confirmation = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirmed',
            message: 'Are these choices correct?',
            default: true,
        },
    ]);

    if (!confirmation.confirmed) {
        console.log("\nLet's start over...\n");
        return promptUser();
    }

    return answers;
}

async function downloadTemplate(theme) {
    console.log(`> Downloading template...`);

    if (theme === THEMES.RETRO) {
        console.log(
            'Note: Retro theme is coming soon. Using Simple theme instead.'
        );
        theme = THEMES.SIMPLE;
    }

    // TODO: temporary, till we use the user-defined dest path
    const portfolioPath = join(__dirname, `../my-portfolio`);
    try {
        await fs.promises.mkdir(portfolioPath, {recursive: true});
    } catch(error) {
        console.log(`ERROR: Failed to create folder. `, error);
    }

    const degitProcess = spawn('npx', ['degit', 'levelup-apps/portfolio-template', '--force', portfolioPath]);

    degitProcess.stdout.on('data', (data) => {
        console.log(`> Degit log: ${data}`);
    });

    degitProcess.stderr.on('data', (data) => {
        console.log(`> Degit: ${data}`); // this show a non error message too, nothing to do abt it
    });

    await new Promise((resolve, reject) => {
        degitProcess.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`> Degit process exited with code ${code}`));
            } else {
                resolve();
            }
        });
    });

    return portfolioPath;
}

async function main() {
    try {
        console.log('Welcome to Portfolio Generator!\n');

        const answers = await promptUser();

        if (answers) {
            console.log('\n');

            const portfolioPath = await downloadTemplate(answers.theme);
            console.log('> Portfolio template downloaded.\n');

            // set to true to use LLM to generate. false to use static file.
            const useLiveLLM = false;

            let resumeJson;
            if(useLiveLLM) {
                console.log(`Parsing the PDF resume with AI ...`);
                resumeJson = await parseResume(answers.resumeFile);
                // console.log('Generated resume JSON ....\n', resumeJson);

                // write the resumeJson to the content folder
                fs.writeFileSync(path.join(portfolioPath, 'content', 'resume-data.json'), JSON.stringify(resumeJson));

            } else {
                // For debugging only - or as a backup
                const resumeText = await fs.promises.readFile(
                    'samples/liza-parsed.json',
                    'utf8'
                );
                resumeJson = JSON.parse(resumeText);
            }

            generateAllMarkdowns(resumeJson, portfolioPath);
            console.log('> Extracted resume content into portfolio.\n');

            console.log(
                `> Portfolio local copy available at: ${portfolioPath}`
            );

        }
    } catch (error) {
        console.error('An error occurred:', error);
        process.exit(1);
    }
}

main();
