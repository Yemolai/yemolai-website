function openModalDialogHandler() {
  if (this?.open == false) this.showModal();
}

function closeModalDialogHandler() {
  if (this?.open == true) this.close();
}

function toggleModalDialogHandler() {
  if (this?.open) this.close();
  else if (this?.open == false) this.showModal();
}

function closeModalDialogOnBackdropClickHandler(event) {
  const { clientX: clickX, clientY: clickY } = event; // the event coordinates
  const { left, right, top, bottom } = event.target.getBoundingClientRect(); // the dialog body coordinates
  // will check if the click event coordinates are outside the boundaries of the dialog element
  if (clickX < left || clickX > right || clickY < top || clickY > bottom) {
    this.close();
  }
}

/**
 * Setups up a dialog to be able to listen for events dispatched from LiveView components to toggle open state using
 * showModal, through JavaScript. This is necessary as using LiveView with a declarative state gets the DOM stuck.
 *
 * This can be used to any way of emitting events in the given dialog element:
 * "open-modal" opens dialog as modal if isn't already open
 * "close-modal" closes dialog if isn't already closed
 * "toggle-modal" open as mocal or close based on current modal.open state
 *
 * This keeps the modal.open state in the DOM, but let it be easily controlled through JS.Dispatch in LiveView
 *
 * @param {String} elementId of a valid <dialog> DOM element
 */
function init(elementId, { closeOnBackdropClick = false } = {}) {
  const el = document.getElementById(elementId);
  if (!el || !("tagName" in el) || el.tagName != "DIALOG") {
    throw Error("Invalid element received. Expected <dialog> DOM Element");
  }
  el.addEventListener("open-modal", openModalDialogHandler);
  el.addEventListener("close-modal", closeModalDialogHandler);
  el.addEventListener("toggle-modal", toggleModalDialogHandler);
  if (closeOnBackdropClick == true) {
    el.addEventListener("click", closeModalDialogOnBackdropClickHandler);
  }
}

export default {
  init,
};
