export interface IOpenAiApi {
    getTranscription(file: Blob, model: string): Promise<string>;
    getChatCompletion(text: string, model: string): Promise<string>;
}

export class OpenAiApi implements IOpenAiApi {
    /**
     *
     */
    constructor(apiKey: string, organization: string, baseUrl: string) {
        this.apiKey = apiKey;
        this.organization = organization;
        this.baseUrl = baseUrl;
    }
    
    private readonly apiKey: string;
    private readonly organization: string;
    private readonly baseUrl: string;

    private buildHeadersWithAuth(): Headers {
        const headers = new Headers();
        headers.set("Authorization", `Bearer ${this.apiKey}`);

        return headers;
    }

    private async request<T>(url: string, payload: RequestInit): Promise<T> {
        let resp: Response;

        try {
            resp = await fetch(`${this.baseUrl}/${url}`, payload);
        } catch (error: unknown) {
            // Do something here?
            throw error;
        }

        if (!resp.ok)
        {
            // TODO
            // Improve error handling
            throw new Error(`Failed to make a request: \n${await resp.json()}`);
        }

        return await resp.json();
    }

    async getTranscription(file: Blob, model: string): Promise<string> {
        const formData = new FormData();
        formData.append("model", model);
        formData.append("file", file, "file.mp4");

        const headers = this.buildHeadersWithAuth();

        const payload: RequestInit = {
            method: "POST",
            headers: headers,
            body: formData,
        };

        // TODO
        // Type `audio transcription` response
        let resp = await this.request<{ text: string }>("audio/transcriptions", payload);
        return resp.text;
    }

    async getChatCompletion(text: string, model: string): Promise<string> {
        const body = {
            model: model,
            messages: [
                { role: "user", content: text }
            ],
            temperature: 0.8
        };

        const headers = this.buildHeadersWithAuth();
        headers.set("Content-Type", "application/json");

        const payload: RequestInit = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(body),
        }

        // TODO
        // Type `chat completion` response
        let resp = await this.request<{ choices: [{ message: { content: string } }] }>("chat/completions", payload);
        return resp.choices[0].message.content;
    }
}
