<template>
  <BaseLayout>
    <h2>Клиенты</h2>
    <div class="card table-card">
      <div v-if="loading">
        <UiLoader />
      </div>
      <table v-else class="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Email</th>
            <th>Телефон</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="client in clients"
            :key="client.id"
            class="clickable-row"
            @click="router.push(`/clients/${client.id}/edit`)"
          >
            <td>{{ client.id }}</td>
            <td>{{ clientDisplayName(client) }}</td>
            <td>{{ client.email }}</td>
            <td>{{ client.phone }}</td>
            <td @click.stop>
              <UiButton
                variant="danger"
                :loading="rowLoading[client.id]"
                @click="removeClient(client.id)"
              >
                Удалить
              </UiButton>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!loading && clients.length === 0" class="muted">
        Клиентов нет.
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
import { clientService } from "../services/clientService";
import { unwrap } from "../utils/api";
import { getClientName } from "../utils/clientUtils";

const router = useRouter();
const clients = ref([]);

const clientDisplayName = (c) =>
  getClientName(c) || (c?.id != null ? `Клиент #${c.id}` : "—");
const loading = ref(false);
const rowLoading = reactive({});

const loadClients = async () => {
  loading.value = true;
  try {
    const { data } = await clientService.fetchAll();
    clients.value = unwrap(data) || [];
  } finally {
    loading.value = false;
  }
};

const removeClient = async (id) => {
  rowLoading[id] = true;
  try {
    await clientService.remove(id);
    await loadClients();
  } finally {
    rowLoading[id] = false;
  }
};

onMounted(loadClients);
</script>
