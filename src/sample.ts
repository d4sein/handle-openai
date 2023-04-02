import dotenv from 'dotenv';
import { join } from 'path';
import { HandleOpenai, IHandleOpenai } from '.';
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;
const org = process.env.OPENAI_ORGANIZATION;

if (apiKey === undefined || org === undefined)
    throw new Error();

const handler: IHandleOpenai = new HandleOpenai(apiKey, org);

async function main() {
    let filepath = join(__dirname, "../recs", "rec.m4a");
    let response = await handler.SendMessageWithFilepath(filepath);
    console.log(response);
}

main();
