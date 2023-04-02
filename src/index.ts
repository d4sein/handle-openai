import * as fs from "fs";
import { IOpenAiApi, OpenAiApi } from "./api";

export interface IHandleOpenAi {
    SendMessageWithFilepath(filepath: string): Promise<string>;
    SendMessageWithBuffer(buffer: Buffer): Promise<string>;
    SendMessageWithFile(file: Blob): Promise<string>;
}

export class HandleOpenAi implements IHandleOpenAi {
    /**
     *
     */
    constructor(apiKey: string, organization: string) {
        this.api = new OpenAiApi(apiKey, organization, this.baseUrl);
    }

    private readonly api: IOpenAiApi;
    private readonly baseUrl: string = "https://api.openai.com/v1";

    async SendMessageWithFilepath(filepath: string): Promise<string> {
        let resp: string;

        try {
            let buffer = fs.readFileSync(filepath);
            let transcript = await this.SendMessageWithBuffer(buffer);

            resp =  await this.api.getChatCompletion(transcript, "gpt-3.5-turbo");
        } catch (error: unknown) {
            // ...
            throw error;
        }

        return resp;
    }

    async SendMessageWithBuffer(buffer: Buffer): Promise<string> {
        let file = new Blob([buffer]);
        return await this.SendMessageWithFile(file);
    }

    async SendMessageWithFile(file: Blob): Promise<string> {
        return await this.api.getTranscription(file, "whisper-1");
    }
}
