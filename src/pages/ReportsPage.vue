<template>
  <BaseLayout>
    <h2>Отчеты</h2>

    <UiCard class="stack">
      <strong>Создать отчет</strong>
      <form class="grid grid-3" @submit.prevent="createReport">
        <UiSelect v-model="form.type" label="Тип" :options="types" />
        <UiInput v-model="form.date_from" label="Дата с" type="date" required />
        <UiInput v-model="form.date_to" label="Дата по" type="date" required />
        <div class="actions">
          <UiButton :loading="creating" type="submit" variant="success">
            Создать
          </UiButton>
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
            <th>Тип</th>
            <th>Статус</th>
            <th>Создан</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="report in reports" :key="report.id">
            <td>{{ report.id }}</td>
            <td>{{ report.type }}</td>
            <td>{{ report.status }}</td>
            <td>{{ report.created_at }}</td>
            <td class="actions">
              <UiButton
                variant="secondary"
                :loading="rowLoading[report.id]?.status"
                @click="checkStatus(report.id)"
              >
                Проверить статус
              </UiButton>
              <UiButton
                variant="secondary"
                :loading="rowLoading[report.id]?.download"
                @click="download(report.id)"
              >
                Скачать
              </UiButton>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && reports.length === 0" class="muted">
        Отчетов нет.
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import BaseLayout from "../components/layout/BaseLayout.vue";
import UiCard from "../components/ui/UiCard.vue";
import UiSelect from "../components/ui/UiSelect.vue";
import UiInput from "../components/ui/UiInput.vue";
import UiButton from "../components/ui/UiButton.vue";
import UiLoader from "../components/ui/UiLoader.vue";
import { reportService } from "../services/reportService";
import { notify } from "../store/notificationStore";
import { unwrap } from "../utils/api";

const form = reactive({
  type: "rent_histories",
  date_from: "",
  date_to: ""
});

const types = [
  { label: "История аренды", value: "rent_histories" },
  { label: "Заявки аренды", value: "rental_requests" }
];

const reports = ref([]);
const loading = ref(false);
const creating = ref(false);
const rowLoading = reactive({});

const loadReports = async () => {
  loading.value = true;
  try {
    const { data } = await reportService.fetchAll();
    reports.value = unwrap(data) || [];
  } finally {
    loading.value = false;
  }
};

const createReport = async () => {
  creating.value = true;
  try {
    await reportService.create(form);
    await loadReports();
  } finally {
    creating.value = false;
  }
};

const withRowAction = async (id, key, action) => {
  rowLoading[id] = rowLoading[id] || {};
  rowLoading[id][key] = true;
  try {
    await action();
  } finally {
    rowLoading[id][key] = false;
  }
};

const checkStatus = (id) =>
  withRowAction(id, "status", async () => {
    const { data } = await reportService.status(id);
    const payload = unwrap(data) || {};
    notify.info(`Отчет ${id}: ${payload.status || "неизвестно"}`);
    await loadReports();
  });

const download = (id) =>
  withRowAction(id, "download", async () => {
    const { data } = await reportService.download(id);
    const blob = new Blob([data], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `report-${id}.xlsx`;
    link.click();
    window.URL.revokeObjectURL(url);
  });

onMounted(loadReports);
</script>
