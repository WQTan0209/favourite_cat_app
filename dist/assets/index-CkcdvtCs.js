(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))s(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function i(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerPolicy&&(n.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?n.credentials="include":t.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(t){if(t.ep)return;t.ep=!0;const n=i(t);fetch(t.href,n)}})();const o=document.getElementById("app");let l="start";const f=15;let d=0,c=[];function y(){u()}function u(){o.innerHTML="",l==="start"&&h(),l==="game"&&p(),l==="summary"&&E()}function m(e){const r=o.firstElementChild;r?(r.classList.add("exit"),setTimeout(()=>{l=e,u()},400)):(l=e,u())}function h(){const e=document.createElement("div");e.className="start-container screen text-align-center",e.innerHTML=`
    <h1 class="title quicksand-bold primary-color">Welcome To</h1>
    <h1 class="title quicksand-bold primary-color">PAW PAW!</h1>
    <img src="./src/assets/img/cat_icon.jpg" class="image-icon" />
    <button id="start-btn" class="btn">
      <img src="./src/assets/img/cat_paws_white.png" />
      <span>START</span>
    </button>
  `,o.appendChild(e),document.getElementById("start-btn").addEventListener("click",()=>{m("game")})}function v(){return`https://cataas.com/cat?random=${Math.random()}`}function p(){if(d>=f){m("summary");return}const e=v(),r=b(e);o.innerHTML=`
    <div class="game-container screen">
      <div class="instruction-container text-align-center">
        <span class="subtitle quicksand-bold primary-color transform-scale-bigger">Let's Swipe Cute Cat!</span>
        <div class="category">
          <span class="primary-color">&#8592; Dislike</span>
          <span class="primary-color">Like &#8594;</span>
        </div>
      </div>
      <div class="card-container"></div>
    </div>
  `,o.querySelector(".card-container").appendChild(r),d++}function b(e){const r=document.createElement("div");r.className="card loading";const i=document.createElement("img");i.src="/loading.gif",i.className="loading-img",r.appendChild(i);const s=new Image;return s.src=e,s.draggable=!1,s.onload=()=>{r.classList.remove("loading"),r.replaceChild(s,i)},L(r,e),r}function L(e,r){let i=0,s=0,t=!1;e.addEventListener("pointerdown",n=>{t=!0,i=n.clientX,s=n.clientX,e.setPointerCapture(n.pointerId),e.style.transition="none"}),e.addEventListener("pointermove",n=>{if(!t)return;s=n.clientX;const a=s-i,g=a/15;e.style.transform=`translateX(${a}px) rotate(${g}deg)`}),e.addEventListener("pointerup",n=>{if(!t)return;t=!1,e.releasePointerCapture(n.pointerId);const a=s-i;e.style.transition="transform 0.4s ease-out",a>150?(c.push(r),e.style.transform="translateX(1000px) rotate(30deg)",setTimeout(p,300)):a<-150?(e.style.transform="translateX(-1000px) rotate(-30deg)",setTimeout(p,300)):e.style.transform="translateX(0) rotate(0)"})}function E(){o.innerHTML=`
    <div class="summary-container screen text-align-center">
      <h2 class="quicksand-bold primary-color">Here's Your ${c.length} Favourite Cats 😺!</h2>
      <div class="grid image-list">
        ${c.map(e=>`<img src="${e}" />`).join("")}
      </div>
      <div class="btn-list">
        <button id="retry-btn" class="btn">
          <img src="./src/assets/img/cat_paws_white.png" />
          <span>RETRY</span>
        </button>
        <button id="exit-btn" class="btn">
          <img src="./src/assets/img/cat_paws_white.png" />
          <span>EXIT</span>
        </button>
      </div>
    </div>
  `,document.getElementById("retry-btn").addEventListener("click",()=>{d=0,c=[],m("game")}),document.getElementById("exit-btn").addEventListener("click",()=>{d=0,c=[],m("start")})}y();
