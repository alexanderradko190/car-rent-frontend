import { reactive } from "vue";

class NotificationStore {
  constructor() {
    this.state = reactive({
      message: "",
      type: "info",
      visible: false
    });
    this.timer = null;
  }

  show(type, message) {
    this.state.type = type;
    this.state.message = message;
    this.state.visible = true;
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.timer = setTimeout(() => {
      this.clear();
    }, 3000);
  }

  clear() {
    this.state.visible = false;
    this.state.message = "";
  }
}

export const notificationStore = new NotificationStore();

export const notify = {
  success(message) {
    notificationStore.show("success", message);
  },
  error(message) {
    notificationStore.show("error", message);
  },
  info(message) {
    notificationStore.show("info", message);
  }
};
