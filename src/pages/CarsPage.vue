<template>
  <BaseLayout>
    <div class="stack" style="margin-bottom: 16px; align-items: flex-start;">
      <h2 style="margin: 0;">Автомобили</h2>
      <UiButton variant="success" @click="router.push('/cars/create')">
        Создать авто
      </UiButton>
    </div>

    <div class="card table-card">
      <div v-if="loading">
        <UiLoader />
      </div>
      <table v-else class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Марка</th>
            <th>Модель</th>
            <th>Год</th>
            <th>Статус</th>
            <th>Гос номер</th>
            <th>Класс</th>
            <th>Арендатор</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="car in cars"
            :key="car.id"
            class="clickable-row"
            @click="router.push(`/cars/${car.id}/edit`)"
          >
            <td>{{ car.id }}</td>
            <td>{{ car.make }}</td>
            <td>{{ car.model }}</td>
            <td>{{ car.year }}</td>
            <td>{{ car.status }}</td>
            <td>{{ car.license_plate }}</td>
            <td>{{ car.car_class }}</td>
            <td>{{ renterDisplay(car) }}</td>
            <td @click.stop>
              <UiButton
                variant="danger"
                :loading="rowLoading[car.id]"
                @click="removeCar(car.id)"
              >
                Удалить
              </UiButton>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && cars.length === 0" class="muted">
        Автомобилей нет.
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import BaseLayout from "../components/layout/BaseLayout.vue";
import UiButton from "../components/ui/UiButton.vue";
import UiLoader from "../components/ui/UiLoader.vue";
import { carService } from "../services/carService";
import { clientService } from "../services/clientService";
import { unwrap } from "../utils/api";
import { getClientName } from "../utils/clientUtils";

const router = useRouter();
const cars = ref([]);
const clients = ref([]);
const loading = ref(false);
const rowLoading = reactive({});

const clientsById = computed(() => {
  const map = new Map();
  for (const c of clients.value) {
    map.set(String(c.id), getClientName(c) || `Клиент #${c.id}`);
  }
  return map;
});

const renterDisplay = (car) => {
  const name = car.renter?.name ?? car.current_renter?.name;
  if (name) return name;
  const id = car.current_renter_id ?? car.renter_id ?? car.renter?.id;
  if (id) return clientsById.value.get(String(id)) ?? id;
  return "—";
};

const loadCars = async () => {
  loading.value = true;
  try {
    const [carsRes, clientsRes] = await Promise.all([
      carService.fetchAll(),
      clientService.fetchAll()
    ]);
    cars.value = unwrap(carsRes.data) || [];
    clients.value = unwrap(clientsRes.data) || [];
  } finally {
    loading.value = false;
  }
};

const removeCar = async (id) => {
  rowLoading[id] = true;
  try {
    await carService.remove(id);
    await loadCars();
  } finally {
    rowLoading[id] = false;
  }
};

onMounted(loadCars);
</script>
