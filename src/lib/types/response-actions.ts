export type ResponseAction<T> =
	| { ok: true; data: T }
	| { ok: false; error: string };

// Respuesta para los repositorios
export type RepositoryResponse<T> =
	| {
			ok: true;
			data: T;
	  }
	| {
			ok: false;
			error: unknown;
	  };
