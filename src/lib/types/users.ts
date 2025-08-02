import type { User } from "@/lib/types/auth-schema";

export interface GetUsersResponse extends Omit<User, "password"> {}
