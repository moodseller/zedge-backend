import { TypedRequest, TypedResponse } from '../utils/typed';
import { ITunesService } from '../services/itunesService';
import { backend } from '../services/zedge';
import { HTTPError } from '../utils/errors';
import { toSongsReply } from './mapping';
import { ClientService } from '../services/clientService';

export class SearchController {
	constructor(private readonly _itunesService: ITunesService) { }

	getFavoritesRoute = async (
		req: TypedRequest<{}, {}>,
		res: TypedResponse<{}>
	) => {
		// Typically we can store only id's of favorited tracks, but we dont want to make a request
		// to itunes here just to fetch all of those songs if they are available in our array
		return res.status(200).json({ rows: req.currentUser.favoriteSongList });
	}

	favoriteRoute = async (
		req: TypedRequest<backend.IFavoriteRouteRequestBody, {}>,
		res: TypedResponse<backend.IFavoriteRouteRequestReply>
	) => {
		const response = await this._itunesService.lookUpSong(req.body.trackId);
		if (!response.resultCount || !response.results.length || !response.results[0]) {
			throw new HTTPError('Track not found!', 400);
		}

		ClientService.favoriteTrack(response.results[0], req.currentUser.userId);

		// Optionally we can alter {req} header here and remove/add the track from {currentUser} param
		// But since we are not doing anything more in this request its fine.

		return res.status(200).json({ status: 'ok' });
	}

	lookupRoute = async (
		req: TypedRequest<backend.ILookUpSongRequestBody, {}>,
		res: TypedResponse<backend.ISearchSongRequestReply>
	) => {
		if (!req.body.id || typeof req.body.id !== 'string') {
			throw new HTTPError('Invalid request body', 400);
		}

		const response = await this._itunesService.lookUpSong(req.body.id);
		const mappedResponse = toSongsReply(response);

		return res.status(200).json(mappedResponse);
	}

	searchRoute = async (
		req: TypedRequest<backend.ISearchSongRequestBody, {}>,
		res: TypedResponse<backend.ISearchSongRequestReply>
	) => {
		if (!req.body.value || typeof req.body.value !== 'string') {
			throw new HTTPError('Invalid request body', 400);
		}

		const response = await this._itunesService.searchSongs(req.body.value);
		const mappedResponse = toSongsReply(response);

		return res.status(200).json(mappedResponse);
	}
}
