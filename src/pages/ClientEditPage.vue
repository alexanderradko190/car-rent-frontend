<template>
  <BaseLayout>
    <h2>Редактировать клиента</h2>
    <div v-if="loading" class="card">
      <UiLoader />
    </div>
    <template v-else-if="client">
      <p class="muted">{{ getClientName(client) || `Клиент #${client.id}` }}</p>

      <UiButton variant="secondary" @click="router.push('/clients')" style="margin-bottom: 16px;">
        Назад
      </UiButton>

      <UiCard class="form-card">
        <div class="form-stack">
          <form class="form-stack" @submit.prevent="updateProfile">
            <UiInput v-model="form.name" label="ФИО" />
            <UiInput v-model="form.email" label="Email" type="email" />
            <UiInput v-model="form.phone" label="Телефон" />
            <UiInput
              v-model="form.age"
              label="Возраст"
              type="number"
              min="18"
              max="100"
            />
            <UiInput
              v-model="form.driving_experience"
              label="Опыт вождения (лет)"
              type="number"
              min="0"
              max="80"
            />
            <FormActions>
              <UiButton
                :loading="updating"
                type="submit"
                variant="success"
              >
                Обновить
              </UiButton>
            </FormActions>
          </form>
          <div class="form-stack upload-block">
            <strong>Загрузить скан водительского удостоверения</strong>
            <div class="row">
              <input type="file" @change="handleFile" />
            </div>
            <FormActions>
              <UiButton :loading="uploading" @click="uploadLicense">
                Загрузить
              </UiButton>
            </FormActions>
            <span class="muted">Допустимо: pdf, jpeg, png.</span>
          </div>
        </div>
      </UiCard>
    </template>
    <div v-else class="muted">Клиент не найден</div>
  </BaseLayout>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import BaseLayout from "../components/layout/BaseLayout.vue";
import UiCard from "../components/ui/UiCard.vue";
import UiInput from "../components/ui/UiInput.vue";
import UiButton from "../components/ui/UiButton.vue";
import FormActions from "../components/ui/FormActions.vue";
import UiLoader from "../components/ui/UiLoader.vue";
import { clientService } from "../services/clientService";
import { unwrap } from "../utils/api";
import { getClientName } from "../utils/clientUtils";

const router = useRouter();
const route = useRoute();
const clientId = computed(() => route.params.id);

const client = ref(null);
const loading = ref(true);
const updating = ref(false);
const uploading = ref(false);
const uploadFile = ref(null);

const form = reactive({
  name: "",
  email: "",
  phone: "",
  age: "",
  driving_experience: ""
});

const loadClient = async () => {
  loading.value = true;
  try {
    const { data } = await clientService.fetchById(clientId.value);
    const payload = unwrap(data)?.client || unwrap(data);
    if (payload) {
      client.value = payload;
      const name = payload.name ?? payload.full_name ?? payload.fio ?? "";
      form.name = name;
      form.email = payload.email || "";
      form.phone = payload.phone || "";
      form.age = payload.age ?? "";
      form.driving_experience = payload.driving_experience ?? "";
    }
  } catch {
    client.value = null;
  } finally {
    loading.value = false;
  }
};

const updateProfile = async () => {
  updating.value = true;
  try {
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      age: form.age ? Number(form.age) : null,
      driving_experience: form.driving_experience
        ? Number(form.driving_experience)
        : null
    };
    await clientService.update(clientId.value, payload);
    await loadClient();
  } finally {
    updating.value = false;
  }
};

const handleFile = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  uploadFile.value = file;
};

const uploadLicense = async () => {
  if (!uploadFile.value) return;
  uploading.value = true;
  try {
    await clientService.uploadLicenseScan(clientId.value, uploadFile.value);
    uploadFile.value = null;
  } finally {
    uploading.value = false;
  }
};

onMounted(loadClient);
</script>

