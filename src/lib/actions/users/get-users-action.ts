"use server";

import { findAllUsers } from "@/lib/repositories/users/user-repo";
import type { ResponseAction } from "@/lib/types/response-actions";
import type { GetUsersResponse } from "@/lib/types/users";
import { errorToString } from "@/lib/utils";

export async function getUsersAction(): Promise<
	ResponseAction<GetUsersResponse[]>
> {
	const users = await findAllUsers();
	if (!users.ok) {
		return {
			ok: false,
			error: errorToString(users.error, "Error al obtener los usuarios"),
		};
	}
	return { ok: true, data: users.data as GetUsersResponse[] };
}
