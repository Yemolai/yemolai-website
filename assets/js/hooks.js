let Hooks = {};

Hooks.ModalHook = {
  mounted() {
    this.handleEvent("toggle_modal", ({ is_open }) => {
      if (is_open) {
        this.el.showModal();
      } else {
        this.el.close();
      }
    });
  },
};

export default Hooks;