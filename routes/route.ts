import { Router } from 'express';

export interface AppRoute {
	initRoute: () => Router;
}
