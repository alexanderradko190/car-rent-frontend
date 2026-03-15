import httpClient from "./httpClient";

class ReportService {
  create(payload) {
    return httpClient.post("/reports", payload);
  }

  fetchAll() {
    return httpClient.get("/reports");
  }

  status(id) {
    return httpClient.get(`/reports/${id}/status`);
  }

  download(id) {
    return httpClient.get(`/reports/${id}/download`, {
      responseType: "blob"
    });
  }
}

export const reportService = new ReportService();
