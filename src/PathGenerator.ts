
export type WordLists = { [key: string]: string[] };
export type TemplateStringArray<T extends WordLists> = (keyof T)[]

export interface GeneratorConfig<T extends WordLists> {
    template: TemplateStringArray<T>;
    lists: T
    separator?: string;
    capitalise?: boolean;
}

export default class PathGenerator<T extends WordLists = Record<string, string[]>> {

    public template: TemplateStringArray<T>;
    public lists: T;
    public separator: string;
    public capitalise: boolean;

    public constructor(config: GeneratorConfig<T>) {
        const { template, lists, separator, capitalise } = config;

        if (config.template.length === 0) {
            throw new Error('Unable to generate string without at least 1 word list in template array');
        }

        if (Object.keys(config.lists).length === 0) {
            throw new Error('Must supply at least 1 word list');
        }

        this.template = template;
        this.lists = lists;
        this.separator = separator || '';
        this.capitalise = capitalise || false;
    }

    public generatePath(): string {
        let path = '';

        for (const listName of this.template) {
            const index = getRndInteger(this.lists[listName].length - 1);
            let nextWord = this.lists[listName][index];
            if (this.capitalise) nextWord = capitalizeFirstLetter(nextWord);
            path = `${path}${this.separator}${nextWord}`;
        }

        return path;
    }



}

function capitalizeFirstLetter(word: string): string {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

function getRndInteger(max: number) {
    return Math.floor(Math.random() * (max));
}
