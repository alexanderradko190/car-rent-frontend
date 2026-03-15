import httpClient from "./httpClient";

class RentHistoryService {
  fetchAll(params) {
    return httpClient.get("/rent_histories", { params });
  }
}

export const rentHistoryService = new RentHistoryService();
