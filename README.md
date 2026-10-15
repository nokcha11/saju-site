# 사주사이트 (Saju Site)

## 프로젝트 소개

사주 원국과 오행, 신강·신약, 신살, 대운·세운·월운·일운 등의 정보를
제공하는 웹 프로젝트입니다. HTML, CSS, JavaScript를 사용하며, 계산
로직과 해석 데이터, 화면 출력을 기능별로 분리해 관리합니다.

## 폴더 구조

``` text
saju-site/
├── main.html
├── README.md
├── css/
│   ├── base.css
│   ├── style.css
│   ├── theme.css
│   ├── layout.css
│   ├── responsive.css
│   ├── site-header.css
│   ├── form.css
│   ├── date-controls.css
│   ├── result.css
│   ├── result-compact.css
│   ├── saju-summary.css
│   ├── pillar-detail.css
│   ├── pillar-patterns.css
│   ├── five-elements.css
│   ├── strength.css
│   ├── useful-god.css
│   ├── relations.css
│   ├── relation-diagram.css
│   ├── sinsal.css
│   ├── sinsal-detail.css
│   ├── fortune-cycle.css
│   ├── annual-fortune.css
│   ├── monthly-fortune.css
│   ├── daily-fortune.css
│   ├── summary-detail-modal.css
│   ├── floating-menus.css
│   └── ...
└── js/
    ├── calculators/
    ├── data/
    ├── effects/
    ├── form/
    ├── interpreters/
    ├── lib/
    ├── ui/
    └── main.js
```

## 파일별 기능

### 최상위 파일

  -----------------------------------------------------------------------
  파일                                기능
  ----------------------------------- -----------------------------------
  `main.html`                         웹페이지의 기본 구조를 정의하고 CSS
                                      및 JavaScript를 연결합니다.

  `README.md`                         프로젝트 소개, 폴더 구조 및 파일별
                                      기능을 설명합니다.
  -----------------------------------------------------------------------

### CSS 파일

  파일                           기능
  ------------------------------ ----------------------------------------
  `base.css`                     기본 스타일 및 공통 요소 초기화
  `style.css`                    주요 스타일 정의 및 스타일 구성의 중심
  `theme.css`                    색상, 배경 등 테마
  `layout.css`                   페이지 레이아웃 및 영역 배치
  `responsive.css`               모바일·태블릿·PC 반응형 화면
  `site-header.css`              사이트 상단 헤더
  `form.css`                     입력 폼과 버튼 디자인
  `date-controls.css`            날짜 선택 컨트롤
  `form-native-icons.css`        기본 입력 컨트롤 아이콘 관련 스타일
  `result.css`                   분석 결과 기본 레이아웃
  `result-compact.css`           분석 결과의 간결한 표시
  `saju-summary.css`             사주 요약 영역
  `pillar-detail.css`            사주 기둥 상세 정보
  `pillar-patterns.css`          원국 패턴 분석 표시
  `five-elements.css`            오행 분석 화면
  `strength.css`                 신강·신약 분석 화면
  `useful-god.css`               용신 관련 화면
  `relations.css`                합·충·형·파·해 등 관계 분석
  `relation-diagram.css`         사주 기둥 관계 도식
  `sinsal.css`                   신살 목록
  `sinsal-detail.css`            신살 상세 설명
  `fortune-cycle.css`            대운 등 운의 흐름
  `annual-fortune.css`           세운 화면
  `monthly-fortune.css`          월운 화면
  `daily-fortune.css`            일운·오늘의 운세 화면
  `summary-detail-modal.css`     요약 상세 모달
  `floating-menus.css`           플로팅 메뉴 디자인
  `element-balance-detail.css`   오행 균형 상세 정보
  `glass.css`                    반투명 유리 효과
  `particle.css`                 파티클 효과 스타일
  `final-ui-tweaks.css`          UI의 최종 보정 스타일

### JavaScript 파일 및 폴더

  -----------------------------------------------------------------------
  파일/폴더                           기능
  ----------------------------------- -----------------------------------
  `js/main.js`                        주요 기능 초기화 및 모듈 연결

  `js/calculators/`                   원국, 십신, 오행, 관계, 신강·신약,
                                      신살, 대운·세운·월운·일운 등의 계산

  `js/data/`                          천간·지지 데이터, 판정 규칙, 신살
                                      및 기타 해석 문구

  `js/effects/`                       파티클 등 장식용 시각효과

  `js/form/`                          생년월일 입력 및 날짜 선택 처리

  `js/interpreters/`                  계산 결과를 종합해 사람이 읽기 쉬운
                                      해석으로 구성

  `js/lib/`                           만세력 라이브러리 연결 또는 관련
                                      기능

  `js/ui/`                            결과 렌더링, 상세 모달, 관계도,
                                      플로팅 메뉴
  -----------------------------------------------------------------------

