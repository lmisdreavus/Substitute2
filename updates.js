// updates.js
// 글로벌 업데이트 내역 모달을 생성하고 관리하는 스크립트입니다.

document.addEventListener('DOMContentLoaded', () => {
    // 1. 공통 모달 HTML 구조 정의 (Bootstrap 기반, style.css 다크모드 호환 보장)
    const modalHTML = `
    <div class="modal fade" id="globalUpdateModal" tabindex="-1" role="dialog" aria-labelledby="globalUpdateModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" role="document">
            <div class="modal-content border-0" style="border-radius: 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.2);">
                <div class="modal-header border-bottom-0 pb-0">
                    <h5 class="modal-title font-weight-bold" id="globalUpdateModalLabel" style="color: var(--primary-color);">
                        <i class="fas fa-history mr-2"></i>업데이트 내역
                    </h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body pt-4">
                    <!-- 최신 업데이트: 2026년 3월 1일 -->
                    <div class="update-card p-3 mb-3" style="border: 1px solid #f1f3f5; border-radius: 12px; background-color: rgba(106, 44, 145, 0.03); border-color: var(--primary-color);">
                        <div class="font-weight-bold mb-2" style="color: var(--primary-color); font-size: 1.1em;">2026년 3월 1일</div>
                        <ul class="mb-0 pl-3" style="color: #555;">
                            <li>전체 사이트 모던 디자인(Card UI, Pretendard 폰트) 및 테마 전면 리뉴얼</li>
                            <li><strong>종족값 총합(BST) 표시</strong> 기능 추가</li>
                            <li><strong>다크 모드</strong> 토글 기능 추가</li>
                            <li>실능계산기 입력 시 <strong>실시간 계산</strong></li>
                            <li>기술 검색기 렌더링 <strong> 및 캐싱 최적화</strong> (검색 렉 해결)</li>
                            <li>검색창 <strong>자동완성 UX 고급화</strong> 및 반응형 인터랙션 추가</li>
                            <li>모든 페이지 하단에 글로벌 <strong>업데이트 내역 모달 팝업버튼</strong> 추가</li>
                            <li>7세대 도감 추가</li>
                        </ul>
                    </div>

                    <!-- 2024년 5월 13일 -->
                    <div class="update-card p-3 mb-3" style="border: 1px solid #f1f3f5; border-radius: 12px;">
                        <div class="font-weight-bold mb-2" style="color: var(--primary-color); font-size: 1.1em;">2024년 5월 13일</div>
                        <ul class="mb-0 pl-3" style="color: #555;">
                            <li>실능계산기 버튼 추가 및 UI 조정</li>
                            <li>스피드표 삭제</li>
                        </ul>
                    </div>
                    
                    <!-- 2024년 5월 12일 -->
                    <div class="update-card p-3 mb-3" style="border: 1px solid #f1f3f5; border-radius: 12px;">
                        <div class="font-weight-bold mb-2" style="color: var(--primary-color); font-size: 1.1em;">2024년 5월 12일</div>
                        <ul class="mb-0 pl-3" style="color: #555;">
                            <li>기술 검색 페이지 개편 및 이미지 추가</li>
                            <li>포켓몬 이름 검색시 이미지 추가</li>
                        </ul>
                    </div>
                    
                    <!-- 2024년 5월 11일 -->
                    <div class="update-card p-3" style="border: 1px solid #f1f3f5; border-radius: 12px;">
                        <div class="font-weight-bold mb-2" style="color: var(--primary-color); font-size: 1.1em;">2024년 5월 11일</div>
                        <ul class="mb-0 pl-3" style="color: #555;">
                            <li>기술 검색바 정렬</li>
                            <li>업데이트 내역 카테고리 추가</li>
                            <li>도움말 추가(?버튼)</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer border-top-0 pt-0 justify-content-center">
                    <button type="button" class="btn btn-secondary rounded-pill px-4" data-dismiss="modal">닫기</button>
                </div>
            </div>
        </div>
    </div>
    `;

    // 2. 바디 최하단에 모달 HTML 삽입
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // 3. 글로벌 Footer를 찾아서 그 아래에 모달 트리거 버튼 추가
    const footers = document.querySelectorAll('footer .creator-info');
    if (footers.length > 0) {
        // 모든 페이지의 Footer 구조가 비슷하므로 첫 번째 발견된 묶음에 버튼을 삽입합니다.
        const footerInfo = footers[0];

        const triggerHtml = `
            <div class="mt-3">
                <button type="button" class="btn btn-sm btn-outline-secondary rounded-pill shadow-sm px-3" data-toggle="modal" data-target="#globalUpdateModal" style="font-weight: 500;">
                    <i class="fas fa-scroll mr-1"></i> 사이트 업데이트 내역
                </button>
            </div>
        `;

        // creator info 텍스트 박스 바로 밑에 버튼을 매달아줍니다.
        footerInfo.insertAdjacentHTML('afterend', triggerHtml);
    }

    // 4. 다크모드 대응 로직을 위한 동적 스타일 연동
    // style.css의 body.dark-mode 규칙이 .update-card와 모달 배경색을 자동 제어하도록 CSS 클래스를 활용했습니다.
    // 인라인 스타일로 지정된 #555 텍스트 등은 다크모드일때 강제 오버라이딩 될 수 있도록 
    // css에 !important 속성 처리를 활용하거나 var(--text-main)을 가져가도록 권장됩니다.
});
