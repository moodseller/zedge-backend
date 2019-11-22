interface ClientModelConstructor {
	userIdentifier: string;
}

interface FavoriteSong {
	trackId: number;
	trackName: string;
	price: string;
	artist: string;
}

export class ClientModel {
	userId!: string; // token
	favoriteSongList: FavoriteSong[] = [];

	constructor(c: ClientModelConstructor) {
		if (!c) {
			return;
		}

		this.userId = c.userIdentifier;
	}
}
