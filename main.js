import {diaryEntries, galleryItems} from "./data.js"

function renderDiary() {
    const grid = document.getElementById('diaryGrid');
    diaryEntries.forEach((e, i) => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 reveal';
        col.style.transitionDelay = (i % 3) * 0.1 + 's';
        col.innerHTML = `
      <div class="diary-card">
        <div class="diary-card-header">
          <p class="diary-date"><i class="bi bi-calendar3 me-1"></i>${e.date}</p>
          <h5>${e.title}</h5>
        </div>
        <div class="diary-card-body">
          <div class="diary-mood">${e.mood}</div>
          <p class="diary-preview">${e.preview}</p>
          <div class="d-flex gap-1 flex-wrap mb-3">
            ${e.tags.map(t => `<span class="about-tag" style="font-size:.72rem;padding:.18rem .7rem;">${t}</span>`).join('')}
          </div>
          <button class="btn-read-more">
            Read More <i class="bi bi-arrow-right ms-1"></i>
          </button>
        </div>
      </div>`;
        col.querySelector('.btn-read-more').addEventListener('click', () => openDiary(e.id));
        grid.appendChild(col);
    });
}



function openDiary(id) {
    const e = diaryEntries.find(d => d.id === id);
    if (!e) return;
    document.getElementById('modalTitle').textContent = e.title;
    document.getElementById('modalMeta').innerHTML = `
    <span><i class="bi bi-calendar3"></i> ${e.date}</span>
    <span><i class="bi bi-emoji-smile"></i> ${e.mood}</span>
    ${e.tags.map(t => `<span><i class="bi bi-tag"></i> ${t}</span>`).join('')}
  `;
    document.getElementById('modalContent').innerHTML = e.content;
    new bootstrap.Modal(document.getElementById('diaryModal')).show();
}

let currentLbIdx = 0;
let filteredItems = [...galleryItems];

function renderGallery(filter = 'all') {
    filteredItems = filter === 'all' ? galleryItems : galleryItems.filter(i => i.cat === filter);
    const grid = document.getElementById('masonryGrid');
    grid.innerHTML = '';
    filteredItems.forEach((item, i) => {
        const el = document.createElement('div');
        el.className = 'masonry-item';
        el.setAttribute('data-idx', i);
        
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.label;
        img.loading = 'lazy';
        
        const overlay = document.createElement('div');
        overlay.className = 'masonry-overlay';
        overlay.innerHTML = `
            <div class="masonry-overlay-text">
                <span>${item.cat.charAt(0).toUpperCase() + item.cat.slice(1)}</span>
                <p>${item.label}</p>
            </div>
        `;
        
        el.appendChild(img);
        el.appendChild(overlay);
        el.addEventListener('click', () => openLightbox(i));
        grid.appendChild(el);
    });
}

function openLightbox(idx) {
    currentLbIdx = idx;
    const item = filteredItems[idx];
    
    // Hide placeholder and show image
    document.getElementById('lbPlaceholder').style.display = 'none';
    document.getElementById('lbImg').style.display = 'block';
    document.getElementById('lbImg').src = item.src;
    document.getElementById('lbImg').alt = item.label;
    
    // Update caption with label and description
    const captionEl = document.getElementById('lbCaption');
    captionEl.innerHTML = `<strong>${item.label}</strong><br/>${item.caption}`;
    
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

document.getElementById('lbClose').addEventListener('click', closeLightbox);
document.getElementById('lightbox').addEventListener('click', e => {
    if (e.target === document.getElementById('lightbox')) closeLightbox();
});
document.getElementById('lbPrev').addEventListener('click', () => {
    currentLbIdx = (currentLbIdx - 1 + filteredItems.length) % filteredItems.length;
    openLightbox(currentLbIdx);
});
document.getElementById('lbNext').addEventListener('click', () => {
    currentLbIdx = (currentLbIdx + 1) % filteredItems.length;
    openLightbox(currentLbIdx);
});
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') document.getElementById('lbPrev').click();
    if (e.key === 'ArrowRight') document.getElementById('lbNext').click();
});


document.getElementById('filterBtns').addEventListener('click', e => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderGallery(btn.dataset.filter);
});


const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    highlightNav();
});

function highlightNav() {
    const sections = ['home', 'about', 'diary', 'gallery', 'contact'];
    const scrollY = window.scrollY + 120;
    sections.forEach(id => {
        const sec = document.getElementById(id);
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (!sec || !link) return;
        if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active-section'));
            link.classList.add('active-section');
        }
    });
}


document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        const collapse = document.getElementById('navMenu');
        const bsCollapse = bootstrap.Collapse.getInstance(collapse);
        if (bsCollapse) bsCollapse.hide();
    });
});


const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
    });
}, { threshold: .12 });

function observeReveals() {
    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}


document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    this.classList.add('was-validated');
    if (this.checkValidity()) {
        const toast = document.getElementById('toast');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
        this.reset();
        this.classList.remove('was-validated');
    }
});


document.getElementById('yr').textContent = new Date().getFullYear();
renderDiary();
renderGallery();
setTimeout(observeReveals, 100);
