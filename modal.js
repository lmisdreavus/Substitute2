$(document).ready(function() {
    // 모달 창 생성 및 추가
    var modalHtml = `
      <div class="modal fade" id="helpModal" tabindex="-1" role="dialog" aria-labelledby="helpModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="helpModalLabel">사용 방법</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p>이 웹 사이트는 포켓몬의 기술폭을 검색할 수 있습니다.</p>
              <p>검색창에 포켓몬 이름을 입력하고 '검색' 버튼을 클릭하면 해당 포켓몬의 기술폭 정보를 확인할 수 있습니다.</p>
              <p>자세한 사용 방법은 아래 링크를 참고해 주세요.</p>
              <a href="#" target="_blank">사용 방법 가이드</a>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">닫기</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // 모달 창 HTML 코드를 body에 추가
    $('body').append(modalHtml);

    // 모달 창 열기 이벤트 바인딩
    $('#helpModal').on('shown.bs.modal', function() {
      // 모달 창이 열렸을 때 실행할 코드
    });
});