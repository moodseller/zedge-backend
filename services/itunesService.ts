import config from 'config';
import axios from 'axios';
import { itunes } from './itunes';

export class ITunesService {
	private readonly _itunesURL: string = config.get('itunes.apiUrl');

	async lookUpSong(id: number): Promise<itunes.ILookUpSongReply> {
		const r = await axios.get(`${this._itunesURL}/lookup?id=${id}`);
		return r.data;
	}

	async searchSongs(term: string): Promise<itunes.ISearchSongRequestReply> {
		const r = await axios.get(`${this._itunesURL}/search?term=${term}`);
		return r.data;
	}
}
