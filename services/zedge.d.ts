/* eslint-disable @typescript-eslint/no-empty-interface */
export namespace backend {
	interface ILookUpSong {
		trackId: number;
		price: string;
		artist: string;
		trackName: string;
	}
	interface ILookUpSongRequestBody {
		id: number;
	}
	interface ILookUpSongReply {
		count: number;
		rows: ILookUpSong[];
	}

	interface ISearchSongRequestBody {
		value: string;
	}
	interface ISearchSongRequestReply extends ILookUpSongReply { }

	interface IFavoriteRouteRequestBody {
		trackId: number;
	}
	interface IFavoriteRouteRequestReply {
		status: string;
	}

	interface IGetFavoriteTracksRequest { }
	interface IGetFavoriteTracksReply {
		rows: ILookUpSong[];
	}
}
