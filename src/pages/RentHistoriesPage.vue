<template>
  <BaseLayout>
    <h2>История аренды</h2>

    <UiCard class="stack">
      <strong>Фильтры</strong>
      <form class="grid grid-3" @submit.prevent="applyFilters">
        <UiSelect v-model="filters.sort_by" label="Сортировать по" :options="sortByOptions" />
        <UiSelect v-model="filters.sort_order" label="Порядок" :options="sortOptions" />
        <div class="actions">
          <UiButton :loading="loading" type="submit">Применить</UiButton>
        </div>
      </form>
    </UiCard>

    <div class="card table-card" style="margin-top: 16px;">
      <div v-if="loading">
        <UiLoader />
      </div>
      <table v-else class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Клиент</th>
            <th>Авто</th>
            <th>Начало</th>
            <th>Окончание</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="history in histories" :key="history.id">
            <td>{{ history.id }}</td>
            <td>{{ history.client?.full_name || history.client_id }}</td>
            <td>{{ history.car ? `${history.car.make} ${history.car.model}` : history.car_id }}</td>
            <td>{{ history.start_time }}</td>
            <td>{{ history.end_time }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && histories.length === 0" class="muted">
        История аренды не найдена.
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import BaseLayout from "../components/layout/BaseLayout.vue";
import UiCard from "../components/ui/UiCard.vue";
import UiSelect from "../components/ui/UiSelect.vue";
import UiButton from "../components/ui/UiButton.vue";
import UiLoader from "../components/ui/UiLoader.vue";
import { rentHistoryService } from "../services/rentHistoryService";
import { unwrap } from "../utils/api";

const filters = reactive({
  sort_by: "start_time",
  sort_order: "desc"
});

const sortByOptions = [
  { label: "Дата начала", value: "start_time" },
  { label: "Дата окончания", value: "end_time" },
  { label: "Стоимость", value: "total_cost" },
  { label: "ID", value: "id" }
];

const sortOptions = [
  { label: "По возрастанию", value: "asc" },
  { label: "По убыванию", value: "desc" }
];

const histories = ref([]);
const loading = ref(false);

const loadHistories = async () => {
  loading.value = true;
  try {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v != null && String(v).trim() !== "")
    );
    const { data } = await rentHistoryService.fetchAll(params);
    histories.value = unwrap(data) || [];
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  loadHistories();
};

onMounted(loadHistories);
</script>
