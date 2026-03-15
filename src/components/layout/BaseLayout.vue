<template>
  <div>
    <UiAlert
      :visible="notification.visible"
      :message="notification.message"
      :type="notification.type"
    />
    <header class="header">
      <div class="container header-content">
        <div class="brand">Прокат авто</div>
        <nav class="nav">
          <router-link
            v-for="item in visibleNav"
            :key="item.to"
            :to="item.to"
            class="nav-link"
          >
            {{ item.title }}
          </router-link>
        </nav>
        <div class="spacer"></div>
        <div class="user">
          <span class="pill">{{ fio || role }}</span>
          <UiButton variant="secondary" @click="logout">Выйти</UiButton>
        </div>
      </div>
    </header>
    <main class="container">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { authStore } from "../../store/authStore";
import { notificationStore } from "../../store/notificationStore";
import { navItems } from "../../router/nav";
import UiButton from "../ui/UiButton.vue";
import UiAlert from "../ui/UiAlert.vue";

const router = useRouter();
const notification = notificationStore.state;

const role = computed(() => authStore.role());
const fio = computed(() => authStore.user()?.name || "");
const visibleNav = computed(() =>
  navItems.filter((item) => item.roles.includes(role.value))
);

const logout = () => {
  authStore.clear();
  router.push("/auth/login");
};
</script>

<style scoped>
.header {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 14px 20px;
}

.brand {
  white-space: nowrap;
  font-weight: 700;
  font-size: 18px;
  color: var(--brand);
}

.nav {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.nav-link {
  padding: 6px 10px;
  border-radius: 6px;
  color: #1e293b;
}

.nav-link.router-link-active {
  background: var(--brand-light);
  font-weight: 600;
}

.user {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user .pill {
  background: #fff;
  color: #000;
  font-family: Arial, sans-serif;
  font-size: 20px;
}

@media (max-width: 900px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
