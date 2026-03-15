import httpClient from "./httpClient";

class AuthService {
  login(payload) {
    return httpClient.post("/auth/login", payload);
  }

  register(payload) {
    return httpClient.post("/auth/register", payload);
  }
}

export const authService = new AuthService();
