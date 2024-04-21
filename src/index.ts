import {OpenAiService} from "./services/openAiService";
import {FileParser} from "./services/fileParser";
import {PriceCalculator} from "./services/priceCalculator";

require('dotenv').config()

const openAiApiKey: string = process.env.OPENAI_API_KEY || ''
const openAiModel: string = process.env.OPENAI_MODEL || 'gpt-3.5-turbo'
const tableTopSystem: string = process.env.TABLETOP_SYSTEM || 'Dungeons & Dragons'
const maxCompletionTokens: number = parseInt(process.env.MAX_COMPLETION_TOKENS || '1000')

async function main() {
    if (openAiApiKey === '') {
        console.error('No API key for OpenAI could be found. Please define OPENAI_API_KEY within the .env file.')
        process.exit(1)
    }

    console.info('Using OpenAI model ' + openAiModel)
    const aiService = new OpenAiService(openAiApiKey, openAiModel, tableTopSystem)
    await aiService.initialize()

    const fileParser = new FileParser('uploads')
    const priceCalculator = new PriceCalculator(openAiModel, maxCompletionTokens)

    console.info('There are currently ' + fileParser.getFileCount() + ' files, with a total size of '
        + fileParser.getOverallSize() + ' bytes')

    console.info('The provided files will cost ' + priceCalculator.getCostOfFileSizes(fileParser.getOverallSize()) + ' USD in hosting.')
}

if (require.main === module) {
    main().then(() => process.exit(0));
}