
import PathGenerator, { GeneratorConfig, WordLists } from './PathGenerator';
import fs from 'fs';
import path from 'path';

export enum Versions {
    /** Shady urls */
    shady = 'shady',
    /** Cute Animal urls */
    animal = 'animal',
    /** Test data */
    default = 'default',
}

function readWordList(location: string): string[] {
    return fs.readFileSync(location, 'utf-8').split('\n');
}

const lists: { [key: string]: WordLists } = {
    shady: {
        function: readWordList(path.join(__dirname, './lists/shady/functions')),
        action: readWordList(path.join(__dirname, './lists/shady/actions')),
        object: readWordList(path.join(__dirname, './lists/shady/objects'))
    },

    animal: {
        animal: readWordList(path.join(__dirname, './lists/animal/animals')),
        adjective: readWordList(path.join(__dirname, './lists/animal/adjectives'))
    },

    default: { first: ['One'], second: ['Two'], third: ['Three'] },
}



function getPathGeneratorData(version: Versions): GeneratorConfig<WordLists> {
    switch (version) {
        case Versions.shady:
            return {
                template: ['action', 'function', 'object'],
                lists: lists.shady,
                separator: '.',
            }

        case Versions.animal:
            return {
                template: ['adjective', 'animal', 'animal'],
                lists: lists.animal,
                capitalise: true
            }

        default:
            // Test Case, only possible path is 'OneTwoThree'
            return {
                template: ['first', 'second', 'third'],
                lists: lists.default,
            }
    }
}

export default class Config {

    private static instance: Config;

    public readonly domain: string;
    public readonly port: number;
    public readonly url: string;

    public generator: PathGenerator;

    private constructor(version: Versions) {

        if (!Object.values(Versions).includes(version)) {
            throw new Error(`Supplied version is not valid, valid options are ${Object.values(Versions).join(', ')}`);
        }

        if (!process.env.DOMAIN) {
            console.warn('No Domain supplied through env, assuming development (127.0.0.1)');
        }

        // Environment Variables
        const https = getBoolEnvVar('HTTPS') || false;
        this.domain = process.env.DOMAIN || '127.0.0.1';
        this.port = getIntEnvVar('PORT') || 80;

        this.url = `http${https ? 's' : ''}://${this.domain}`;

        if (this.port !== 80) {
            this.url = `${this.url}:${this.port}`;
        }

        const config = getPathGeneratorData(version);
        this.generator = new PathGenerator(config);
    }

    public static getInstance(version: Versions = Versions.shady): Config {
        if (!Config.instance) {
            Config.instance = new Config(version);
        }

        return Config.instance;
    }

}

/** Convert env var to integer if exists, otherwise return null  */
function getIntEnvVar(environmentVariable: string): number | null {
    if (process.env[environmentVariable]) {
        return parseInt(process.env[environmentVariable] as string);
    }

    return null;
}

/** Convert env var to integer if exists, otherwise return null  */
function getBoolEnvVar(environmentVariable: string): boolean | null {
    if (process.env[environmentVariable]) {
        return process.env[environmentVariable] === 'true';
    }

    return null;
}
