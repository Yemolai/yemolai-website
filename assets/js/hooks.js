let Hooks = {};

Hooks.RelayHook = {
  mounted() {
    relay = this;
    document.addEventListener("phx-relay", (event) => {
      console.log("phx-relay");
      const { name, payload } = event.detail || {};
      console.log({name, payload})
      relay.pushEvent(name, payload);
    });
  },
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
