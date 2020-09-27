import express from 'express';
import UrlService from './UrlService';

export abstract class BaseController {
    public readonly router: express.Router = express.Router();

    public abstract path: string;
    protected abstract initializeRoutes(): void;
}

export default class Controller extends BaseController {

    public path = '/';
    public router: express.Router = express.Router();

    constructor(
        private homepage: string,
        private urlService: UrlService,
    ) {
        super();
        this.initializeRoutes();
    }

    protected initializeRoutes(): void {
        this.router.post('/', this.createRedirect);
        this.router.get('/*', this.redirect);
    }

    private createRedirect = (req: express.Request, res: express.Response) => {
        const { url } = req.body as { url: string };
        const formatted = ensureHttp(url);
        const shadyUrl = this.urlService.getUrl(formatted);
        res.send(shadyUrl);
    }

    private redirect = (req: express.Request, res: express.Response): void => {
        const path = req.path;
        const redirect = this.urlService.getRedirect(path);

        console.log(path)

        if (!redirect) {
            // No entry for redirect found, send to redirect homepage
            return res.redirect(this.homepage);
        }

        // redirect to saved url 
        res.redirect(redirect);
    }

}

function ensureHttp(url: string): string {
    let updated = `${url}`;

    if (!updated.startsWith('http')) {
        updated = `https://${url}`;
    }

    return updated;
}
