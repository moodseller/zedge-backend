interface ClientModelConstructor {
	userIdentifier: string;
}

interface FavoriteSong {
	trackId: number;
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
