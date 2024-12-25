import anime from "animejs";
import * as bootstrap from "bootstrap";

import {} from "./types/api";
import { App } from ".";

const duration = 1000;

document.addEventListener("DOMContentLoaded", async () => {
  await window.electron.onLoad();

  const forms = document.getElementsByClassName("needs-validation");
  if (forms) {
    for (const form of forms) {
      const formType = form as HTMLFormElement;
      formType.onsubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!formType.checkValidity()) {
          return formType.classList.add("was-validated");
        }

        if (formType.classList.contains("was-validated")) {
          formType.classList.remove("was-validated");
        }
      };
    }
  }
});

window.electron.apps((items) => {
  for (const item of items) {
    const { name, description, shortcut, banner, category } = item;
    createTableRow(name, description, shortcut, banner, category);

    switch (category) {
      case "OnlineGames":
        addToOnlineGames(name, description, shortcut, banner);
        break;
      case "OfflineGames":
        addToOfflineGames(name, description, shortcut, banner);
        break;
      case "Apps":
        addToApps(name, description, shortcut, banner);
        break;
    }
  }

  anime({
    targets: ".animate-onlineGames",
    top: ["150px", 0],
    opacity: "100%",
    duration: duration,
    easing: "easeOutQuint",
    delay: anime.stagger(100)
  });

  anime({
    targets: ".animate-to-top",
    top: ["150px", 0],
    opacity: "100%",
    duration: duration,
    easing: "easeOutQuint",
    delay: anime.stagger(100)
  });

  anime({
    targets: ".animate-to-bottom",
    top: ["-150px", 0],
    opacity: "100%",
    duration: duration,
    easing: "easeOutQuint",
    delay: anime.stagger(100)
  });

  anime({
    targets: ".animate-to-right",
    left: ["-150px", 0],
    opacity: "100%",
    duration: duration,
    easing: "easeOutQuint",
    delay: anime.stagger(100)
  });
});

window.electron.background((name) => {
  const mainElement = document.getElementsByTagName("main")[0];
  if (mainElement) {
    mainElement.setAttribute("style", `background: url('./assets/img/backgrounds/${name}')`)
    mainElement.style.backgroundSize = "cover";
    mainElement.style.backgroundPosition = "center";
    mainElement.style.backgroundRepeat = "no-repeat";
  }
});

const onlineGamesContainer = document.getElementById("onlineGames");
const offlineGamesContainer = document.getElementById("offlineGames");
const appsContainer = document.getElementById("apps");

const onlineGamesButton = document.getElementById("onlineGamesButton");
const offlineGamesButton = document.getElementById("offlineGamesButton");
const appsButton = document.getElementById("appsButton");

const search = document.getElementById("search") as HTMLInputElement;
if (search) {
  search.oninput = () => {
    const inners = document.getElementsByClassName("inner");
    for (const inner of inners) {
      const title = inner.getElementsByClassName("item-title")[0].innerHTML.toLowerCase();
      if (title && title.includes(search.value.toLowerCase())) {
        inner.classList.replace("d-none", "d-block");
      } else {
        inner.classList.replace("d-block", "d-none");
      }
    }
  };
}

function refreshInner() {
  const inners = document.getElementsByClassName("inner");
  for (const inner of inners) {
    if (inner.classList.contains("d-none")) {
      inner.classList.replace("d-none", "d-block");
    }
  }
}

