import { itunes } from '../services/itunes';
import { backend } from '../services/zedge';

// original name: toLookUpSongReply
/**
 * 
 * @param result Itunes song results
 * @returns Formatted song list reply for front-end
 */
export function toSongsReply(result: itunes.ILookUpSongReply): backend.ILookUpSongReply {
	const outRows: backend.ILookUpSong[] = [];

	for (const row of result.results) {
		outRows.push({
			price: `${row.trackPrice} ${row.currency}`,
			artist: row.artistName,
			trackId: row.trackId,
			trackName: row.trackName
		});
	}

	return {
		count: result.resultCount,
		rows: outRows
	};
}


/**
 * Normally you have two different methods if any of their replies might differ,
 * but here we can re-use the function above.
 */

// export function toSearchSongsReply(result: itunes.ISearchSongRequestReply): backend.ISearchSongRequestReply {
// 	const outRows: backend.ILookUpSong[] = [];

// 	for (const row of result.results) {
// 		outRows.push({
// 			price: `${row.trackPrice} ${row.currency}`,
// 			artist: row.artistName
// 		});
// 	}

// 	return { 
// 		count: result.resultCount,
// 		rows: outRows
// 	};
// }
