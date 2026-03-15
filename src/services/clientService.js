import httpClient from "./httpClient";

class ClientService {
  fetchAll() {
    return httpClient.get("/clients");
  }

  fetchById(id) {
    return httpClient.get(`/clients/${id}`);
  }

  create(payload) {
    return httpClient.post("/clients", payload);
  }

  update(id, payload) {
    return httpClient.put(`/clients/${id}`, payload);
  }

  remove(id) {
    return httpClient.delete(`/clients/${id}`);
  }

  uploadLicenseScan(id, file) {
    const form = new FormData();
    form.append("license_scan", file);
    return httpClient.post(`/clients/${id}/license_scan`, form, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
}

export const clientService = new ClientService();
