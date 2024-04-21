import {OpenAiService} from "./services/openAiService";

require('dotenv').config()

const openAiApiKey: string = process.env.OPENAI_API_KEY || ''
const openAiModel: string = process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
const maxCompletionTokens: number = parseInt(process.env.MAX_COMPLETION_TOKENS || '1000')

if (openAiApiKey === '') {
    console.error('No API key for OpenAI could be found. Please define OPENAI_API_KEY within the .env file.')
    process.exit(1)
}

console.info('Using OpenAI model ' + openAiModel)
const aiService = new OpenAiService(openAiApiKey, openAiModel)