if (
  onlineGamesButton &&
  offlineGamesButton &&
  appsButton &&
  onlineGamesContainer &&
  offlineGamesContainer &&
  appsContainer
) {
  onlineGamesButton.onclick = () => {
    refreshInner();

    onlineGamesContainer.classList.replace("d-none", "d-block");

    offlineGamesContainer.classList.replace("d-block", "d-none");
    appsContainer.classList.replace("d-block", "d-none");

    anime({
      targets: ".animate-onlineGames",
      top: ["150px", 0],
      opacity: "100%",
      duration: duration,
      easing: "easeOutQuint",
      delay: anime.stagger(100)
    });
  }

  offlineGamesButton.onclick = () => {
    refreshInner();

    onlineGamesContainer.classList.replace("d-block", "d-none");

    offlineGamesContainer.classList.replace("d-none", "d-block");

    appsContainer.classList.replace("d-block", "d-none");

    anime({
      targets: ".animate-offlineGames",
      top: ["150px", 0],
      opacity: "100%",
      duration: duration,
      easing: "easeOutQuint",
      delay: anime.stagger(100)
    });
  }

  appsButton.onclick = () => {
    refreshInner();

    onlineGamesContainer.classList.replace("d-block", "d-none");
    offlineGamesContainer.classList.replace("d-block", "d-none");

    appsContainer.classList.replace("d-none", "d-block");

    anime({
      targets: ".animate-apps",
      top: ["150px", 0],
      opacity: "100%",
      duration: duration,
      easing: "easeOutQuint",
      delay: anime.stagger(100)
    });
  }
}

const manageAppsForm = document.getElementById("manageAppsForm") as HTMLFormElement;
if (manageAppsForm) {
  manageAppsForm.addEventListener("submit", () => {
    const formData = new FormData(manageAppsForm);
    const names = formData.getAll("nameInput");
    const descriptions = formData.getAll("description");
    const shortcuts = formData.getAll("shortcut");
    const banners = formData.getAll("banner");
    const categories = formData.getAll("category");

    const newData: App[] = names.map((name, index) => {
      return {
        name: name,
        description: descriptions[index],
        shortcut: shortcuts[index],
        banner: banners[index],
        category: categories[index],
      } as App
    });

    window.electron.saveChanges(JSON.stringify(newData, null, 4));
  });
}

function addToOnlineGames(name: string, description: string, shortcut: string, banner: string) {
  const onlineGamesList = document.getElementById("onlineGamesList");
  if (onlineGamesList) {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item', 'position-relative', 'animate-onlineGames');

    const img = document.createElement('img');
    img.classList.add('background', 'position-absolute', 'w-100', 'h-100', "rounded-3");
    img.src = banner.includes("Placeholder") ? `./assets/img/${banner}` : `./assets/img/banners/${banner}`;
    img.alt = banner;
    img.onerror = () => {
      img.src = "./assets/img/Placeholder.jpg";
      img.alt = "Placeholder.jpg";
    }

    const overlayDiv = document.createElement('div');
    overlayDiv.classList.add('background-overlay', "rounded-3");

    const hoverDiv = document.createElement('div');
    hoverDiv.classList.add('hover', 'position-absolute', 'w-100', 'h-100', 'p-3');
    const p1 = document.createElement('p');
    p1.textContent = name;
    const p2 = document.createElement('p');
    p2.textContent = description;
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('btn', 'btn-primary', 'fw-semibold', 'px-5', 'open-btn');
    button.textContent = 'Open';
    button.onclick = async () => {
      await window.electron.openApp(name, shortcut);
    }

    hoverDiv.appendChild(p1);
    hoverDiv.appendChild(p2);
    hoverDiv.appendChild(button);

    const defaultDiv = document.createElement('div');
    defaultDiv.classList.add('default', 'position-absolute', 'start-0', 'bottom-0', 'end-0', 'px-3', 'py-2');
    const h4 = document.createElement('h4');
    h4.classList.add('mb-0', 'item-title');
    h4.textContent = name;

    defaultDiv.appendChild(h4);

    itemDiv.appendChild(img);
    itemDiv.appendChild(overlayDiv);
    itemDiv.appendChild(hoverDiv);
    itemDiv.appendChild(defaultDiv);

    const containerDiv = document.createElement("div");
    containerDiv.classList.add("inner")

    containerDiv.appendChild(itemDiv);
    
    onlineGamesList.appendChild(containerDiv);
  }
}

