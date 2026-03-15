<template>
  <BaseLayout>
    <h2>Личный кабинет</h2>

    <UiCard class="form-card">
      <div class="form-stack">
        <form class="form-stack" @submit.prevent="createProfile">
          <UiInput v-model="createForm.name" label="ФИО" required />
          <UiInput v-model="createForm.email" label="Email" type="email" required />
          <UiInput
            v-model="createForm.phone"
            label="Телефон"
            :error="showErrors && errors.phone"
            required
          />
          <UiInput
            v-model="createForm.age"
            label="Возраст"
            type="number"
            :error="showErrors && errors.age"
            required
            min="18"
            max="100"
          />
          <UiInput
            v-model="createForm.driving_experience"
            label="Опыт вождения (лет)"
            type="number"
            min="0"
            max="80"
          />
          <FormActions>
            <UiButton
              :loading="creating"
              type="submit"
              variant="success"
            >
              {{ clientId ? "Обновить" : "Сохранить" }}
            </UiButton>
          </FormActions>
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
        </form>
      </div>
    </UiCard>

  </BaseLayout>
</template>

<script setup>
import { reactive, ref, computed, onMounted, watch } from "vue";
import BaseLayout from "../components/layout/BaseLayout.vue";
import UiCard from "../components/ui/UiCard.vue";
import UiInput from "../components/ui/UiInput.vue";
import UiButton from "../components/ui/UiButton.vue";
import FormActions from "../components/ui/FormActions.vue";
import { clientService } from "../services/clientService";
import { notify } from "../store/notificationStore";
import { authStore } from "../store/authStore";
import { unwrap } from "../utils/api";
import { StorageService } from "../services/storageService";

const currentUser = authStore.user();
const showErrors = ref(false);
const storage = new StorageService();
const profileKey = `client_profile_${currentUser?.id || currentUser?.email || "guest"}`;

const creating = ref(false);
const uploading = ref(false);
const clientId = ref("");

const createForm = reactive({
  name: currentUser?.name || "",
  email: currentUser?.email || "",
  phone: "",
  age: "",
  driving_experience: ""
});

const uploadFile = ref(null);

const errors = computed(() => {
  const ageNumber = Number(createForm.age);
  const ageInvalid =
    !createForm.age ||
    Number.isNaN(ageNumber) ||
    ageNumber < 18 ||
    ageNumber > 100;
  const phoneInvalid = !createForm.phone;
  return {
    age: ageInvalid,
    phone: phoneInvalid
  };
});

const hasErrors = computed(() => errors.value.age || errors.value.phone);

const persistProfile = (profile) => {
  storage.set(profileKey, profile);
};

const normalizeProfile = (profile) => {
  if (!profile) return null;
  const source = profile.client || profile;
  if (!source) return null;
  const name = source.name ?? source.full_name ?? source.fio;
  return {
    id: source.id || profile.id,
    name,
    email: source.email,
    phone: source.phone,
    age: source.age,
    driving_experience: source.driving_experience
  };
};

const hydrateProfile = (profile) => {
  if (!profile) return;
  if (profile.id) {
    clientId.value = profile.id;
  }
  createForm.name = profile.name || createForm.name;
  createForm.email = profile.email || createForm.email;
  createForm.phone = profile.phone || "";
  createForm.age = profile.age ?? "";
  createForm.driving_experience = profile.driving_experience ?? "";
};

onMounted(async () => {
  const stored = storage.get(profileKey);
  hydrateProfile(stored);

  const userClientId = currentUser?.client_id || currentUser?.client?.id;
  if (userClientId && !clientId.value) {
    clientId.value = userClientId;
  }

  if (clientId.value) {
    try {
      const { data } = await clientService.fetchById(clientId.value);
      const payload = normalizeProfile(unwrap(data));
      if (payload) {
        hydrateProfile(payload);
        persistProfile(payload);
      }
    } catch {
      // ignore if endpoint is not available for role
    }
  }
});

watch(
  () => ({
    id: clientId.value,
    name: createForm.name,
    email: createForm.email,
    phone: createForm.phone,
    age: createForm.age,
    driving_experience: createForm.driving_experience
  }),
  (value) => {
    if (!value.name && !value.email && !value.phone && !value.age) return;
    persistProfile(value);
  }
);

const createProfile = async () => {
  showErrors.value = true;
  if (hasErrors.value) {
    notify.error("Заполните обязательные поля");
    return;
  }
  creating.value = true;
  try {
    const payload = {
      ...createForm,
      age: createForm.age ? Number(createForm.age) : null,
      driving_experience: createForm.driving_experience
        ? Number(createForm.driving_experience)
        : null
    };
    if (clientId.value) {
      await clientService.update(clientId.value, payload);
      const merged = { id: clientId.value, ...payload };
      persistProfile(merged);
      hydrateProfile(merged);
    } else {
      const { data } = await clientService.create(payload);
      const responsePayload = normalizeProfile(unwrap(data)) || {};
      const createdId = responsePayload.id || responsePayload.client?.id;
      if (createdId) {
        clientId.value = createdId;
      } else {
        notify.info("Профиль создан, но ID не получен");
      }
      const merged = {
        id: clientId.value,
        ...payload,
        ...responsePayload
      };
      persistProfile(merged);
      hydrateProfile(merged);
    }
  } finally {
    creating.value = false;
  }
};

const handleFile = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  uploadFile.value = file;
};

const uploadLicense = async () => {
  if (!clientId.value || !uploadFile.value) {
    notify.error("Нужен профиль и файл");
    return;
  }
  uploading.value = true;
  try {
    await clientService.uploadLicenseScan(clientId.value, uploadFile.value);
    uploadFile.value = null;
  } finally {
    uploading.value = false;
  }
};
</script>

