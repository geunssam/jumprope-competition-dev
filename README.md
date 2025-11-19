# JumpRope Master v20 (개발용)

초등학교 줄넘기 연습 및 대회 관리 시스템

---

## 🎯 프로젝트 개요

**목적**: 초등학교 수업에서 활용할 수 있는 줄넘기 연습 기록 및 대회 진행 관리 시스템

**참고 아키텍처**: baseball-firebase 프로젝트
**개발 방식**: 10-Phase 점진적 개발

---

## 💻 기술 스택

- **Frontend**: React 19 + Vite + TypeScript
- **Backend**: Firebase (Auth + Firestore)
- **UI**: Tailwind CSS + shadcn/ui
- **Charts**: Chart.js / Recharts
- **Deployment**: Netlify

---

## 🚀 개발 환경 설정

### 필수 요구사항
- Node.js 20+
- npm 또는 yarn
- Firebase 계정

### 초기 설정
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

### 환경 변수
`.env.local` 파일 생성:
```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 📅 개발 로드맵

### 10-Phase 개발 계획

```
Phase 1:  프로젝트 초기화         (1일)   [ ] 0%
Phase 2:  Firebase 설정 + 인증    (2일)   [ ] 0%
Phase 3:  Tailwind + shadcn/ui    (1일)   [ ] 0%
Phase 4:  Service + Context       (2일)   [ ] 0%
Phase 5:  학급/학생 관리 UI       (3일)   [ ] 0%
Phase 6:  종목/세션 관리          (2일)   [ ] 0%
Phase 7:  기록 시스템 (타이머)    (4일)   [ ] 0%  ⭐ 핵심!
Phase 8:  배지 시스템             (3일)   [ ] 0%
Phase 9:  통계 & 차트             (3일)   [ ] 0%
Phase 10: 학생 뷰 + 배포          (2일)   [ ] 0%
```

자세한 계획은 `CLAUDE.md` 참조

---

## 📁 프로젝트 구조

```
jumprope-competition-dev/
├── src/
│   ├── components/         # React 컴포넌트
│   ├── contexts/           # Context API (AuthContext, RecordContext)
│   ├── services/           # Firebase 서비스
│   ├── utils/              # 유틸리티 함수
│   ├── lib/                # shadcn/ui 라이브러리
│   └── App.jsx             # 메인 앱
├── public/                 # 정적 파일
├── docs/                   # 개발 문서
├── .env.local              # 환경 변수 (gitignore)
├── vite.config.js          # Vite 설정
├── tailwind.config.js      # Tailwind 설정
├── CLAUDE.md               # Claude Code 지침
└── README.md               # 이 파일
```

---

## 🤝 개발 진행 상황

현재 진행: **Phase 0 - 레포지토리 설정**

[docs/DEVELOPMENT.md](./docs/DEVELOPMENT.md)에서 상세 진행 상황 확인

---

## 📝 라이선스

교육용 프로젝트입니다.

---

**개발**: 초등교사 개발자 이원근
**버전**: v20 (개발 중)
**시작일**: 2025-01-18
**레포지토리**: [jumprope-competition-dev](https://github.com/geunssam/jumprope-competition-dev)
