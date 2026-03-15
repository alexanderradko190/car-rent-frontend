import httpClient from "./httpClient";

class CarService {
  fetchAll() {
    return httpClient.get("/cars");
  }

  create(payload) {
    return httpClient.post("/cars", payload);
  }

  remove(id) {
    return httpClient.delete(`/cars/${id}`);
  }

  updateStatus(id, status) {
    return httpClient.patch(`/cars/${id}/status`, { status });
  }

  updateLicensePlate(id, license_plate) {
    return httpClient.patch(`/cars/${id}/license_plate`, { license_plate });
  }

  updateCarClass(id, car_class) {
    return httpClient.patch(`/cars/${id}/car_class`, { car_class });
  }

  updateRenter(id, current_renter_id) {
    return httpClient.patch(`/cars/${id}/renter`, { current_renter_id });
  }

  fetchAvailable() {
    return httpClient.get("/cars-available");
  }
}

export const carService = new CarService();
