import supertest from 'supertest';
import http from 'http';
import MainApplication from '../../app';
import { ITunesService } from '../../services/itunesService';
import { SearchRoutes } from '../SearchRoutes';
import { SearchController } from '../../controllers/SearchController';
import { MockMainApplication } from '../../__mocks__/MockMainApplication';
import { ClientService } from '../../services/clientService';
import { ClientModel } from '../../models/ClientModel';
import { backend } from '../../services/zedge';
import { itunes } from '../../services/itunes';
import * as mapping from '../../controllers/mapping';

describe('SearchRoutes', () => {
    let itunesService: PartialMock<ITunesService>;
    let searchRoutes: SearchRoutes;
    let searchController: SearchController;
	
    let mainApplication: MainApplication;
    let server: http.Server;
    let request: supertest.SuperTest<supertest.Test>;
	
    beforeEach(() => {
        itunesService = {
            lookUpSong: jest.fn()
        };
        ClientService.clients = [];
        searchController = new SearchController(itunesService as any);
        searchRoutes = new SearchRoutes(searchController);

        mainApplication = MockMainApplication({
            routes: [searchRoutes]
        });

        mainApplication.init();

        server = http.createServer(mainApplication.app);
        server.listen();
        request = supertest(mainApplication.app);
    });

    afterEach(() => {
        server.close();
    });

    afterAll(async () => {
        await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
    });

    it('should reject with no authorization header', async () => {
        const r = await request
            .get('/itunes/favorites');

        expect(r.status).toEqual(500);
    });

    it('should authorize and return user favorite song list', async () => {
        const favoriteSongsList = [
            {
                trackId: 1,
                trackName: '123',
                price: 'big price',
                artist: 'test artist'
            },
            {
                trackId: 2,
                trackName: '321',
                price: 'low price',
                artist: 'test artist 2'
            },
        ];
        ClientService.clients.push(new ClientModel({ userIdentifier: 'testtoken' }));
        ClientService.clients[0].favoriteSongList.push(...favoriteSongsList);

        const r = await request
            .get('/itunes/favorites')
            .set('authorization', 'testtoken')
            .withCredentials();

        expect(r.status).toEqual(200);
        expect(r.body).toMatchObject({ rows: favoriteSongsList } as backend.IGetFavoriteTracksReply);
    });

    it('should add favorite song to list', async () => {
        const songResponse =  {
            trackId: 1,
            trackName: '123',
            price: 'big price',
            artist: 'test artist'
        };
        ClientService.clients.push(new ClientModel({ userIdentifier: 'testtoken' }));

        const clientServiceFavoriteTrackSpy = jest.spyOn(ClientService, 'favoriteTrack');

        itunesService.lookUpSong = jest.fn().mockResolvedValue({
            resultCount: 1,
            results: [songResponse as any]
        } as itunes.ILookUpSongReply);

        const r = await request
            .post('/itunes/favorite')
            .send({ trackId: 1 } as backend.IFavoriteRouteRequestBody)
            .set('authorization', 'testtoken')
            .withCredentials();

        expect(ClientService.clients).toMatchObject([{
            userId: 'testtoken',
            favoriteSongList: [{
                trackId: 1,
                trackName: '123'
            }]
        }]);
        expect(clientServiceFavoriteTrackSpy).toBeCalledWith(songResponse, 'testtoken');
        expect(r.status).toEqual(200);
        expect(r.body).toMatchObject({ status: 'ok' } as backend.IFavoriteRouteRequestReply);
    });

    describe('should search for songs', () => {
        const itunesSongResponse: itunes.ILookUpSong[] = [
            {
                trackId: 123,
                trackName: 'test',
                artistName: 'artist',
                currency: 'USD',
                trackPrice: 2.99
            },
            {
                trackId: 321,
                trackName: 'test2',
                artistName: 'artist2',
                currency: 'EUR',
                trackPrice: 3.99
            }
        ] as any;

        const mappingSpy = jest.spyOn(mapping, 'toSongsReply');

        it('should search for songs', async () => {
            itunesService.searchSongs = jest.fn().mockResolvedValue({
                resultCount: itunesSongResponse.length,
                results: itunesSongResponse
            } as itunes.ISearchSongRequestReply);
	
            const r = await request
                .post('/itunes/search')
                .send({ value: 'searchvalue' } as backend.ISearchSongRequestBody)
                .set('authorization', 'testtoken')
                .withCredentials();
	
            expect(itunesService.searchSongs).toBeCalledWith('searchvalue');
            expect(mappingSpy).toBeCalledWith({
                resultCount: itunesSongResponse.length,
                results: itunesSongResponse
            });
            expect(r.body).toMatchObject({
                rows: [
                    { price: '2.99 USD', artist: 'artist', trackId: 123, trackName: 'test' },
                    { price: '3.99 EUR', artist: 'artist2', trackId: 321, trackName: 'test2' }
                ],
                count: itunesSongResponse.length
            } as backend.ISearchSongRequestReply);
			
            mappingSpy.mockClear();
        });
	
        it('should lookup for songs', async () => {
            itunesService.lookUpSong = jest.fn().mockResolvedValue({
                resultCount: itunesSongResponse.length,
                results: itunesSongResponse
            } as itunes.ILookUpSongReply);
	
            const r = await request
                .post('/itunes/lookup')
                .send({ id: 2 } as backend.ILookUpSongRequestBody)
                .set('authorization', 'testtoken')
                .withCredentials();
	
            expect(itunesService.lookUpSong).toBeCalledWith(2);
            expect(mappingSpy).toBeCalledWith({
                resultCount: itunesSongResponse.length,
                results: itunesSongResponse
            });
            expect(r.body).toMatchObject({
                rows: [
                    { price: '2.99 USD', artist: 'artist', trackId: 123, trackName: 'test' },
                    { price: '3.99 EUR', artist: 'artist2', trackId: 321, trackName: 'test2' }
                ],
                count: itunesSongResponse.length
            } as backend.ILookUpSongReply);

            mappingSpy.mockClear();
        });
    });
	
});
