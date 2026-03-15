<template>
  <BaseLayout>
    <h2>Заявки на аренду</h2>
    <UiButton variant="success" @click="router.push('/rental-requests/create')" style="margin-bottom: 16px;">
      Создать заявку
    </UiButton>
    <div class="card table-card">
      <div v-if="loading">
        <UiLoader />
      </div>
      <table v-else class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Клиент</th>
            <th>Авто</th>
            <th>Статус</th>
            <th>Создано</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="request in requests" :key="request.id">
            <td>{{ request.id }}</td>
            <td>{{ request.client_id || request.client?.name }}</td>
            <td>{{ request.car_id || request.car?.model }}</td>
            <td>{{ request.status }}</td>
            <td>{{ request.created_at }}</td>
            <td class="actions">
              <UiButton
                variant="secondary"
                :loading="rowLoading[request.id]?.approve"
                @click="approve(request.id)"
              >
                Одобрить
              </UiButton>
              <UiButton
                variant="secondary"
                :loading="rowLoading[request.id]?.reject"
                @click="reject(request.id)"
              >
                Отклонить
              </UiButton>
              <UiButton
                variant="secondary"
                :loading="rowLoading[request.id]?.complete"
                @click="complete(request.id)"
              >
                Завершить
              </UiButton>
              <UiButton
                variant="secondary"
                :loading="rowLoading[request.id]?.agreement"
                @click="sendAgreement(request)"
              >
                Отправить договор
              </UiButton>
              <UiButton
                variant="danger"
                :loading="rowLoading[request.id]?.remove"
                @click="remove(request.id)"
              >
                Удалить
              </UiButton>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && requests.length === 0" class="muted">
        Заявок нет.
      </div>
    </div>
  </BaseLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import BaseLayout from "../components/layout/BaseLayout.vue";
import UiButton from "../components/ui/UiButton.vue";
import UiLoader from "../components/ui/UiLoader.vue";
import { rentalRequestService } from "../services/rentalRequestService";
import { unwrap } from "../utils/api";

const router = useRouter();
const requests = ref([]);
const loading = ref(false);
const rowLoading = reactive({});

const loadRequests = async () => {
  loading.value = true;
  try {
    const { data } = await rentalRequestService.fetchAll();
    requests.value = unwrap(data) || [];
  } finally {
    loading.value = false;
  }
};

const withAction = async (id, key, action, reload = true) => {
  rowLoading[id] = rowLoading[id] || {};
  rowLoading[id][key] = true;
  try {
    await action();
    if (reload) await loadRequests();
  } finally {
    rowLoading[id][key] = false;
  }
};

const approve = (id) => withAction(id, "approve", () => rentalRequestService.approve(id), false);
const reject = (id) => withAction(id, "reject", () => rentalRequestService.reject(id));
const complete = (id) => withAction(id, "complete", () => rentalRequestService.complete(id), false);
const sendAgreement = (request) => {
  const rentHistoryId =
    request.rent_history_id ?? request.rent_history?.id ?? request.id;
  withAction(
    request.id,
    "agreement",
    () =>
      rentalRequestService.sendAgreement(request.id, {
        rent_history_id: rentHistoryId
      }),
    false
  );
};
const remove = (id) => withAction(id, "remove", () => rentalRequestService.remove(id));

onMounted(loadRequests);
</script>