function addToOfflineGames(name: string, description: string, shortcut: string, banner: string) {
  const offlineGamesList = document.getElementById("offlineGamesList");
  if (offlineGamesList) {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item', 'position-relative', 'animate-offlineGames');

    const img = document.createElement('img');
    img.classList.add('background', 'position-absolute', 'w-100', 'h-100', "rounded-3");
    img.src = banner.includes("Placeholder") ? `./assets/img/${banner}` : `./assets/img/banners/${banner}`;
    img.alt = banner;
    img.onerror = () => {
      img.src = "./assets/img/Placeholder.jpg";
      img.alt = "Placeholder.jpg";
    }

    const overlayDiv = document.createElement('div');
    overlayDiv.classList.add('background-overlay', "rounded-3");

    const hoverDiv = document.createElement('div');
    hoverDiv.classList.add('hover', 'position-absolute', 'w-100', 'h-100', 'p-3');
    const p1 = document.createElement('p');
    p1.textContent = name;
    const p2 = document.createElement('p');
    p2.textContent = description;
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('btn', 'btn-primary', 'fw-semibold', 'px-5', 'open-btn');
    button.textContent = 'Open';
    button.onclick = async () => {
      await window.electron.openApp(name, shortcut);
    }

    hoverDiv.appendChild(p1);
    hoverDiv.appendChild(p2);
    hoverDiv.appendChild(button);

    const defaultDiv = document.createElement('div');
    defaultDiv.classList.add('default', 'position-absolute', 'start-0', 'bottom-0', 'end-0', 'px-3', 'py-2');
    const h4 = document.createElement('h4');
    h4.classList.add('mb-0', 'item-title');
    h4.textContent = name;

    defaultDiv.appendChild(h4);

    itemDiv.appendChild(img);
    itemDiv.appendChild(overlayDiv);
    itemDiv.appendChild(hoverDiv);
    itemDiv.appendChild(defaultDiv);

    const containerDiv = document.createElement("div");
    containerDiv.classList.add("inner")

    containerDiv.appendChild(itemDiv);
    
    offlineGamesList.appendChild(containerDiv);
  }
}

function addToApps(name: string, description: string, shortcut: string, banner: string) {
  const appsList = document.getElementById("appsList");
  if (appsList) {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item', 'position-relative', 'animate-apps');

    const img = document.createElement('img');
    img.classList.add('background', 'position-absolute', 'w-100', 'h-100', "rounded-3");
    img.src = banner.includes("Placeholder") ? `./assets/img/${banner}` : `./assets/img/banners/${banner}`;
    img.alt = banner;
    img.onerror = () => {
      img.src = "./assets/img/Placeholder.jpg";
      img.alt = "Placeholder.jpg";
    }

    const overlayDiv = document.createElement('div');
    overlayDiv.classList.add('background-overlay', "rounded-3");

    const hoverDiv = document.createElement('div');
    hoverDiv.classList.add('hover', 'position-absolute', 'w-100', 'h-100', 'p-3');
    const p1 = document.createElement('p');
    p1.textContent = name;
    const p2 = document.createElement('p');
    p2.textContent = description;
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('btn', 'btn-primary', 'fw-semibold', 'px-5', 'open-btn');
    button.textContent = 'Open';
    button.onclick = async () => {
      await window.electron.openApp(name, shortcut);
    }

    hoverDiv.appendChild(p1);
    hoverDiv.appendChild(p2);
    hoverDiv.appendChild(button);

    const defaultDiv = document.createElement('div');
    defaultDiv.classList.add('default', 'position-absolute', 'start-0', 'bottom-0', 'end-0', 'px-3', 'py-2');
    const h4 = document.createElement('h4');
    h4.classList.add('mb-0', 'item-title');
    h4.textContent = name;

    defaultDiv.appendChild(h4);

    itemDiv.appendChild(img);
    itemDiv.appendChild(overlayDiv);
    itemDiv.appendChild(hoverDiv);
    itemDiv.appendChild(defaultDiv);

    const containerDiv = document.createElement("div");
    containerDiv.classList.add("inner")

    containerDiv.appendChild(itemDiv);
    
    appsList.appendChild(containerDiv);
  }
}

