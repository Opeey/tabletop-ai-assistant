import OpenAI from "openai";

class OpenAiService {
    private assistantName = 'Tabletop AI Assistant'

    private openAi: OpenAI

    private model: string
    private assistantId: string

    constructor(apiKey: string, model: string) {
        this.model = model

        this.openAi = new OpenAI({
            apiKey: apiKey
        })
    }

    async getAssistantId(): string | null {
        await this.openAi.beta.assistants.list()
    }
}