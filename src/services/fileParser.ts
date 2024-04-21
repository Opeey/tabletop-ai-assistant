import * as fs from "fs";

export class FileParser {
    private filePrefix = 'ttaia_'

    private files: File[] = []
    private localDirectory: string

    constructor(localDirectory: string) {
        this.localDirectory = localDirectory

        this.scanDirectory()
    }

    public getOverallSize(): number {
        if (this.getFileCount() === 0) {
            return 0
        }

        return Number(this.files.map(file => file.bytes).reduce((a, b) => a + b))
    }

    public getFileCount(): number {
        return this.files.length
    }

    private scanDirectory() {
        fs.readdirSync(this.localDirectory, {withFileTypes: true})
            .filter(item => item.isFile())
            .forEach(file => {
                this.files.push({
                    filename: file.name,
                    path: file.path + '/' + file.name,
                    bytes: fs.statSync(file.path + '/' + file.name, {bigint: true}).size
                })
            })
    }
}

interface File {
    filename: string
    path: string
    bytes: bigint
}