function createTableRow(name: string, description: string, shortcut: string, banner: string, category: string) {
  const manageAppsTable = document.getElementById("manageAppsTable");
  if (manageAppsTable) {
    const row = document.createElement('tr');

    const nameTh = document.createElement('th');
    nameTh.setAttribute('scope', 'row');
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.name = 'nameInput';
    nameInput.classList.add('form-control', "form-control-sm");
    nameInput.required = true;
    nameInput.value = name;
    nameTh.appendChild(nameInput);

    const descriptionTh = document.createElement('th');
    const descriptionTextarea = document.createElement('textarea');
    descriptionTextarea.name = 'description';
    descriptionTextarea.classList.add('form-control', "form-control-sm");
    descriptionTextarea.style.height = '17px';
    descriptionTextarea.required = true;
    descriptionTextarea.value = description;
    descriptionTh.appendChild(descriptionTextarea);

    const shortcutTh = document.createElement('th');
    const shortcutInput = document.createElement('input');
    shortcutInput.type = 'text';
    shortcutInput.name = 'shortcut';
    shortcutInput.classList.add('form-control', "form-control-sm");
    shortcutInput.readOnly = true;
    shortcutInput.value = shortcut;
    shortcutInput.setAttribute("data-bs-toggle", "tooltip");
    shortcutInput.setAttribute("data-bs-title", shortcut);
    new bootstrap.Tooltip(shortcutInput);
    shortcutTh.appendChild(shortcutInput);

    const bannerTh = document.createElement('th');
    const bannerInput = document.createElement('input');
    bannerInput.classList.add('form-control', "form-control-sm");
    bannerInput.type = 'text';
    bannerInput.name = 'banner';
    bannerInput.value = banner;
    bannerInput.required = true;
    bannerInput.readOnly = true;
    bannerInput.setAttribute("data-bs-toggle", "tooltip");
    bannerInput.setAttribute("data-bs-title", banner);
    const bannerInputTooltip = new bootstrap.Tooltip(bannerInput);
    bannerInput.style.cursor = "pointer";

    bannerInput.onclick = () => {
      window.electron.selectBanner(shortcut);
    }

    window.electron.selectedBanner((selectedBanner, selectedShortcut) => {
      if (selectedShortcut === shortcut) {
        bannerInput.value = selectedBanner;
        bannerInputTooltip.setContent({ ".tooltip-inner": selectedBanner });
      }
    });

    bannerTh.appendChild(bannerInput);

    const categoryTh = document.createElement('th');
    categoryTh.classList.add('position-relative');
    const span = document.createElement('span');
    span.classList.add('position-absolute', 'top-0', 'start-100', 'translate-middle', 'p-2', 'bg-danger', 'border', 'border-light', 'rounded-circle', "d-none");
    categoryTh.appendChild(span);

    const categorySelect = document.createElement('select');
    categorySelect.classList.add('form-select', "form-select-sm");
    categorySelect.name = 'category';
    const option1 = document.createElement('option');
    option1.value = 'None';
    option1.textContent = 'None';
    option1.selected = category === option1.value;

    if (option1.selected) {
      span.classList.replace("d-none", "d-block");
    }

    const option2 = document.createElement('option');
    option2.value = 'OnlineGames';
    option2.textContent = 'Online Games';
    option2.selected = category === option2.value;

    const option3 = document.createElement('option');
    option3.value = 'OfflineGames';
    option3.textContent = 'Offline Games';
    option3.selected = category === option3.value;

    const option4 = document.createElement('option');
    option4.value = 'Apps';
    option4.textContent = 'Apps';
    option4.selected = category === option4.value;

    categorySelect.onchange = () => {
      if (option1.selected) {
        span.classList.replace("d-none", "d-block");
      } else {
        span.classList.replace("d-block", "d-none");
      }
    };

    categorySelect.appendChild(option1);
    categorySelect.appendChild(option2);
    categorySelect.appendChild(option3);
    categorySelect.appendChild(option4);
    categoryTh.appendChild(categorySelect);

    row.appendChild(nameTh);
    row.appendChild(descriptionTh);
    row.appendChild(shortcutTh);
    row.appendChild(bannerTh);
    row.appendChild(categoryTh);

    manageAppsTable.appendChild(row);
  }
}

function openLink(url: string) {
  window.electron.openLink(url);
}

(window as any).App = {
  openLink
}
