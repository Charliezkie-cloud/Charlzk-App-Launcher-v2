window.onload = () => {
  window.electron.onLoad();
}

window.electron.onLoadReply((message) => {
  console.log(message);
});
