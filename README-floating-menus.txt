입력 / 오늘의 운세 - 플로팅 메뉴 2개

[실행]
압축을 새 폴더에 풀고 saju-site-fixed/saju-site/main.html을 Live Server로 실행하세요.
이전 화면이 남으면 Ctrl + F5로 새로고침하세요.

[추가 기능]
1. 출생정보 입력: 오른쪽 아래 버튼을 누르면 입력창이 열립니다.
   기존 폼을 그대로 사용하며, 닫았다 다시 열어도 입력값을 유지합니다.
   계산이 성공하면 창을 닫고 요약 화면으로 이동합니다.
2. 오늘의 운세: 별도 창에서 기존 운세 내용을 봅니다.
   날짜 이동, 오늘 버튼, 로또 번호 다시 뽑기는 기존 로직에 연결됩니다.
   입력 전이면 입력 안내를 보여주고, 입력창으로 전환할 수 있습니다.
   이 경로로 사주를 계산하면 운세창을 다시 열어줍니다.

닫기: X / Esc / 창 밖 어두운 배경 클릭
모바일: 하단에 버튼 2개를 가로로 배치하고, 긴 내용은 창 안에서 스크롤합니다.
기존 상단 메뉴와 전체 페이지도 유지합니다.
값은 현재 페이지 안에서만 유지되며 새로고침 후 자동 복원은 추가하지 않았습니다.

[수정 파일]
main.html - 전용 CSS / JS 연결
js/main.js - 계산 성공 이벤트(saju:calculated)만 추가
css/floating-menus.css - 신규
js/ui/floatingMenus.js - 신규
js/ui/floatingMenuDialog.js - 신규

원국 해석창 강조, 원국 크기, 대운/세운/월운 1~3순위 테두리 및 점수,
관계 화면, 오늘의 운세 계산기/출력 파일은 수정하지 않았습니다.
외부 manseryeok 라이브러리 주소는 기존과 같아 인터넷 연결이 필요합니다.

[검증 범위]
화면 검증은 외부 라이브러리 대신 테스트 원국 데이터로 진행합니다.
계산 라이브러리의 천문·역법 정확성을 새로 검증한 것은 아닙니다.
테스트용 대체 라이브러리는 이 프로젝트에 포함되지 않습니다.

[2026-10-14 safe-zone update]
- Desktop/tablet: floating shortcuts automatically choose a nearby center-right position that minimizes overlap with visible text and controls.
- Preferred starting point remains around 62% / 27% of the viewport (the user-marked arrow area).
- Mobile: bottom space is reserved so shortcuts do not cover page text.
- Floating drift animation is preserved.

[추가] 운세 흐름 플로팅 메뉴
- 원국 / 대운 / 세운 / 월운 4개만 한 개의 글래스 캡슐 메뉴에 배치
- 각 버튼 클릭 시 해당 섹션으로 부드럽게 이동
- 아직 사주 계산 전이라 대상 섹션이 없으면 출생정보 입력창을 열어 안내
- 데스크톱에서는 현재 화면의 텍스트/컨트롤과 겹침이 가장 적은 safe-zone으로 자동 배치
- 모바일에서는 하단 전용 안전여백을 확보하고 기존 두 메뉴 위에 배치
