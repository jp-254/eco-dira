// src/types/auth.ts

export interface AdminDTO {
	username: string;
	role: "admin";
}

export interface AdminLoginResponse {
	token: string;
	admin: AdminDTO;
}

export interface OperatorDTO {
	email: string;
	role: "operator";
}

export interface OperatorLoginResponse {
	token: string;
	operator: OperatorDTO;
}
