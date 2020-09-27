import HttpServer from './HttpServer';
import Controller from './Controller';
import UrlService from './UrlService';
import Config, { Versions } from './Config';

export default class Main {

    public init(): void {
        const version = process.env.VERSION as Versions || Versions.default;
        const { url, port, generator } = Config.getInstance(version);

        const service = new UrlService(url, generator);

        const controllers = [
            new Controller(url, service)
        ];

        const api = new HttpServer({ homepage: url, port, controllers });
        api.start();
    }
}

new Main().init();
console.log('Ready ✨');
