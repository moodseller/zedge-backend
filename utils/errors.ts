export class HTTPError extends Error {
	code: number;
	internalCode?: number;
	/**
	 * Creates an instance of HTTPError
	 *
	 * @param {string} message Error message
	 * @param {number} code HTTP error code
	 * @param {number} [internalCode] Internal error code used for differentiation
	 * @memberof HTTPError
	 */
	constructor(message: string, code: number, internalCode?: number) {
		super(message);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, this.constructor);

		this.code = code;
		this.internalCode = internalCode;
	}
}
