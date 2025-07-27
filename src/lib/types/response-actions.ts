export type ResponseAction<T> =
	| { ok: true; data: T }
	| { ok: false; error: string };
