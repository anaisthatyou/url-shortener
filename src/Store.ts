export class ConflictError extends Error {
    public failedStores: number | null = null
    public message = 'Path already in use.';

    constructor(
        /** Path already in use */
        public urlPath?: string,
    ) {
        super();
        if (urlPath) {
            this.message = `Path '${urlPath}' already in use`;
        }
    }
}

export interface Store {
    /** get url by key if exists */
    get(path: string): string | null;

    /** save url by key, throw on attempted overwrite */
    save(path: string, url: string): void;
}

export default class LocalStore implements Store {
    private _dict: Record<string, string> = {};

    get(path: string): string | null {
        if (this._dict[path]) {
            return this._dict[path];
        }

        return null;
    }

    save(path: string, url: string): void {
        if (this._dict[path]) {
            throw new ConflictError(path);
        }

        this._dict[path] = url;
    }
}
