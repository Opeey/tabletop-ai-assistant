class PriceCalculator {
    private MODEL_PRICES: ModelPrice[] = [
        {
            modelName: "gpt-3.5-turbo-0125",
            tokenCount: 1000000,
            inputPrice: 0.5,
            outputPrice: 1.5
        },
        {
            modelName: "gpt-3.5-turbo-instruct",
            tokenCount: 1000000,
            inputPrice: 1.5,
            outputPrice: 2
        },
        {
            modelName: "gpt-4",
            tokenCount: 1000000,
            inputPrice: 30,
            outputPrice: 60
        },
        {
            modelName: "gpt-4-turbo-2024-04-09",
            tokenCount: 1000000,
            inputPrice: 10,
            outputPrice: 30
        }
    ]
    private ASSISTANT_PRICES: AssistantPrice = {
        freeSpaceInGb: 1,
        priceByGb: 0.1
    }

    private model: string;
    private readonly priceOfModel: ModelPrice;
    private maxCompletionTokens: number;

    constructor(model: string, maxCompletionTokens: number) {
        this.model = model
        this.maxCompletionTokens = maxCompletionTokens

        const priceOfModel: ModelPrice | undefined = this.MODEL_PRICES.find(price => price.modelName === model)
        if (priceOfModel === undefined) {
            throw new NoSuchModelError(model)
        }
        this.priceOfModel = priceOfModel
    }

    public calculateCostForMessage(inputTokens: number, outputTokens: number): MessageCost {
        return {
            inputCost: (inputTokens / this.priceOfModel.tokenCount) * this.priceOfModel.inputPrice,
            outputCost: (outputTokens / this.priceOfModel.tokenCount) * this.priceOfModel.outputPrice,
        }
    }
}

class NoSuchModelError extends Error {
    constructor(model: string) {
        super("No price information for the model \"" + model + "\" exists.");
    }
}

export interface MessageCost {
    inputCost: number,
    outputCost: number
}

interface ModelPrice {
    modelName: string,
    tokenCount: number,
    inputPrice: number,
    outputPrice: number
}

interface AssistantPrice {
    freeSpaceInGb: number,
    priceByGb: number
}