### 주요 계산 파일

  파일                                   기능
  -------------------------------------- -----------------------------------------
  `calculators/pillars.js`               년주·월주·일주·시주 관련 계산
  `calculators/hiddenStems.js`           지장간 관련 계산 및 정보 처리
  `calculators/tenGods.js`               십신·십성 관계 계산
  `calculators/fiveElements.js`          오행 구성 및 분포 계산
  `calculators/relations.js`             천간·지지의 합·충·형·파·해 등 관계 계산
  `calculators/strengthCalculator.js`    신강·신약 판정 관련 계산
  `calculators/usefulGodCalculator.js`   용신 관련 판정
  `calculators/sinsal.js`                신살 관련 계산
  `calculators/twelveSinsal.js`          12신살 계산
  `calculators/twelveStages.js`          십이운성 계산
  `calculators/gongmang.js`              공망 계산
  `calculators/pillarPatterns.js`        원국 구조와 패턴 분석
  `calculators/fortuneCycle.js`          대운 흐름 계산
  `calculators/annualFortune.js`         세운 계산
  `calculators/monthlyFortune.js`        월운 계산
  `calculators/dailyFortune.js`          일운 계산
  `calculators/educationFortune.js`      학업·교육 관련 운세 계산
  `calculators/lottoNumbers.js`          로또 번호 관련 기능 계산

### 주요 데이터 파일

  파일                                 기능
  ------------------------------------ ------------------------------------
  `data/stems.js`                      천간 데이터
  `data/branches.js`                   지지 데이터
  `data/rules.js`                      공통 판정 규칙
  `data/sinsalRules.js`                신살 판정 규칙
  `data/sinsalDescriptions.js`         신살 해석 문구
  `data/twelveSinsalDescriptions.js`   12신살 해석 문구
  `data/pillarDescriptions.js`         원국 기둥 해석 자료
  `data/summaryDescriptions.js`        사주 요약 설명 자료
  `data/strengthDescriptions.js`       신강·신약 설명 자료
  `data/elementBalanceGuide.js`        오행 균형 해석 자료
  `data/directReadingRules.js`         직접 해석 관련 규칙
  `data/lifeDomainRules.js`            재물·직업·관계 등 생활 영역별 규칙
  `data/dailyFortuneGuide.js`          일운 해석 가이드
  `data/dayAnimalCareer.js`            일주·동물 분류 및 직업 관련 자료
  `data/locations.js`                  위치·방향 등 관련 참조 데이터

### 주요 해석 파일

  파일                                      기능
  ----------------------------------------- ------------------------------------
  `interpreters/chartContext.js`            원국 및 분석 결과의 공통 맥락 구성
  `interpreters/directReading.js`           직접적인 사주 해석 문장 생성
  `interpreters/pillarReading.js`           원국 기둥별 해석
  `interpreters/relationReading.js`         관계 분석 해석
  `interpreters/sinsalReading.js`           신살 해석
  `interpreters/patternReading.js`          원국 구조 및 패턴 해석
  `interpreters/overallReading.js`          사주 전반의 종합 해석
  `interpreters/wealthReading.js`           재물 관련 해석
  `interpreters/natalFortuneHighlight.js`   원국의 주요 특징 추출
  `interpreters/fortuneScore.js`            운세 점수 관련 처리
  `interpreters/dailyFortune.js`            일운 해석 구성
  `interpreters/dailyDirectReading.js`      오늘의 운세 문장 구성
  `interpreters/dailyScore.js`              일운 점수 관련 처리
  `interpreters/dailyExtraDomains.js`       일운의 추가 생활 영역 구성

### 주요 UI 파일

  파일                                 기능
  ------------------------------------ -------------------------------
  `ui/renderPillars.js`                사주 원국 표시
  `ui/renderSajuSummary.js`            사주 요약 표시
  `ui/renderFiveElements.js`           오행 분석 표시
  `ui/renderStrength.js`               신강·신약 결과 표시
  `ui/renderUsefulGod.js`              용신 관련 결과 표시
  `ui/renderRelations.js`              관계 분석 결과 표시
  `ui/relationDiagram.js`              관계 도식 표시
  `ui/renderSinsal.js`                 신살 목록 표시
  `ui/sinsalDetail.js`                 신살 상세 정보 표시
  `ui/renderNatalFortuneSections.js`   원국 기반 운세 섹션 표시
  `ui/renderFortuneCycle.js`           대운 등 운의 흐름 표시
  `ui/renderAnnualFortune.js`          세운 표시
  `ui/renderMonthlyFortune.js`         월운 표시
  `ui/renderDailyFortune.js`           일운 표시
  `ui/dailyFortunePage.js`             오늘의 운세 페이지 관련 처리
  `ui/elementBalanceDetail.js`         오행 균형 상세 정보 표시
  `ui/pillarDetailModal.js`            원국 기둥 상세 모달
  `ui/relationDetailModal.js`          관계 상세 모달
  `ui/patternDetailModal.js`           원국 패턴 상세 모달
  `ui/summaryDetailModal.js`           요약 상세 모달
  `ui/siteHeader.js`                   사이트 헤더 관련 기능
  `ui/floatingMenus.js`                플로팅 메뉴 이벤트 및 동작
  `ui/floatingMenuDialog.js`           플로팅 메뉴 대화상자·패널
  `ui/floatingSafePosition.js`         플로팅 메뉴 위치 및 겹침 방지

### 기타 JavaScript 파일

  파일                            기능
  ------------------------------- ---------------------------------------
  `form/birthForm.js`             생년월일 등 입력값 처리
  `form/dateControls.js`          날짜 선택 컨트롤 처리
  `form/enhancedBirthPicker.js`   개선된 생년월일 선택 UI
  `lib/manseryeok.js`             만세력 관련 라이브러리 연결 또는 기능
  `effects/particles.js`          파티클 애니메이션 등 시각효과

> 파일 설명은 파일명과 일반적인 역할을 바탕으로 정리했습니다. 실제 세부
> 동작은 각 파일의 코드 구현에 따라 다를 수 있습니다.
