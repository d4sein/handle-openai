import * as fs from "fs";
import { IOpenaiApi, OpenaiApi } from "./api";

export interface IHandleOpenai {
    SendMessageWithFilepath(filepath: string): Promise<string>;
    SendMessageWithBuffer(buffer: Buffer): Promise<string>;
    SendMessageWithFile(file: Blob): Promise<string>;
}

export class HandleOpenai implements IHandleOpenai {
    /**
     *
     */
    constructor(apiKey: string, organization: string) {
        this.api = new OpenaiApi(apiKey, organization, this.baseUrl);
    }

    private readonly api: IOpenaiApi;
    private readonly baseUrl: string = "https://api.openai.com/v1";

    async SendMessageWithFilepath(filepath: string): Promise<string> {
        let buffer = fs.readFileSync(filepath);
        return this.SendMessageWithBuffer(buffer);
    }

    async SendMessageWithBuffer(buffer: Buffer): Promise<string> {
        let file = new Blob([buffer]);
        return this.SendMessageWithFile(file);
    }

    async SendMessageWithFile(file: Blob): Promise<string> {
        let resp;

        try {
            resp = await this.api.getTranscription(file, "whisper-1");
        } catch (error: unknown) {
             // ...
             throw error;
        }

        return resp;   
    }
}
