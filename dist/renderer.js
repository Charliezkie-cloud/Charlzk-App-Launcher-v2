"use strict";
window.onload = () => {
    window.electron.onLoad();
};
window.electron.apps((data) => {
});
function addToOnlineGames(name, description, shortcut, banner) {
    var _a;
    const onlineGamesList = (_a = document.getElementById("onlineGames")) === null || _a === void 0 ? void 0 : _a.getElementsByClassName(".list")[0];
    if (onlineGamesList) {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('item', 'position-relative', 'animate-to-top');
        const img = document.createElement('img');
        img.classList.add('background', 'position-absolute', 'w-100', 'h-100');
        img.src = './assets/img/banners/crossfire.webp';
        img.alt = 'crossfire.webp';
        const overlayDiv = document.createElement('div');
        overlayDiv.classList.add('background-overlay');
        const hoverDiv = document.createElement('div');
        hoverDiv.classList.add('hover', 'position-absolute', 'w-100', 'h-100', 'p-3');
        const p1 = document.createElement('p');
        p1.textContent = 'Lorem Ipsum';
        const p2 = document.createElement('p');
        p2.textContent = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce eu ante mi. Morbi quam nunc, molestie nec tortor nec, tincidunt gravida nisi. Fusce auctor nibh id libero pellentesque maximus.';
        const button = document.createElement('button');
        button.type = 'button';
        button.classList.add('btn', 'btn-primary', 'fw-semibold', 'px-5', 'open-btn');
        button.textContent = 'Open';
        hoverDiv.appendChild(p1);
        hoverDiv.appendChild(p2);
        hoverDiv.appendChild(button);
        const defaultDiv = document.createElement('div');
        defaultDiv.classList.add('default', 'position-absolute', 'start-0', 'bottom-0', 'end-0', 'px-3', 'py-2');
        const h3 = document.createElement('h3');
        h3.classList.add('mb-0');
        h3.textContent = name;
        defaultDiv.appendChild(h3);
        itemDiv.appendChild(img);
        itemDiv.appendChild(overlayDiv);
        itemDiv.appendChild(hoverDiv);
        itemDiv.appendChild(defaultDiv);
        return onlineGamesList === null || onlineGamesList === void 0 ? void 0 : onlineGamesList.appendChild(itemDiv);
    }
}
