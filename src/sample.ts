import dotenv from 'dotenv';
import { join } from 'path';
import { HandleOpenAi, IHandleOpenAi } from '.';
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
const org = process.env.OPENAI_ORGANIZATION;

if (apiKey === undefined || org === undefined)
    throw new Error(`Could not load credentials for either 'OPENAI_API_KEY' or 'OPENAI_ORGANIZATION' in the environment variables.`);

const handler: IHandleOpenAi = new HandleOpenAi(apiKey, org);

async function main() {
    let filepath = join(__dirname, "../recs", "rec.m4a");
    let response = await handler.SendMessageWithFilepath(filepath);
    console.log(response);
}

main();
