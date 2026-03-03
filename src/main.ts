import './style.scss'

const app = document.getElementById('app')!

const TOTAL_CATS = 6
let currentIndex = 0
let likedCats: string[] = []
let cats: string[] = []

function init() {
  loadCats()
}

function loadCats() {
  for (let i = 0; i < TOTAL_CATS; i++) {
    cats.push(`https://cataas.com/cat?random=${Math.random()}`)
  }

  renderCards()
}

function renderCards() {
  app.innerHTML = ''

  cats
    .slice(currentIndex)
    .reverse()
    .forEach((url) => {
      const card = createCard(url)
      app.appendChild(card)
    })
}

function createCard(imageUrl: string) {
  const card = document.createElement('div')
  card.className = 'card'

  const img = document.createElement('img')
  img.src = imageUrl
  img.draggable = false

  card.appendChild(img)
  addSwipe(card, imageUrl)

  return card
}

function addSwipe(card: HTMLElement, imageUrl: string) {
  let startX = 0
  let currentX = 0
  let isDragging = false

  card.addEventListener('pointerdown', (e) => {
    if (e.button !== 0) return

    e.preventDefault()

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
      setTimeout(nextCard, 300)
    }
    else if (diff < -150) {
      card.style.transform = `translateX(-1000px) rotate(-30deg)`
      setTimeout(nextCard, 300)
    }
    else {
      card.style.transform = 'translateX(0) rotate(0)'
    }
  })
}

function nextCard() {
  currentIndex++

  if (currentIndex >= TOTAL_CATS) {
    showSummary()
  } else {
    renderCards()
  }
}

function showSummary() {
  app.innerHTML = `
    <div style="text-align:center">
      <h2>You liked ${likedCats.length} cats 😺</h2>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:20px">
        ${likedCats.map((url) => `<img src="${url}" style="width:100%;border-radius:10px"/>`).join('')}
      </div>
      <button id="retry">RETRY</button>
    </div>
  `

  document.getElementById('retry')!.addEventListener('click', () => {
    currentIndex = 0
    likedCats = []
    cats = []
    loadCats()
  })
}

init()