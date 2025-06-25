// src/app/core/api/auth.api.ts
import { CallApiService } from '../services/call-api.service';
import { RegisterRequest } from '../models/api/register.api.interface';
import { LoginRequest } from '../models/api/login.api.interface';
import { ApiResponse } from '../models/api/common-response.api.interface';

export const buildAuthAPI = (api: CallApiService) => ({
  login: (data: LoginRequest): Promise<ApiResponse<object>> =>
    api.callApi<ApiResponse<object>>('Security/UserLogin', 'post', data),

  register: (data: RegisterRequest): Promise<ApiResponse<object>> =>
    api.callApi<ApiResponse<object>>('Security/RegisterAcc', 'post', data),

  googleLogin: (data: { token: string }): Promise<ApiResponse<object>> =>
    api.callApi<ApiResponse<object>>('Security/VerifyGoogle', 'post', data)
});
