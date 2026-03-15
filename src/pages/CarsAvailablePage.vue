<template>
  <BaseLayout>
    <h2>Доступные авто</h2>
    <div class="card table-card">
      <div v-if="loading">
        <UiLoader />
      </div>
      <table v-else class="table">
        <thead>
          <tr>
            <th>Марка</th>
            <th>Модель</th>
            <th>Гос номер</th>
            <th>Класс</th>
            <th class="actions-col">Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="car in cars" :key="car.id">
            <td>{{ car.make }}</td>
            <td>{{ car.model }}</td>
            <td>{{ car.license_plate }}</td>
            <td>{{ car.car_class }}</td>
            <td class="actions-col">
              <UiButton
                @click="$router.push({ path: '/rental-requests/create', query: { car_id: car.id } })"
              >
                Забронировать
              </UiButton>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && cars.length === 0" class="muted">
        Нет доступных авто.
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import BaseLayout from "../components/layout/BaseLayout.vue";
import UiButton from "../components/ui/UiButton.vue";
import UiLoader from "../components/ui/UiLoader.vue";
import { carService } from "../services/carService";
import { unwrap } from "../utils/api";

const cars = ref([]);
const loading = ref(false);

const loadCars = async () => {
  loading.value = true;
  try {
    const { data } = await carService.fetchAvailable();
    cars.value = unwrap(data) || [];
  } finally {
    loading.value = false;
  }
};

onMounted(loadCars);
</script>
