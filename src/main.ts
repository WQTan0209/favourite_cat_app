import './style.scss'

const app = document.getElementById('app')!

const TOTAL_CATS = 6
let currentCount = 0
let likedCats: string[] = []

function init() {
  createAndShowCard()
}

function getCatUrl() {
  return `https://cataas.com/cat?random=${Math.random()}`
}

function createAndShowCard() {
  if (currentCount >= TOTAL_CATS) {
    showSummary()
    return
  }

  const imageUrl = getCatUrl()
  const card = createCard(imageUrl)

  app.innerHTML = ''
  app.appendChild(card)

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
    if (e.button !== 0) return

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

function showSummary() {
  app.innerHTML = `
    <div style="text-align:center">
      <h2>You liked ${likedCats.length} cats 😺</h2>
      <div class="summary-container" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:20px">
        ${likedCats
      .map(
        (url) =>
          `<img src="${url}"/>`
      )
      .join('')}
      </div>
      <button id="retry">RETRY</button>
    </div>
  `

  document.getElementById('retry')!.addEventListener('click', () => {
    currentCount = 0
    likedCats = []
    createAndShowCard()
  })
}

init()