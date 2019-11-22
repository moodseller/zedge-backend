import express, { Router } from 'express';
import config from 'config';
import { SettingsService } from './services/settingsService';
import { LoggerService } from './services/loggerService';
import bodyParser from 'body-parser';
import { SearchController } from './controllers/SearchController';
import { ITunesService } from './services/itunesService';
import { AppRoute } from './routes/route';
import { SearchRoutes } from './routes/SearchRoutes';
import cors from 'cors';

class MainApplication {
	app: express.Application;
	router: Router = express.Router();
	
	constructor(
		private readonly _settingsService: SettingsService,
		private readonly _loggerService: LoggerService,
		private readonly _routes: AppRoute[]
	) {
		this.app = express();
	}

	init() {
		this.app.use(bodyParser.json());
		this.app.use(bodyParser.urlencoded({ extended: false }));

		this.app.use(
			cors({
				methods: 'GET,PUT,POST,OPTIONS,HEAD,DELETE,PATCH',
				// eslint-disable-next-line max-len
				allowedHeaders: 'Access-Control-Allow-Origin,Credentials,Authorization,Origin,X-Requested-With,Content-Type,Content-Range,Content-Disposition,Content-Description',
				credentials: true,
				origin: config.get('cors.origin')
			})
		);

		this.app.use('/ping', (req, res) => res.status(200).end('pong'));

		for (const route of this._routes) {
			this.app.use(route.initRoute());
		}

		if (!this._settingsService.isTestEnvironment) { // Prevent server from starting on test env.
			this.app.listen(config.get('http.port'), () => {
				this._loggerService.info({ port: config.get('http.port') }, 'server started');
			});
		}
	}
}

const settingsService = new SettingsService();
const loggerService = new LoggerService('app');
const itunesService = new ITunesService();

const searchController = new SearchController(itunesService);

export const routeMap: AppRoute[] = [
	new SearchRoutes(searchController)
];
if (!settingsService.isTestEnvironment) {
	new MainApplication(
		settingsService,
		loggerService,
		routeMap
	).init();
}

export default MainApplication;
