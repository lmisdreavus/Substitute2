// router.js

// 네비게이션 햄버거 메뉴 토글 로직 (Bootstrap JS 완전 배제)
document.addEventListener('click', function (e) {
    if (e.target.closest('#mobileMenuToggler')) {
        const menu = document.getElementById('navbarNav');
        if (menu) {
            menu.classList.toggle('open');
            // 선택 사항: 토글러 아이콘 상태 변경용
            const toggler = document.getElementById('mobileMenuToggler');
            if (toggler) {
                toggler.classList.toggle('collapsed');
            }
        }
    }
});

function handleRoute() {
    // 라우팅 발생 시 무조건 네비게이션 강제 닫기
    const menu = document.getElementById('navbarNav');
    if (menu) {
        menu.classList.remove('open');
        const toggler = document.getElementById('mobileMenuToggler');
        if (toggler) toggler.classList.add('collapsed');
    }

    const hash = window.location.hash;
    const path = hash ? hash.replace('#', '') : 'sv';

    // 모든 페이지 섹션 비활성화
    document.querySelectorAll('.spa-page').forEach(page => {
        page.classList.remove('active');
    });

    // 모든 페이지 섹션 비활성화액티브 제거
    document.querySelectorAll('.nav-spa').forEach(nav => {
        nav.parentElement.classList.remove('active');
        nav.classList.remove('active');
    });

    // URL Hash에 일치하는 페이지 활성화
    const activePage = document.querySelector(`#page-${hash.substring(1)}`);
    if (activePage) {
        activePage.classList.add('active');
    } else {
        // 일치하는 해시가 없으면 기본값(sv) 활성화
        const defaultPage = document.querySelector('#page-sv');
        if (defaultPage) defaultPage.classList.add('active');
        // hash = '#sv'; // 재할당 불가(가비지 콜렉션 이슈 방지 변경)
    }

    // 일치하는 네비게이션 버튼 강조
    const activeNav = document.querySelector(`#nav-${hash.substring(1)}`);
    if (activeNav) {
        activeNav.classList.add('active');
        activeNav.parentElement.classList.add('active');
    }

    // 페이지 이동 시 최상단 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('hashchange', handleRoute);

// 초기 로딩 시 한 번 강제 실행하여 현재 Hash에 맞는 페이지 렌더링
window.addEventListener('DOMContentLoaded', () => {
    window.dispatchEvent(new Event('hashchange'));

    // --- Scroll To Top 버튼 로직 ---
    const scrollToTopBtn = document.getElementById('scrollToTopBtn');

    if (scrollToTopBtn) {
        // 스크롤 감지하여 버튼 표시/숨김
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollToTopBtn.classList.add('show-btn');
            } else {
                scrollToTopBtn.classList.remove('show-btn');
            }
        });

        // 클릭 시 맨 위로 부드럽게 스크롤
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
