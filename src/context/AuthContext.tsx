import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { LoginPayload, login as doLogin } from "@/api/authService";
// import { getRoleById } from "@/api/roleService";

// type UserRole = "admin" | "lecturer" | "student";

type LoginResult = {
	status: "success" | "error" | "warning" | "info";
	message: string;
};

type Role = {
	id: string,
	name: string;
	description: string;
}

type User = {
	id: string;
	name: string;
	email: string;
	role: Role;
}

type AuthContextType = {
	token: string | null;
	user: User | null;
	setUser: React.Dispatch<React.SetStateAction<User | null>>;
	login: (data: LoginPayload) => Promise<LoginResult>;
	logout: () => void;

};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within a AuthProvider');
	}
	return context;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		const storedUser = localStorage.getItem("user");
		if (storedUser) setUser(JSON.parse(storedUser));
	}, []);

	useEffect(() => {
		if (user) {
			localStorage.setItem("user", JSON.stringify(user));
		}
	}, [user]);


	const login = async (data: LoginPayload): Promise<LoginResult> => {
		try {
			const res = await doLogin(data);
			if (res.status === 'success') {
				const resData = res.data;

				let userData = res.data?.user;
				setUser(userData);
				setToken(resData?.token);
				localStorage.setItem("token", resData?.token);
				localStorage.setItem("user", JSON.stringify(userData));
				navigate("/");
			}

			return {
				status: res.status,
				message: res.message
			};

		} catch (error: any) {
			return {
				status: "error",
				message: error?.message || "Login failed",
			};
		}
	};

	const logout = () => {
		setUser(null);
		setToken(null);
		localStorage.removeItem("user");
		localStorage.removeItem("token");
		navigate("/login");
	};

	return (
		<AuthContext.Provider value={{ token, user, setUser, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
};

