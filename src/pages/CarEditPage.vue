<template>
  <BaseLayout>
    <h2>Редактировать авто</h2>
    <div v-if="loading" class="card">
      <UiLoader />
    </div>
    <template v-else-if="car">
      <p class="muted">{{ car.make }} {{ car.model }}, {{ car.year }}</p>

      <UiButton variant="secondary" @click="router.push('/cars')" style="margin-bottom: 16px;">
        Назад
      </UiButton>

      <div class="form-blocks">
        <UiCard class="form-block">
          <div class="form-stack">
            <strong>Изменить статус</strong>
            <UiSelect v-model="form.status" :options="statusOptions" />
            <FormActions>
              <UiButton
                variant="success"
                :loading="saving.status"
                @click="saveStatus"
              >
                Сохранить
              </UiButton>
            </FormActions>
          </div>
        </UiCard>

        <UiCard class="form-block">
          <div class="form-stack">
            <strong>Изменить Гос номер</strong>
            <UiInput v-model="form.license_plate" />
            <FormActions>
              <UiButton
                variant="success"
                :loading="saving.license"
                @click="saveLicense"
              >
                Сохранить
              </UiButton>
            </FormActions>
          </div>
        </UiCard>

        <UiCard class="form-block">
          <div class="form-stack">
            <strong>Изменить Класс</strong>
            <UiSelect v-model="form.car_class" :options="carClassOptions" />
            <FormActions>
              <UiButton
                variant="success"
                :loading="saving.class"
                @click="saveClass"
              >
                Сохранить
              </UiButton>
            </FormActions>
          </div>
        </UiCard>

        <UiCard class="form-block">
          <div class="form-stack">
            <strong>Изменить Арендатора</strong>
            <UiSelect
              v-model="form.current_renter_id"
              :options="renterOptions"
            />
            <FormActions>
              <UiButton
                variant="success"
                :loading="saving.renter"
                @click="saveRenter"
              >
                Сохранить
              </UiButton>
            </FormActions>
          </div>
        </UiCard>
      </div>
    </template>
    <div v-else class="muted">Автомобиль не найден</div>
  </BaseLayout>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import BaseLayout from "../components/layout/BaseLayout.vue";
import UiCard from "../components/ui/UiCard.vue";
import UiInput from "../components/ui/UiInput.vue";
import UiSelect from "../components/ui/UiSelect.vue";
import UiButton from "../components/ui/UiButton.vue";
import FormActions from "../components/ui/FormActions.vue";
import UiLoader from "../components/ui/UiLoader.vue";
import { carService } from "../services/carService";
import { clientService } from "../services/clientService";
import { unwrap } from "../utils/api";
import { getClientName } from "../utils/clientUtils";

const router = useRouter();
const route = useRoute();
const carId = computed(() => route.params.id);

const car = ref(null);
const clients = ref([]);
const loading = ref(true);
const saving = reactive({ status: false, license: false, class: false, renter: false });

const statusOptions = [
  { label: "Доступен", value: "available" },
  { label: "Арендован", value: "rented" },
  { label: "На обслуживании", value: "maintenance" }
];

const renterOptions = computed(() => {
  const opts = [{ label: "Без арендатора", value: "" }];
  for (const c of clients.value) {
    opts.push({ label: getClientName(c) || `Клиент #${c.id}`, value: String(c.id) });
  }
  return opts;
});

const carClassOptions = [
  { label: "Эконом", value: "economy" },
  { label: "Комфорт", value: "comfort" },
  { label: "Бизнес", value: "business" }
];

const form = reactive({
  status: "",
  license_plate: "",
  car_class: "economy",
  current_renter_id: ""
});

const renterId = (c) =>
  c.current_renter_id ?? c.renter_id ?? c.renter?.id ?? "";

const loadCar = async () => {
  loading.value = true;
  try {
    const [carsRes, clientsRes] = await Promise.all([
      carService.fetchAll(),
      clientService.fetchAll()
    ]);
    const list = unwrap(carsRes.data) || [];
    clients.value = unwrap(clientsRes.data) || [];
    const found = list.find((c) => String(c.id) === String(carId.value));
    car.value = found;
    if (found) {
      form.status = found.status || "";
      form.license_plate = found.license_plate || "";
      form.car_class = found.car_class || "economy";
      form.current_renter_id = String(renterId(found) ?? "");
    }
  } finally {
    loading.value = false;
  }
};

const withSave = async (key, action) => {
  saving[key] = true;
  try {
    await action();
    await loadCar();
  } finally {
    saving[key] = false;
  }
};

const saveStatus = () =>
  withSave("status", () => carService.updateStatus(carId.value, form.status));

const saveLicense = () =>
  withSave("license", () =>
    carService.updateLicensePlate(carId.value, form.license_plate)
  );

const saveClass = () =>
  withSave("class", () =>
    carService.updateCarClass(carId.value, form.car_class)
  );

const saveRenter = () =>
  withSave("renter", () =>
    carService.updateRenter(carId.value, form.current_renter_id || null)
  );

onMounted(loadCar);
</script>

