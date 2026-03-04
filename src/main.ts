import './style.scss'

const app = document.getElementById('app')!

type AppState = 'start' | 'game' | 'summary'
let state: AppState = 'start'

const TOTAL_CATS = 15
let currentCount = 0
let likedCats: string[] = []

/* APP ENTRY */
function init() {
  render()
}

/* RENDER */
function render() {
  app.innerHTML = ''

  if (state === 'start') {
    renderStart()
  }

  if (state === 'game') {
    createAndShowCard()
  }

  if (state === 'summary') {
    renderSummary()
  }
}

/* SWITCH PAGE WITH ANIMATION */
function changeState(newState: AppState) {
  const currentScreen = app.firstElementChild as HTMLElement

  if (currentScreen) {
    currentScreen.classList.add('exit')

    setTimeout(() => {
      state = newState
      render()
    }, 400)
  } else {
    state = newState
    render()
  }
}

/* START PAGE */
function renderStart() {
  const container = document.createElement('div')
  container.className = 'start-container screen text-align-center'

  container.innerHTML = `
    <h1 class="title quicksand-bold primary-color">Welcome To</h1>
    <h1 class="title quicksand-bold primary-color">PAW PAW!</h1>
    <img src="./src/assets/img/cat_icon.jpg" class="image-icon" />
    <button id="start-btn" class="btn">
      <img src="./src/assets/img/cat_paws_white.png" />
      <span>START</span>
    </button>
  `

  app.appendChild(container)

  document.getElementById('start-btn')!.addEventListener('click', () => {
    changeState('game')
  })
}

/* GAME PAGE */
function getCatUrl() {
  return `https://cataas.com/cat?random=${Math.random()}`
}

function createAndShowCard() {
  if (currentCount >= TOTAL_CATS) {
    changeState('summary')
    return
  }

  const imageUrl = getCatUrl()
  const card = createCard(imageUrl)

  app.innerHTML = `
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
  `

  const container = app.querySelector('.card-container')!
  container.appendChild(card)

  currentCount++
}

function createCard(imageUrl: string) {
  const card = document.createElement('div')
  card.className = 'card loading'

  const loadingImg = document.createElement('img')
  loadingImg.src = '/loading.gif'
  loadingImg.className = 'loading-img'
  card.appendChild(loadingImg)

  const realImg = new Image()
  realImg.src = imageUrl
  realImg.draggable = false

  realImg.onload = () => {
    card.classList.remove('loading')
    card.replaceChild(realImg, loadingImg)
  }

  addSwipe(card, imageUrl)

  return card
}

function addSwipe(card: HTMLElement, imageUrl: string) {
  let startX = 0
  let currentX = 0
  let isDragging = false

  card.addEventListener('pointerdown', (e) => {
    isDragging = true
    startX = e.clientX
    currentX = e.clientX
    card.setPointerCapture(e.pointerId)
    card.style.transition = 'none'
  })

  card.addEventListener('pointermove', (e) => {
    if (!isDragging) return

    currentX = e.clientX
    const diff = currentX - startX
    const rotate = diff / 15

    card.style.transform = `translateX(${diff}px) rotate(${rotate}deg)`
  })

  card.addEventListener('pointerup', (e) => {
    if (!isDragging) return
    isDragging = false

    card.releasePointerCapture(e.pointerId)
    const diff = currentX - startX

    card.style.transition = 'transform 0.4s ease-out'

    if (diff > 150) {
      likedCats.push(imageUrl)
      card.style.transform = `translateX(1000px) rotate(30deg)`
      setTimeout(createAndShowCard, 300)
    } else if (diff < -150) {
      card.style.transform = `translateX(-1000px) rotate(-30deg)`
      setTimeout(createAndShowCard, 300)
    } else {
      card.style.transform = 'translateX(0) rotate(0)'
    }
  })
}

/* SUMMARY PAGE */
function renderSummary() {
  app.innerHTML = `
    <div class="summary-container screen text-align-center">
      <h2 class="quicksand-bold primary-color">Here's Your ${likedCats.length} Favourite Cats 😺!</h2>
      <div class="grid image-list">
        ${likedCats
      .map((url) => `<img src="${url}" />`)
      .join('')}
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
  `

  document.getElementById('retry-btn')!.addEventListener('click', () => {
    currentCount = 0
    likedCats = []
    changeState('game')
  })

  document.getElementById('exit-btn')!.addEventListener('click', () => {
    currentCount = 0
    likedCats = []
    changeState('start')
  })
}

init()