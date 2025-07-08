var body = document.querySelector("body"),
  labels = document.querySelectorAll(".toggle label"),
  toggle = document.querySelector(".toggle__wrapper"),
  radioInputs = document.querySelectorAll(".toggle__wrapper input"),
  toggleBtn = document.querySelector(".toggle__button");

var j = 1,
  btnOptions = ["toggle__button--dark", "toggle__button--light"],
  colorMode = localStorage.getItem("colorMode");
// until this comment
colorMode ? checkMode(colorMode) : checkMode(toggleBtn.className.split(" ")[1]);
toggle.addEventListener("click", (e) => {
  toggleSwitch();
  e.stopPropagation();
});
labels.forEach(function (label) {
  label.onclick = (e) => e.preventDefault();
});

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    if (e.matches) {
      if (toggleBtn.classList.contains(btnOptions[1])) toggleSwitch();
    } else {
      if (toggleBtn.classList.contains(btnOptions[0])) toggleSwitch();
    }
  });

function toggleSwitch() {
  var i = btnOptions.indexOf(toggleBtn.className.split(" ")[1]);
  i === 0 ? (j = 1) : (j = -1);
  localStorage.setItem("colorMode", btnOptions[i + j]);
  checkMode(btnOptions[i + j], btnOptions[i]);
  radioInputs.forEach((input) => input.removeAttribute("checked"));
  radioInputs[i + j].setAttribute("checked", true);
}
function checkMode(mode, removed = toggleBtn.className.split(" ")[1]) {
  mode === btnOptions[0]
    ? (body.dataset.theme = "dark")
    : (body.dataset.theme = "light");
  toggleRename(mode, removed);
}

function toggleRename(added, removed) {
  toggleBtn.classList.remove(removed);
  toggleBtn.classList.add(added);
}
