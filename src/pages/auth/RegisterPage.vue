<template>
  <AuthLayout title="Регистрация">
    <form class="stack" @submit.prevent="submit">
      <UiInput v-model="form.name" label="ФИО" required />
      <UiInput v-model="form.email" label="Email" type="email" required />
      <UiInput v-model="form.password" label="Пароль" type="password" required />
      <UiButton :loading="loading" type="submit">Создать аккаунт</UiButton>
      <router-link to="/auth/login" class="muted">
        Назад ко входу
      </router-link>
    </form>
  </AuthLayout>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import AuthLayout from "../../components/layout/AuthLayout.vue";
import UiInput from "../../components/ui/UiInput.vue";
import UiButton from "../../components/ui/UiButton.vue";
import { authService } from "../../services/authService";
import { authStore } from "../../store/authStore";
import { unwrap } from "../../utils/api";

const router = useRouter();
const loading = ref(false);

const form = reactive({
  name: "",
  email: "",
  password: ""
});

const submit = async () => {
  loading.value = true;
  try {
    const { data } = await authService.register({
      ...form,
      role: "user"
    });
    const payload = unwrap(data) || {};
    authStore.setSession({
      user: payload.user,
      token: payload.token ?? payload.access_token
    });
    router.push("/cars-available");
  } catch {
    // Error is handled by httpClient interceptor (global alert)
  } finally {
    loading.value = false;
  }
};
</script>
