import { createContext } from "react";
import { LoginPayload } from "@/api/authService";

export type LoginResult = {
	status: "success" | "error" | "warning" | "info";
	message: string;
};

export type Role = {
	id: string,
	name: string;
	description?: string;
}

export type User = {
	id: string;
	name: string;
	email: string;
	role: Role;
}

export type AuthContextType = {
	token: string | null;
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	login: (data: LoginPayload) => Promise<LoginResult>;
	logout: () => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

