import letterTemplates from './letterTemplates.js';

const form = document.getElementById('letterForm');
const mainContainer = document.getElementById('mainContainer');
const letterBook = document.getElementById('letterBook');
const pagesContainer = document.getElementById('pagesContainer');
const bookControls = document.getElementById('bookControls');

let pages = [];
let currentPage = 0;
let isAnimating = false;

function fillTemplates(to, from, message) {
    let filled = letterTemplates.map((tpl, i) => {
        if (tpl.includes('{message}')) {
            const msgPages = splitMessagePages(message, 180);
            return msgPages.map(m => tpl.replace('{message}', m));
        }
        return tpl.replace('{to}', to).replace('{from}', from);
    });
    return filled.flat();
}

function splitMessagePages(msg, maxLen) {
    const sentences = msg.match(/[^.!?\n]+[.!?\n]+|[^.!?\n]+$/g) || [];
    let page = '';
    let result = [];
    for (let s of sentences) {
        if ((page + s).length > maxLen && page.length > 0) {
            result.push(page);
            page = '';
        }
        page += s;
    }
    if (page.length > 0) result.push(page);
    return result;
}

function isTouchDevice() {
    return window.matchMedia('(pointer: coarse)').matches;
}

function renderBook() {
    pagesContainer.innerHTML = '';
    for (let i = 0; i < pages.length; i++) {
        const card = document.createElement('div');
        card.className = 'page-card';
        if (i < currentPage) card.classList.add('hide', 'prev');
        else if (i > currentPage) card.classList.add('hide', 'next');
        card.textContent = pages[i];
        card.style.zIndex = (i === currentPage) ? 2 : 1;
        if (i === currentPage && isTouchDevice()) {
            let startX = null;
            let dragging = false;
            // Pointer events (modern browsers)
            card.addEventListener('pointerdown', e => {
                if (isAnimating) return;
                if (e.pointerType === 'touch' || e.pointerType === 'pen') {
                    startX = e.clientX;
                    dragging = true;
                }
            });
            card.addEventListener('pointerup', e => {
                if (isAnimating || !dragging || startX === null) return;
                let endX = e.clientX;
                let diff = endX - startX;
                if (diff < -40 && currentPage < pages.length - 1) {
                    nextPage();
                } else if (diff > 40 && currentPage > 0) {
                    prevPage();
                }
                startX = null;
                dragging = false;
            });
            card.addEventListener('touchstart', e => {
                if (isAnimating) return;
                startX = e.touches[0].clientX;
                dragging = true;
            });
            card.addEventListener('touchend', e => {
                if (isAnimating || !dragging || startX === null) return;
                let endX = e.changedTouches[0].clientX;
                let diff = endX - startX;
                if (diff < -40 && currentPage < pages.length - 1) {
                    nextPage();
                } else if (diff > 40 && currentPage > 0) {
                    prevPage();
                }
                startX = null;
                dragging = false;
            });
            // Visual swipe hint for mobile
            const swipeHint = document.createElement('div');
            swipeHint.style.position = 'absolute';
            swipeHint.style.bottom = '18px';
            swipeHint.style.left = '50%';
            swipeHint.style.transform = 'translateX(-50%)';
            swipeHint.style.fontSize = '1.1rem';
            swipeHint.style.opacity = '0.5';
            swipeHint.style.pointerEvents = 'none';
            swipeHint.innerHTML = '⬅️ Swipe ➡️';
            card.appendChild(swipeHint);
        }
        pagesContainer.appendChild(card);
    }
    if (!isTouchDevice()) {
        bookControls.innerHTML = '';
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '⟵ Prev';
        prevBtn.className = 'page-btn';
        prevBtn.disabled = currentPage === 0;
        prevBtn.onclick = prevPage;
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next ⟶';
        nextBtn.className = 'page-btn';
        nextBtn.disabled = currentPage === pages.length - 1;
        nextBtn.onclick = nextPage;
        const indicator = document.createElement('span');
        indicator.className = 'page-indicator';
        indicator.textContent = `Page ${currentPage + 1} of ${pages.length}`;
        bookControls.appendChild(prevBtn);
        bookControls.appendChild(indicator);
        bookControls.appendChild(nextBtn);
        bookControls.style.display = 'flex';
    } else {
        bookControls.innerHTML = '';
        bookControls.style.display = 'none';
    }
}

function nextPage() {
    if (currentPage < pages.length - 1 && !isAnimating) {
        isAnimating = true;
        const cards = document.querySelectorAll('.page-card');
        cards[currentPage].classList.add('hide', 'next');
        setTimeout(() => {
            currentPage++;
            renderBook();
            isAnimating = false;
        }, 500);
    }
}

function prevPage() {
    if (currentPage > 0 && !isAnimating) {
        isAnimating = true;
        const cards = document.querySelectorAll('.page-card');
        cards[currentPage].classList.add('hide', 'prev');
        setTimeout(() => {
            currentPage--;
            renderBook();
            isAnimating = false;
        }, 500);
    }
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const to = document.getElementById('to').value.trim();
    const message = document.getElementById('message').value.trim();
    const from = document.getElementById('from').value.trim();
    pages = fillTemplates(to, from, message);
    currentPage = 0;
    mainContainer.style.display = 'none';
    letterBook.style.display = 'flex';
    renderBook();
});