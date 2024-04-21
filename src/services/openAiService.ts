import OpenAI from "openai";
import {Assistant} from "openai/resources/beta";


export class OpenAiService {
    private openAi: OpenAI
    private readonly model: string
    private readonly tableTopSystem: string
    private assistant?: Assistant

    constructor(apiKey: string, model: string, tableTopSystem: string) {
        this.model = model
        this.openAi = new OpenAI({
            apiKey: apiKey
        })
        this.tableTopSystem = tableTopSystem
    }

    async initialize(): Promise<void> {
        this.assistant = await this.getOrCreateAssistant()
    }

    private getAssistantName(): string {
        return 'Tabletop AI Assistant - ' + this.tableTopSystem
    }

    private getInstructions(): string {
        return 'You will answer questions about ' + this.tableTopSystem + ', based on the documents you have been provided. ' +
            'You will strictly answer based on the documents provided and not on your own knowledge. If the answer ' +
            'of the question is not in the documents provided, you will simply say, that you do not know, because ' +
            'your knowledge is limited to the provided data. Always print the answer to a question word for word ' +
            'from the document.'
    }

    private async getOrCreateAssistant(): Promise<Assistant> {
        const existingAssistant = await this.getAssistant()
        if (existingAssistant === null) {
            console.info('Could not find existing assistant. Will create new one.')
            return this.createAssistant()
        } else {
            console.info('Found existing assistant with id ' + existingAssistant.id)
            return this.updateAssistant(existingAssistant)
        }
    }

    private async createAssistant(): Promise<Assistant> {
        console.info('Creating new assistant with name ' + this.getAssistantName() + ' and model ' + this.model)
        console.info('Using instructions: ' + this.getInstructions())
        return this.openAi.beta.assistants.create({
            model: this.model,
            instructions: this.getInstructions(),
            name: this.getAssistantName(),
            temperature: 0.2,
            tools: [{
                "type": "file_search"
            }]
        })
    }

    private async updateAssistant(assistant: Assistant): Promise<Assistant> {
        console.info('Updating assistant with id ' + assistant.id)
        return this.openAi.beta.assistants.update(assistant.id, {
            model: this.model,
            instructions: this.getInstructions(),
            name: this.getAssistantName(),
            temperature: 0.2,
            tools: [{
                "type": "file_search"
            }]
        })
    }

    private async getAssistant(): Promise<Assistant | null> {
        console.info('Fetching assistants to find existing assistant with name ' + this.getAssistantName())
        for await (const assistant of this.openAi.beta.assistants.list({limit: 20})) {
            if (assistant.name === this.getAssistantName()) {
                return assistant;
            }
        }

        return null;
    }
}