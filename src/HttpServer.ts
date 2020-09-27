import http from 'http';
import https from 'https';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import { BaseController } from 'Controller';

interface ApiSetting {
    homepage: string;
    port: number;
    controllers: BaseController[];
}

export default class HttpServer {

    private homepage: string;
    private port = 80;
    private server: http.Server | https.Server;

    constructor(settings: ApiSetting) {
        this.homepage = settings?.homepage;
        const controllers = settings?.controllers || [];
        if (settings.port) this.port = settings.port;

        const app = this.getExpressApp(controllers);
        this.server = http.createServer(app);
    }

    public start(): void {
        this.server.listen(this.port);
    }

    private getExpressApp(controllers: BaseController[]): Express {
        const app = express();
        app.use(bodyParser.json())
        app.use(express.static('public'));

        for (const controller of controllers) {
            app.use(controller.path, controller.router);
        }

        app.use(this.errorHandler);
        app.use(this.notFoundHandler);

        return app;

    }

    /** Top level express error handler for uncaught errors */
    private errorHandler = (error: Error, _req: express.Request, res: express.Response, next: express.NextFunction): void => {
        res.status(500).json({ message: error.message });
        next();
    };

    /** Top level express path not found handler */
    private notFoundHandler = (_req: express.Request, res: express.Response, next: express.NextFunction): void => {
        res.redirect(301, this.homepage);
        next();
    };

}




