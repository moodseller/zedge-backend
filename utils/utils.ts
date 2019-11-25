import { NextFunction, Request, Response } from 'express';
import { TypedRequest, TypedResponse } from './typed';

/**
 * Function which merges a route's base url with its destination
 * Usually this is needed when versioning the API, but in this case just to give unique paths for each route file
 * 
 * @param {string} prefix - base url 
 * @param {string} routeName - destination route name
 * @returns {string} - merged name
 */
export function mergeRouteName(prefix: string, routeName: string): string {
    return `${prefix}${routeName}`;
}


/**
 * Wrap request handling function to try-catch
 *
 * @param {function(req, res, next): Promise} routeHandler - route handler to wrap
 * @param {function(e)} [catchError] - custom error handling callback
 * @returns {function(req, res, next)} wrapped route handler (async)
 */
export function tryRoute<T>(
    routeHandler: (
        req: Request | TypedRequest<{}, {}>,
        res: Response | TypedResponse<{}>,
        next: NextFunction
    ) => Promise<T>,
    catchError?: (e: Error) => void
) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await routeHandler(req, res, next);
        } catch (e) {
            if (catchError) {
                return catchError(e);
            }
            const err = e.error || e;
            if (!err.code) {
                err.code = 500;
            }
            return res.status(err.code).json({ error: { code: err.code, message: err.message } });
        }
    };
}
