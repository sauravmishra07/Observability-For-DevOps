import api from './api';
import { User } from '../types';

export interface LoginData { email: string; password: string; }
export interface RegisterData { email: string; username: string; password: string; }
export interface AuthResponse { access_token: string; token_type: string; user: User; }

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const res = await api.post('/auth/register', data);
    return res.data;
  },
  async login(data: LoginData): Promise<AuthResponse> {
    const res = await api.post('/auth/login', data);
    return res.data;
  },
  async getMe(): Promise<User> {
    const res = await api.get('/auth/me');
    return res.data;
  },
};
