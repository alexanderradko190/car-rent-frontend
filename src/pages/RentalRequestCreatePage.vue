<template>
  <BaseLayout>
    <h2>Создать заявку на аренду</h2>

    <UiButton variant="secondary" @click="router.push('/rental-requests')" style="margin-bottom: 16px;">
      Назад
    </UiButton>

    <UiCard class="form-card">
      <form class="form-stack" @submit.prevent="createRequest">
        <div v-if="carIdFromQuery" class="ui-input">
          <span class="label">Автомобиль</span>
          <div class="readonly-field">{{ selectedCarLabel }}</div>
        </div>
        <UiSelect
          v-else
          v-model="form.car_id"
          label="Автомобиль"
          :options="carOptions"
          required
        />
        <UiInput
          v-model="form.start_time"
          label="Начало аренды"
          type="datetime-local"
          required
        />
        <UiInput
          v-model="form.end_time"
          label="Окончание аренды"
          type="datetime-local"
          required
        />
        <div class="ui-select">
          <span class="label">Страхование</span>
          <div class="radio-group">
            <label class="radio-label">
              <input v-model="form.insurance_option" type="radio" :value="true" />
              С страхованием
            </label>
            <label class="radio-label">
              <input v-model="form.insurance_option" type="radio" :value="false" />
              Без страхования
            </label>
          </div>
        </div>
        <label class="checkbox-label">
          <input v-model="form.agreement_accepted" type="checkbox" required />
          <span>Я принимаю условия договора аренды</span>
        </label>
        <div class="actions">
          <UiButton :loading="saving" type="submit" variant="success">
            Создать заявку
          </UiButton>
        </div>
      </form>
    </UiCard>
  </BaseLayout>
</template>

<script setup>
import { reactive, ref, onMounted, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import BaseLayout from "../components/layout/BaseLayout.vue";
import UiCard from "../components/ui/UiCard.vue";
import UiInput from "../components/ui/UiInput.vue";
import UiSelect from "../components/ui/UiSelect.vue";
import UiButton from "../components/ui/UiButton.vue";
import { rentalRequestService } from "../services/rentalRequestService";
import { carService } from "../services/carService";
import { unwrap } from "../utils/api";

const router = useRouter();
const route = useRoute();
const saving = ref(false);
const cars = ref([]);

const form = reactive({
  car_id: "",
  start_time: "",
  end_time: "",
  insurance_option: true,
  agreement_accepted: false
});

const carIdFromQuery = computed(() => route.query.car_id);

const carOptions = computed(() =>
  cars.value.map((c) => ({
    label: `${c.make} ${c.model} (${c.license_plate})`,
    value: String(c.id)
  }))
);

const selectedCarLabel = computed(() => {
  const id = carIdFromQuery.value || form.car_id;
  const car = cars.value.find((c) => String(c.id) === String(id));
  return car ? `${car.make} ${car.model} (${car.license_plate})` : "—";
});

const toApiDatetime = (val) => {
  if (!val) return "";
  const d = val.replace("T", " ");
  return d.length === 16 ? `${d}:00` : d;
};

const loadCars = async () => {
  const { data } = await carService.fetchAvailable();
  cars.value = unwrap(data) || [];
};

watch(
  [() => cars.value, carIdFromQuery],
  ([list, carId]) => {
    if (carId && list?.length && list.some((c) => String(c.id) === String(carId))) {
      form.car_id = String(carId);
    }
  },
  { immediate: true }
);

const createRequest = async () => {
  saving.value = true;
  const carId = carIdFromQuery.value || form.car_id;
  try {
    await rentalRequestService.create({
      car_id: Number(carId),
      start_time: toApiDatetime(form.start_time),
      end_time: toApiDatetime(form.end_time),
      insurance_option: Boolean(form.insurance_option),
      agreement_accepted: form.agreement_accepted ? true : false
    });
    router.push("/rental-requests");
  } finally {
    saving.value = false;
  }
};

onMounted(loadCars);
</script>

<style scoped>
.form-stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 400px;
}

.radio-group {
  display: flex;
  gap: 16px;
  padding: 8px 0;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
}

.checkbox-label input {
  width: 18px;
  height: 18px;
}

.label {
  font-weight: 600;
  margin-bottom: 4px;
  display: block;
}

.readonly-field {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #d0d7e2;
  font-size: 14px;
  background: #f5f5f5;
  color: #333;
}
</style>
