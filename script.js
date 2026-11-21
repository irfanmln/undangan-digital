/**
 * Undangan Pernikahan Alni & Raka
 * Interactive JavaScript Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Parse guest name from URL parameter ?to=...
  const urlParams = new URLSearchParams(window.location.search);
  let guestName = urlParams.get('to');

  function formatGuestName(name) {
    if (!name) return 'Ocha Geniarsyah';
    return name
      .replace(/\+/g, ' ')
      .trim()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ');
  }

  const formattedGuest = formatGuestName(guestName);

  // Inject into DOM
  const recipientDisplays = document.querySelectorAll('.dynamic-guest-name');
  recipientDisplays.forEach(el => {
    el.textContent = formattedGuest;
  });

  // 2. Generate QR Code for guest check-in
  const qrTarget = document.getElementById('qrcode');
  if (qrTarget && typeof QRCode !== 'undefined') {
    new QRCode(qrTarget, {
      text: formattedGuest,
      width: 140,
      height: 140,
      colorDark: '#333333',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
  }

  // 3. Audio Player & Floating Controller
  const audio = document.getElementById('bg-music');
  const musicToggle = document.getElementById('music-toggle');
  let isPlaying = false;

  function playAudio() {
    if (!audio) return;
    audio.play().then(() => {
      isPlaying = true;
      musicToggle.classList.add('playing');
    }).catch(err => {
      console.log('Autoplay prevented:', err);
    });
  }

  function toggleAudio() {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
      musicToggle.classList.remove('playing');
    } else {
      audio.play().then(() => {
        isPlaying = true;
        musicToggle.classList.add('playing');
      });
    }
  }

  if (musicToggle) {
    musicToggle.addEventListener('click', toggleAudio);
  }

  // 4. "Buka Undangan" Cover Unlock
  const btnOpen = document.getElementById('btn-open-invitation');
  const coverScreen = document.getElementById('cover');

  if (btnOpen && coverScreen) {
    btnOpen.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.remove('locked');
      coverScreen.classList.add('unlocked');
      playAudio();

      const homeSection = document.getElementById('home');
      if (homeSection) {
        homeSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // 5. Digital Gift ATM Card Toggle
  const btnToggleGift = document.getElementById('btn-toggle-gift');
  const bankCardWrap = document.getElementById('bank-card-wrap');

  if (btnToggleGift && bankCardWrap) {
    btnToggleGift.addEventListener('click', () => {
      bankCardWrap.classList.toggle('visible');
      if (bankCardWrap.classList.contains('visible')) {
        btnToggleGift.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  // 6. Copy Account Number with Toast Notification
  const btnCopyAcc = document.getElementById('btn-copy-acc');
  const toastNotice = document.getElementById('toast-notice');

  if (btnCopyAcc && toastNotice) {
    btnCopyAcc.addEventListener('click', () => {
      const accNumber = btnCopyAcc.getAttribute('data-copy') || '4372303623';
      navigator.clipboard.writeText(accNumber).then(() => {
        showToast('Nomor rekening berhasil disalin!');
      }).catch(() => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = accNumber;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Nomor rekening berhasil disalin!');
      });
    });
  }

  function showToast(message) {
    if (!toastNotice) return;
    toastNotice.textContent = message;
    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 2500);
  }

  // 7. Lightbox Gallery
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentImgIndex = 0;
  const imageSources = Array.from(galleryItems).map(item => item.getAttribute('data-full') || item.querySelector('img').src);

  function openLightbox(index) {
    currentImgIndex = index;
    updateLightbox();
    lightboxModal.classList.add('active');
  }

  function closeLightbox() {
    lightboxModal.classList.remove('active');
  }

  function updateLightbox() {
    lightboxImg.src = imageSources[currentImgIndex];
    lightboxCounter.textContent = `${currentImgIndex + 1} / ${imageSources.length}`;
  }

  function prevImage() {
    currentImgIndex = (currentImgIndex - 1 + imageSources.length) % imageSources.length;
    updateLightbox();
  }

  function nextImage() {
    currentImgIndex = (currentImgIndex + 1) % imageSources.length;
    updateLightbox();
  }

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);
  if (lightboxNext) lightboxNext.addEventListener('click', nextImage);

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (!lightboxModal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
  });

  // 8. Wishes & RSVP Management
  const initialComments = [
    { author: 'MAMAH GENDHIS', content: 'Selamat menempuh hidup baru, bahagia dan sehat selalu dimanapun kamu berada nanti nak', date: '2025-11-22T17:19:11', status: 'Hadir' },
    { author: 'Mamah sani', content: 'Alhamdulillah wilujeng neng Alin ngiring bingah samawa kangge neng Alin sareng a Raka🤲', date: '2025-11-21T14:57:58', status: 'Hadir' },
    { author: 'Vicky', content: 'Happy wedding alin,raka maaf gabisa dateng aku kan dibali, ditunggu aja kalo ada waktu main yaa', date: '2025-11-21T02:06:19', status: 'Tidak Hadir' },
    { author: 'Acha', content: 'Selamat menempuh hidup baru yaaa 👏👏', date: '2025-11-20T16:47:04', status: 'Hadir' },
    { author: 'Vegy', content: 'Alhamdulillah… Selamat menempuh hidup baru beb, semoga jd keluarga yg sakinah mawadah warohmah aamiin', date: '2025-11-20T16:25:38', status: 'Hadir' },
    { author: 'Nia Chikal', content: 'Samawa ya buat kedua mempelai Barakallahu fiikum 🤲', date: '2025-11-20T14:15:29', status: 'Hadir' },
    { author: 'cips', content: 'Congrats Alinn 🥰 langgeng sampe kake nenekkk ❤️', date: '2025-11-17T09:43:56', status: 'Hadir' },
    { author: 'mus', content: 'selamat menempuh hidup baru alni semoga sakinah mawadah warohmah lancar seterusnya', date: '2025-11-17T07:59:14', status: 'Hadir' },
    { author: 'Rizky & Nurul', content: 'Barakallah alni dan raka, lancar² seterusnya, menjadi keluarga yg sakinah mawadah warahmah 🤲🏻', date: '2025-11-15T11:51:50', status: 'Hadir' },
    { author: 'Ai latifah', content: 'Selamat menempuh hidup baru, Allah SWT selalu merahmati dan memberkahi setiap langkah rumah tangga kalian. Aamiin yaa rabbalalamiin', date: '2025-11-14T05:08:31', status: 'Hadir' },
    { author: 'Tini Achmad', content: 'Barakallah semoga SAMAWA, Hanya doa restu yang abadi yang kami haturkan buat kedua mempelai.', date: '2025-11-14T04:57:16', status: 'Hadir' },
    { author: 'Hj E , masitoh', content: 'Semoga menjadi keluarga sakinah , mawadah , warrohmah', date: '2025-11-14T03:56:34', status: 'Hadir' },
    { author: 'Hj E , masitoh', content: 'Happy weding buat Alni & RAKA Semoga samawa', date: '2025-11-14T03:55:26', status: 'Hadir' },
    { author: 'Kentirrr', content: 'Si kentirrr shiawasee youdesune', date: '2025-11-13T20:25:42', status: 'Tidak Hadir' },
    { author: 'Lintang', content: 'alhamdulillah, akhirnya next step dan nikah!!! 🥹♥️ seneng banget!! semoga pernikahannya selalu dilingkupi kebahagiaan dan keberkahan ya alni raka!', date: '2025-11-12T16:21:07', status: 'Tidak Hadir' },
    { author: 'Rifa', content: 'Selamat berbahagia dan menempuh fase kehidupan yang baru sayangkuu, semoga senantiasa saling mencintai dan dilimpahkan kebahagiaan!', date: '2025-11-12T11:44:26', status: 'Hadir' },
    { author: 'Dea', content: 'Akhirnya yaaa setelah sekian lamaa… Sekarang tinggal menghitung hari menuju halal, lancar sampai hari H yaa!', date: '2025-11-11T15:55:10', status: 'Tidak Hadir' },
    { author: 'Azkho', content: 'Alhamdulilah setelah 20 thn ldr 🤪 happy for you both 😘', date: '2025-11-11T14:28:29', status: 'Tidak Hadir' },
    { author: 'Teh Ayu', content: 'Masya Allooh Alni dan Raka, lancar sampai hari H yaa. Semoga ini menjadi pernikahan yang penuh berkah', date: '2025-11-11T13:09:36', status: 'Hadir' },
    { author: 'Erina Azzahra', content: 'Maa Syaa Allah akhirnya LDR dari zaman kuliah menuju pelaminan jga 🤍 Selamat Alni & Raka!', date: '2025-11-11T12:27:26', status: 'Tidak Hadir' },
    { author: 'Sani cantik', content: 'MasyaAllah nangis bahagia, akhirnya cabattt akuu nikaaaah🥺 bahagia selalu sayaaang', date: '2025-11-11T12:22:56', status: 'Hadir' },
    { author: 'Monita', content: 'Masya Allah tabarakallah ya akhirnya, bahagia selalu 😘', date: '2025-11-11T10:37:15', status: 'Hadir' },
    { author: 'Pipit cute', content: 'Akhirnyaa u nikah🤭 selamat ea semoga bahagia terus.. haha ga nyangka akhirnya berlabuh juga di pelaminan', date: '2025-11-11T10:11:52', status: 'Masih Ragu' }
  ];

  // Retrieve stored comments from localStorage or use initial
  const storedCustom = JSON.parse(localStorage.getItem('alni_raka_custom_wishes') || '[]');
  const allComments = [...storedCustom, ...initialComments];

  const itemsPerPage = 10;
  let currentPage = 1;

  function renderRSVPStats() {
    let hadir = 0, tidakHadir = 0, ragu = 0;
    allComments.forEach(c => {
      if (c.status === 'Hadir') hadir++;
      else if (c.status === 'Tidak Hadir') tidakHadir++;
      else ragu++;
    });

    document.getElementById('stat-hadir').textContent = hadir;
    document.getElementById('stat-tidak-hadir').textContent = tidakHadir;
    document.getElementById('stat-ragu').textContent = ragu;
    document.getElementById('total-comments-label').textContent = `${allComments.length} Comments`;
  }

  function formatTimeAgo(dateString) {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'Baru saja';
    const now = new Date();
    const diffDays = Math.floor((now - d) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Hari ini';
    if (diffDays === 1) return '1 hari yang lalu';
    if (diffDays < 30) return `${diffDays} hari yang lalu`;
    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} bulan yang lalu`;
  }

  function renderComments(page = 1) {
    currentPage = page;
    const feed = document.getElementById('comments-feed');
    feed.innerHTML = '';

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = allComments.slice(start, end);

    pageItems.forEach(c => {
      const card = document.createElement('div');
      card.className = 'comment-card';

      let statusBadgeClass = 'comment-status-badge';
      if (c.status === 'Tidak Hadir') statusBadgeClass += ' tidak-hadir';
      else if (c.status === 'Masih Ragu') statusBadgeClass += ' ragu';

      card.innerHTML = `
        <div class="comment-header">
          <div class="comment-author">
            ${escapeHtml(c.author)}
            <svg class="verified-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          </div>
          <span class="${statusBadgeClass}">${c.status}</span>
        </div>
        <div class="comment-body">${escapeHtml(c.content)}</div>
        <div class="comment-time">${formatTimeAgo(c.date)}</div>
      `;
      feed.appendChild(card);
    });

    renderPagination();
  }

  function renderPagination() {
    const container = document.getElementById('pagination-wrap');
    container.innerHTML = '';
    const totalPages = Math.ceil(allComments.length / itemsPerPage);
    if (totalPages <= 1) return;

    if (currentPage > 1) {
      const prevBtn = document.createElement('button');
      prevBtn.className = 'page-btn';
      prevBtn.textContent = '← Prev';
      prevBtn.onclick = () => renderComments(currentPage - 1);
      container.appendChild(prevBtn);
    }

    for (let i = 1; i <= totalPages; i++) {
      const pBtn = document.createElement('button');
      pBtn.className = `page-btn ${i === currentPage ? 'active' : ''}`;
      pBtn.textContent = i;
      pBtn.onclick = () => renderComments(i);
      container.appendChild(pBtn);
    }

    if (currentPage < totalPages) {
      const nextBtn = document.createElement('button');
      nextBtn.className = 'page-btn';
      nextBtn.textContent = 'Next →';
      nextBtn.onclick = () => renderComments(currentPage + 1);
      container.appendChild(nextBtn);
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.innerText = str;
    return div.innerHTML;
  }

  // Handle Form Submission
  const wishForm = document.getElementById('wish-form');
  if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('wish-name');
      const msgInput = document.getElementById('wish-message');
      const rsvpSelect = document.getElementById('wish-rsvp');

      const name = nameInput.value.trim();
      const message = msgInput.value.trim();
      const status = rsvpSelect.value;

      if (!name || !message) {
        showToast('Mohon lengkapi nama dan ucapan Anda.');
        return;
      }

      const newWish = {
        author: name,
        content: message,
        status: status,
        date: new Date().toISOString()
      };

      storedCustom.unshift(newWish);
      localStorage.setItem('alni_raka_custom_wishes', JSON.stringify(storedCustom));
      allComments.unshift(newWish);

      renderRSVPStats();
      renderComments(1);

      wishForm.reset();
      showToast('Terima kasih atas doa dan ucapannya!');
    });
  }

  // Initial render
  renderRSVPStats();
  renderComments(1);

  // 9. Intersection Observer for Smooth Scroll Reveal
  const revealElements = document.querySelectorAll('.fade-in-scroll');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => observer.observe(el));
});
