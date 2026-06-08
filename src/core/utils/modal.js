export const closeBootstrapModal = (modalId) => {
  const element = document.getElementById(modalId);
  if (!element) return;

  const modal = window.bootstrap?.Modal?.getInstance(element);
  if (modal) {
    modal.hide();
    return;
  }

  element.classList.remove("show");
  element.style.display = "none";
  document.body.classList.remove("modal-open");
  document.querySelector(".modal-backdrop")?.remove();
};
