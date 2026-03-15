import { reactive } from "vue";
import { StorageService } from "../services/storageService";

class AuthStore {
  constructor(storage) {
    this.storage = storage;
    this.state = reactive({
      user: null,
      token: null
    });
    this.load();
  }

  load() {
    this.state.user = this.storage.get("user");
    this.state.token = this.storage.get("token");
  }

  setSession({ user, token }) {
    this.state.user = user;
    this.state.token = token;
    this.storage.set("user", user);
    this.storage.set("token", token);
  }

  clear() {
    this.state.user = null;
    this.state.token = null;
    this.storage.remove("user");
    this.storage.remove("token");
  }

  isAuthenticated() {
    return Boolean(this.state.token);
  }

  role() {
    const u = this.state.user;
    if (!u) return "guest";
    const r = u.role ?? u.roles?.[0] ?? u.type;
    return typeof r === "string" ? r.toLowerCase() : "guest";
  }

  user() {
    return this.state.user;
  }

  token() {
    return this.state.token;
  }
}

export const authStore = new AuthStore(new StorageService());
