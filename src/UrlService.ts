import PathGenerator from './PathGenerator';
import LocalStore, { Store, ConflictError } from './Store';

export default class UrlService {

    constructor(
        private url: string,
        private pathGenerator: PathGenerator,
        private store: Store = new LocalStore(),
    ) { }

    public getRedirect(path: string): string | null {
        if (path.startsWith('/')) {
            return this.store.get(path.substring(1));
        }

        return this.store.get(path);
    }

    public getUrl(originalUrl: string): string {
        const path = this.storeRedirect(originalUrl)
        return `${this.url}/${path}`;
    }

    /** Store path against original url, returns path used to store against */
    private storeRedirect(url: string): string {
        let path = '';
        let stored = false;
        let conflicts = 0;

        while (!stored) {
            try {

                path = this.pathGenerator.generatePath();
                this.store.save(path, url);
                stored = true;

            } catch (error) {

                if (error instanceof ConflictError) {
                    conflicts = conflicts + 1;
                }

                if (error instanceof Error) {
                    console.log(error.message);
                }

                if (conflicts === 3) {
                    throw new Error('Failed to store url after 3 attempts');
                }

            }
        }

        return path;

    }
}
