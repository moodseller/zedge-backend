import { AppRoute } from '../routes/route';
import MainApplication, { routeMap } from '../app';
import { SettingsService } from '../services/settingsService';
import { LoggerService } from '../services/loggerService';

interface MockMainApplicationOptions {
	loggerService?: PartialMock<LoggerService>;
	settingsService?: PartialMock<SettingsService>;
	routes?: AppRoute[];
}

const defaultOptions: MockMainApplicationOptions = {
	loggerService: {},
	settingsService: {
		isTestEnvironment: jest.fn().mockReturnValue(true)
	},
	routes: routeMap
};

export const MockMainApplication = (options: MockMainApplicationOptions = defaultOptions) => {
	return new MainApplication(
		options.settingsService as any || defaultOptions.settingsService,
		options.loggerService as any || defaultOptions.loggerService,
		options.routes as any || defaultOptions.routes
	);
};


