import { reactive } from "vue";

class ModalStore {
  constructor() {
    this.state = reactive({
      message: "",
      type: "success",
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
      this.hide();
    }, 3000);
  }

  hide() {
    this.state.visible = false;
    this.state.message = "";
  }
}

export const modalStore = new ModalStore();
