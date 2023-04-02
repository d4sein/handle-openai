export interface IOpenaiApi {
    getTranscription(file: Blob, model: string): Promise<string>;
    // TODO
    // Type prompt
    getChatCompletion(text: string, prompt: { role: string, content: string }[], model: string): Promise<string>;
}

export class OpenaiApi implements IOpenaiApi {
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
            // ...
            throw error;
        }

        if (!resp.ok)
        {
            console.error(await resp.json());
            // TODO
            // Improve error handling
            throw new Error("Failed to make request.");
        }

        return await resp.json();
    }

    // TODO
    // Maybe create specific param types,
    // allowing funcs to have richer signatures
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

        let resp = await this.request<{ text: string}>("audio/transcriptions", payload);
        return resp.text;        
    }

    async getChatCompletion(text: string, prompt: { role: string; content: string; }[], model: string): Promise<string> {
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

        let resp = await this.request<{ choices: [{ message: { content: string } }] }>("chat/completions", payload);
        return resp.choices[0].message.content;
    }
}
