import anime from "animejs";

const duration = 1000;

document.addEventListener("DOMContentLoaded", async () => {
  await window.electron.onLoad();
});

window.electron.apps((items) => {
  for (const item of items) {
    const { name, description, shortcut, banner, category } = item;

    switch (category) {
      case "OnlineGames":
        addToOnlineGames(name, description, shortcut, banner);
        console.log(name);
        break;
    }
  }

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

function addToOnlineGames(name: string, description: string, shortcut: string, banner: string) {
  const onlineGamesList = document.getElementById("onlineGamesList");
  if (onlineGamesList) {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('item', 'position-relative', 'animate-to-top');

    const img = document.createElement('img');
    img.classList.add('background', 'position-absolute', 'w-100', 'h-100');
    img.src = banner.includes("Placeholder") ? `./assets/img/${banner}` : `./assets/img/banners/${banner}`;
    img.alt = banner;

    const overlayDiv = document.createElement('div');
    overlayDiv.classList.add('background-overlay');

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
    h4.classList.add('mb-0');
    h4.textContent = name;

    defaultDiv.appendChild(h4);

    itemDiv.appendChild(img);
    itemDiv.appendChild(overlayDiv);
    itemDiv.appendChild(hoverDiv);
    itemDiv.appendChild(defaultDiv);
    
    onlineGamesList.appendChild(itemDiv);
  }
}
