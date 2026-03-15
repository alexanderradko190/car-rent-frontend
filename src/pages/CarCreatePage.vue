<template>
  <BaseLayout>
    <h2>Создать авто</h2>

    <UiButton variant="secondary" @click="router.push('/cars')" style="margin-bottom: 16px;">
      Назад
    </UiButton>

    <UiCard class="form-card">
      <form class="form-stack" @submit.prevent="createCar">
        <UiInput v-model="form.make" label="Марка" required />
        <UiInput v-model="form.model" label="Модель" required />
        <UiInput v-model="form.year" label="Год" type="number" required min="1900" />
        <UiInput
          v-model="form.vin"
          label="VIN (17 символов)"
          required
          maxlength="17"
        />
        <UiInput v-model="form.license_plate" label="Гос номер" required />
        <UiSelect v-model="form.car_class" label="Класс" :options="carClassOptions" />
        <UiInput v-model="form.power" label="Мощность (л.с.)" type="number" required min="50" max="1000" />
        <UiInput v-model="form.hourly_rate" label="Почасовая ставка" type="number" required min="1" />
        <div class="actions">
          <UiButton :loading="saving" type="submit" variant="success">
            Создать
          </UiButton>
        </div>
      </form>
    </UiCard>
  </BaseLayout>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import BaseLayout from "../components/layout/BaseLayout.vue";
import UiCard from "../components/ui/UiCard.vue";
import UiInput from "../components/ui/UiInput.vue";
import UiSelect from "../components/ui/UiSelect.vue";
import UiButton from "../components/ui/UiButton.vue";
import { carService } from "../services/carService";

const router = useRouter();
const saving = ref(false);

const carClassOptions = [
  { label: "Эконом", value: "economy" },
  { label: "Комфорт", value: "comfort" },
  { label: "Бизнес", value: "business" }
];

const form = reactive({
  make: "",
  model: "",
  year: "",
  vin: "",
  license_plate: "",
  car_class: "economy",
  power: "",
  hourly_rate: ""
});

const createCar = async () => {
  saving.value = true;
  try {
    await carService.create({
      make: form.make,
      model: form.model,
      year: Number(form.year),
      vin: String(form.vin).toUpperCase(),
      license_plate: form.license_plate,
      car_class: form.car_class,
      power: Number(form.power),
      hourly_rate: Number(form.hourly_rate)
    });
    router.push("/cars");
  } finally {
    saving.value = false;
  }
};
</script>

