import { TypedRequest } from '../utils/typed';
import { Response, NextFunction } from 'express';
import { ClientModel } from '../models/ClientModel';
import { HTTPError } from '../utils/errors';
import { itunes } from './itunes';

export class ClientService {
	static clients: ClientModel[] = [];

	/**
	 * Setup user request properties for use in app
	 */
	static token(): (req: TypedRequest<{}, {}>, res: Response, next: NextFunction) => Promise<void | Response> {
		return async (req: TypedRequest<{}, {}>, res: Response, next: NextFunction) => {
			try {
				const userIdentifier = req.headers.authorization;
				if (!userIdentifier) {
					throw 'No token';
				}

				const client = new ClientModel({ userIdentifier });
				req.currentUser = client;
				const clientExists = this.clients.find((c) => c.userId === userIdentifier);
				if (!clientExists) {
					this.clients.push(client);
				} else {
					req.currentUser = clientExists;
				}

				return next();
			} catch {
				return res.status(500).json({ message: 'Token middleware failed '});
			}
		};
	}

	/**
	 * 
	 * @param trackId Track to favorte/unfavorite
	 * @param clientId Client id
	 */
	static favoriteTrack(track: itunes.ILookUpSong, clientId: string): boolean {
		const clientIdx = this.clients.findIndex((c) => c.userId === clientId);
		if (clientIdx === -1) {
			throw new HTTPError('Client not found', 400);
		}

		const client = this.clients[clientIdx];
		const trackIdx = client.favoriteSongList.findIndex((t) => t.trackId === track.trackId);
		if (trackIdx !== -1) {
			client.favoriteSongList.splice(trackIdx, 1);
			return false;
		}
		
		client.favoriteSongList.push({
			trackId: track.trackId,
			trackName: track.trackName,
			artist: track.artistName,
			price: `${track.trackPrice} ${track.currency}`
		});
		return true;
	}
}
