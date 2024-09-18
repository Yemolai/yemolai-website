let Hooks = {};

Hooks.RelayHook = {
  mounted() {
    relay = this;
    this.eventHandler = (event) => {
      relay.pushEvent(event.detail.name, event.detail.payload);
    }
    document.addEventListener("phx-relay", this.eventHandler);
  },
  destroyed() {
    document.removeEventListener("phx-relay", this.eventHandler);
  }
};

Hooks.MountedHook = {
  mounted() {
    document.dispatchEvent(new Event("phx-mounted"));
    document.dispatchEvent(new Event(`phx-mounted__${this.el.id}`));
  },
  update() {
    document.dispatchEvent(new Event("phx-mounted-hook__update"));
    document.dispatchEvent(new Event(`phx-mounted-hook__${this.el.id}__update`));
  }
};

export default Hooks;
