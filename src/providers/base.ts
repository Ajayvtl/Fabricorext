export abstract class AIProviderBase {
    constructor(protected readonly apiKey: string) { }

    abstract chatComplete(payload: any): Promise<string>;
}