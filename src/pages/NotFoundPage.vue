<template>
  <BaseLayout>
    <h2>Страница не найдена</h2>
    <p class="muted">Запрошенная страница не существует.</p>
    <router-link to="/cars-available">Доступные авто</router-link>
  </BaseLayout>
</template>

<script setup>
import BaseLayout from "../components/layout/BaseLayout.vue";
</script>
