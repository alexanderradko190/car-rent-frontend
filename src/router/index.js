import { createRouter, createWebHistory } from "vue-router";
import { authStore } from "../store/authStore";

import LoginPage from "../pages/auth/LoginPage.vue";
import RegisterPage from "../pages/auth/RegisterPage.vue";
import CarsPage from "../pages/CarsPage.vue";
import CarCreatePage from "../pages/CarCreatePage.vue";
import CarEditPage from "../pages/CarEditPage.vue";
import CarsAvailablePage from "../pages/CarsAvailablePage.vue";
import ClientsPage from "../pages/ClientsPage.vue";
import ClientEditPage from "../pages/ClientEditPage.vue";
import ProfilePage from "../pages/ProfilePage.vue";
import RentalRequestsPage from "../pages/RentalRequestsPage.vue";
import RentalRequestCreatePage from "../pages/RentalRequestCreatePage.vue";
import RentHistoriesPage from "../pages/RentHistoriesPage.vue";
import ReportsPage from "../pages/ReportsPage.vue";
import NotFoundPage from "../pages/NotFoundPage.vue";

const routes = [
  {
    path: "/",
    redirect: () => (authStore.isAuthenticated() ? "/cars-available" : "/auth/login")
  },
  {
    path: "/auth/login",
    component: LoginPage,
    meta: { guestOnly: true }
  },
  {
    path: "/auth/register",
    component: RegisterPage,
    meta: { guestOnly: true }
  },
  {
    path: "/dashboard",
    redirect: "/cars-available"
  },
  {
    path: "/cars",
    component: CarsPage,
    meta: { requiresAuth: true, roles: ["admin", "manager"] }
  },
  {
    path: "/cars/create",
    component: CarCreatePage,
    meta: { requiresAuth: true, roles: ["admin", "manager"] }
  },
  {
    path: "/cars/:id/edit",
    component: CarEditPage,
    meta: { requiresAuth: true, roles: ["admin", "manager"] }
  },
  {
    path: "/cars-available",
    component: CarsAvailablePage,
    meta: { requiresAuth: true, roles: ["admin", "manager", "user"] }
  },
  {
    path: "/clients",
    component: ClientsPage,
    meta: { requiresAuth: true, roles: ["admin", "manager"] }
  },
  {
    path: "/clients/:id/edit",
    component: ClientEditPage,
    meta: { requiresAuth: true, roles: ["admin", "manager"] }
  },
  {
    path: "/profile",
    component: ProfilePage,
    meta: { requiresAuth: true, roles: ["admin", "manager", "user"] }
  },
  {
    path: "/rental-requests",
    component: RentalRequestsPage,
    meta: { requiresAuth: true, roles: ["admin", "manager"] }
  },
  {
    path: "/rental-requests/create",
    component: RentalRequestCreatePage,
    meta: { requiresAuth: true, roles: ["admin", "manager", "user"] }
  },
  {
    path: "/rent-histories",
    component: RentHistoriesPage,
    meta: { requiresAuth: true, roles: ["admin", "manager"] }
  },
  {
    path: "/reports",
    component: ReportsPage,
    meta: { requiresAuth: true, roles: ["admin"] }
  },
  {
    path: "/:pathMatch(.*)*",
    component: NotFoundPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  const isAuth = authStore.isAuthenticated();
  const role = authStore.role();

  if (to.meta?.guestOnly && isAuth) {
    return "/cars-available";
  }

  if (to.meta?.requiresAuth && !isAuth) {
    return "/auth/login";
  }

  if (to.meta?.roles && !to.meta.roles.includes(role)) {
    return "/cars-available";
  }

  return true;
});

export default router;
