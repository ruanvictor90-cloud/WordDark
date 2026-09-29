(() => {
  const root=document.documentElement;
  const saved=localStorage.getItem("worddark-theme");
  root.dataset.theme=saved==="light"?"light":"dark";
  const button=document.querySelector("[data-wd-theme]");
  if(button){
    const sync=()=>{button.textContent=root.dataset.theme==="light"?"☾ Modo escuro":"☀ Modo claro";};
    button.addEventListener("click",()=>{root.dataset.theme=root.dataset.theme==="light"?"dark":"light";localStorage.setItem("worddark-theme",root.dataset.theme);sync();});
    sync();
  }
})();