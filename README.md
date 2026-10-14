# PET

One app for everything your pet needs.

강아지와 고양이를 위한 글로벌 반려동물 앱입니다. 현재 **Phase 1.0: Foundation & Design System** 구현이 들어 있습니다. 앱 이름은 기획의 작업명 PET를 사용합니다.

## 시작하기

Node.js 22.14 이상과 pnpm 11.25.0이 필요합니다.

```sh
pnpm install --frozen-lockfile
pnpm start
```

Expo Go에서 SDK 57 지원 버전으로 열거나 `pnpm ios`, `pnpm android`를 사용하세요. 시뮬레이터 실행에는 Xcode, Android 실행에는 Android SDK와 에뮬레이터 또는 연결된 기기가 필요합니다. `pnpm web`으로 브라우저에서 확인할 수도 있습니다.

## 이번 단계에서 작동하는 것

- Home · Care · Explore · Shop · Pets의 5개 탭, 탭별 스택과 뒤로 가기.
- 공통 버튼, 입력, 카드, 목록, 배지, 선택 컨트롤, 하단 시트, 확인창, 반려동물 선택기.
- 라이트·다크·시스템 테마와 한국어·영어 전환.
- 언어·테마·단위·앱 지역·배송 국가·마지막 탭의 기기 내 저장과 복원.
- 로딩·빈 화면·오류·오프라인·권한 제한 상태, 오류 시 재시도.
- 날짜·단위·통화 포맷과 후속 기능을 위한 공통 타입 계약.

설정 → 디자인 시스템에서 공통 컴포넌트와 화면 상태를 직접 확인할 수 있습니다. 예시 입력은 미리보기이며 반려동물 기록으로 저장되지 않습니다.

반려동물이 없는 실제 초기 상태로 시작합니다. **인증, 프로필 CRUD, 돌봄 기록, 일정·알림, 지도·장소, 상품·가격 데이터는 아직 연결되지 않았습니다.** 가짜 반려동물·장소·가격을 실제 데이터처럼 표시하지 않습니다. 외부 서비스 계정이나 API 키 없이 이번 단계가 실행됩니다.

## 검증

```sh
pnpm check                     # 타입, 린트, 테스트
pnpm exec expo install --check # Expo 호환성
pnpm peers check               # 의존성 충돌
pnpm export:all                # iOS, Android, 웹 번들
```

GitHub Actions에서 의존성 설치, 타입·린트·테스트, Expo 호환성, 세 플랫폼 번들을 검사합니다. 네이티브 기기 실행은 번들 검사와 별개입니다. 실행 결과와 남은 검증 항목은 [Phase 1.0 기록](docs/PHASE_1_0.md)을 보세요.

## 구조

```text
src/app/          Expo Router 화면 진입과 내비게이션
src/features/     기능별 화면과 조합 컴포넌트
src/design/       공통 디자인 토큰과 UI
src/core/         설정·번역·포맷·공통 계약·권한 규칙
tests/            저장·권한·국제화·UI·설정 복원 검증
docs/             아키텍처와 단계별 구현 기록
```

구조와 후속 단계 연결 규칙은 [아키텍처](docs/ARCHITECTURE.md)에 정리했습니다. 다음 단계는 **Phase 1.1: 인증·계정·개인 Household·서버 권한 기반**입니다.
