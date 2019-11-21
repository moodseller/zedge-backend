import { Response, Request } from 'express';
import { ClientModel } from '../models/ClientModel';

export type TypedResponse<T> = 
	Omit<Response, 'json' | 'status'>
	& { json(data: T): TypedResponse<T> } & { status(code: number): TypedResponse<T> };


interface UserRequest extends Request {
	currentUser: ClientModel;
}

export interface TypedRequest<Q, P extends {[k in keyof P]: string}> extends UserRequest {
	body: Q;
	params: P;
}
