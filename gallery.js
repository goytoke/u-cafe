// Sidebar logic with fixed hamburger (top-left)
        const hamburger = document.getElementById('hamburgerMenu');
        const sidebar = document.getElementById('sidebarNav');
        const overlay = document.getElementById('sidebarOverlay');
        const closeSide = document.getElementById('closeSidebarBtn');

        function openSidebar() {
            sidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            hamburger.classList.add('active');
        }
        function closeSidebar() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            hamburger.classList.remove('active');
        }
        hamburger?.addEventListener('click', openSidebar);
        closeSide?.addEventListener('click', closeSidebar);
        overlay?.addEventListener('click', closeSidebar);
        document.querySelectorAll('.sidebar-nav a').forEach(link => {
            link.addEventListener('click', () => { setTimeout(closeSidebar, 150); });
        });

        // Filter, search and gallery functions (identical to original)
        const galleryItems = document.querySelectorAll('.gallery-item');
        const searchInput = document.getElementById('searchInput');
        const galleryTabs = document.querySelectorAll('.gallery-tab');
        const noResultsDiv = document.getElementById('noResults');
        function filterItems(category, searchTerm) {
            let visible = 0;
            galleryItems.forEach(item => {
                const catMatch = category === 'all' || item.dataset.category === category;
                const searchMatch = !searchTerm || item.dataset.name.includes(searchTerm) || item.dataset.ingredients.includes(searchTerm);
                if(catMatch && searchMatch) { item.style.display = 'flex'; visible++; } else { item.style.display = 'none'; }
            });
            if(noResultsDiv) noResultsDiv.style.display = visible === 0 ? 'block' : 'none';
        }
        function applyFilter() {
            const active = document.querySelector('.gallery-tab.active');
            const filter = active ? active.dataset.filter : 'all';
            filterItems(filter, searchInput.value.toLowerCase());
        }
        galleryTabs.forEach(tab => tab.addEventListener('click', () => {
            galleryTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            applyFilter();
        }));
        searchInput.addEventListener('input', applyFilter);
        window.filterByCategory = (cat) => {
            galleryTabs.forEach(t => { t.classList.remove('active'); if(t.dataset.filter === cat) t.classList.add('active'); });
            applyFilter();
            document.querySelector('.gallery-grid')?.scrollIntoView({ behavior: 'smooth' });
        };
        // Video & Detail modal functions (same as original)
        const videoModal = document.getElementById('videoModal'), videoFrame = document.getElementById('videoFrame'), videoTitle = document.getElementById('videoTitle');
        window.openVideoModal = (id, title) => { videoFrame.src = `https://www.youtube.com/embed/${id}?autoplay=1`; videoTitle.textContent = title; videoModal.classList.add('active'); document.body.style.overflow = 'hidden'; };
        window.closeVideoModal = () => { videoModal.classList.remove('active'); videoFrame.src = ''; document.body.style.overflow = ''; };
        let currentItem = null;
        window.openDetailModal = (item) => { currentItem = item; document.getElementById('detailImage').src = item.image; document.getElementById('detailName').innerText = item.name; document.getElementById('detailPrice').innerText = item.price; document.getElementById('detailDesc').innerText = item.short_desc; document.getElementById('detailIngredients').innerHTML = item.ingredients.map(ing => `<div class="detail-ingredient"><i class="fas fa-check-circle"></i><span>${ing}</span></div>`).join(''); document.getElementById('detailCalories').innerText = item.calories; document.getElementById('detailProtein').innerText = item.protein; document.getElementById('detailCarbs').innerText = item.carbs; document.getElementById('detailFat').innerText = item.fat; document.getElementById('detailModal').classList.add('active'); document.body.style.overflow = 'hidden'; };
        window.closeDetailModal = () => { document.getElementById('detailModal').classList.remove('active'); document.body.style.overflow = ''; };
        window.playDetailVideo = () => { if(currentItem) { closeDetailModal(); setTimeout(() => openVideoModal(currentItem.video_id, currentItem.video_title), 200); } };
        document.getElementById('videoModal')?.addEventListener('click', (e) => { if(e.target === videoModal) closeVideoModal(); });
        document.getElementById('detailModal')?.addEventListener('click', (e) => { if(e.target === document.getElementById('detailModal')) closeDetailModal(); });
        document.getElementById('year').innerText = new Date().getFullYear();
        applyFilter();