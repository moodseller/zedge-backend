import express, { Router } from 'express';
import { mergeRouteName, tryRoute } from '../utils/utils';
import { AppRoute } from './route';
import { SearchController } from '../controllers/SearchController';
import { ClientService } from  '../services/clientService';

export class SearchRoutes implements AppRoute {
	constructor(private readonly _searchController: SearchController) { }

	initRoute(): Router {
		const routePrefix = '/itunes';
		const router = express.Router();

		
		router.use(ClientService.token());

		router.get(mergeRouteName(routePrefix, '/favorites'), tryRoute(this._searchController.getFavoritesRoute));
		router.post(mergeRouteName(routePrefix, '/favorite'), tryRoute(this._searchController.favoriteRoute));
		router.post(mergeRouteName(routePrefix, '/lookup'), tryRoute(this._searchController.lookupRoute));
		router.post(mergeRouteName(routePrefix, '/search'), tryRoute(this._searchController.searchRoute));

		return router;
	}
}
