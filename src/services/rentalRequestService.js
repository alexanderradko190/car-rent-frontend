import httpClient from "./httpClient";

class RentalRequestService {
  fetchAll() {
    return httpClient.get("/rental-requests");
  }

  create(payload) {
    return httpClient.post("/rental-requests", payload);
  }

  approve(id) {
    return httpClient.post(`/rental-requests/${id}/approve`);
  }

  reject(id) {
    return httpClient.post(`/rental-requests/${id}/reject`);
  }

  complete(id) {
    return httpClient.post(`/rental-requests/${id}/complete`);
  }

  sendAgreement(id, payload) {
    return httpClient.post(`/rental-requests/${id}/send-agreement`, payload);
  }

  remove(id) {
    return httpClient.delete(`/rental-requests/${id}`);
  }
}

export const rentalRequestService = new RentalRequestService();
