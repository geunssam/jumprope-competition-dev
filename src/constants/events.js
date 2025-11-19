/**
 * 줄넘기 종목 상수 정의
 *
 * 종목 카테고리:
 * - 개인전: 혼자서 뛰는 종목 (7개)
 * - 짝뛰기: 2명이 함께 뛰는 종목 (2개)
 * - 단체줄: 여러 명이 함께 뛰는 종목 (3개)
 * - 자유형: 창의적 구성 종목 (4개)
 */

// 종목 카테고리
export const EVENT_CATEGORIES = {
  INDIVIDUAL: 'individual',  // 개인전
  PAIR: 'pair',              // 짝줄넘기
  GROUP: 'group',            // 단체줄
};

// 종목 타입 (연습/대회 구분)
export const EVENT_TYPES = {
  PRACTICE: 'practice',      // 연습
  COMPETITION: 'competition' // 대회
};

// v19 프로젝트의 실제 종목 16개 (jumprope-competition/index.html 참조)
export const DEFAULT_EVENTS = [
  // ========================================
  // 개인전 (8개)
  // ========================================
  {
    id: 'individual_alternate',
    name: '번갈아뛰기',
    displayName: '번갈아뛰기 (30초)',
    category: EVENT_CATEGORIES.INDIVIDUAL,
    duration: 30,
    unit: '개',
    description: '양 발을 번갈아가며 뛰기',
    icon: '🔄',
    minParticipants: 1,
    maxParticipants: 5,
    isDefault: true
  },
  {
    id: 'individual_single_foot',
    name: '한발뛰기',
    displayName: '한발뛰기 (30초)',
    category: EVENT_CATEGORIES.INDIVIDUAL,
    duration: 30,
    unit: '개',
    description: '한 발로만 뛰기',
    icon: '🦵',
    minParticipants: 1,
    maxParticipants: 5,
    isDefault: true
  },
  {
    id: 'individual_backward',
    name: '뒤로뛰기',
    displayName: '뒤로뛰기 (30초)',
    category: EVENT_CATEGORIES.INDIVIDUAL,
    duration: 30,
    unit: '개',
    description: '줄을 뒤에서 앞으로 돌려 뛰기',
    icon: '⬅️',
    minParticipants: 1,
    maxParticipants: 5,
    isDefault: true
  },
  {
    id: 'individual_forward_single',
    name: '앞으로1단넘기',
    displayName: '앞으로1단넘기 (30초)',
    category: EVENT_CATEGORIES.INDIVIDUAL,
    duration: 30,
    unit: '개',
    description: '앞으로 1단계로 뛰기',
    icon: '➡️',
    minParticipants: 1,
    maxParticipants: 5,
    isDefault: true
  },
  {
    id: 'individual_double',
    name: '2단넘기',
    displayName: '2단넘기 (30초)',
    category: EVENT_CATEGORIES.INDIVIDUAL,
    duration: 30,
    unit: '개',
    description: '한 번 점프에 줄을 두 번 돌리기',
    icon: '🏃',
    minParticipants: 1,
    maxParticipants: 5,
    isDefault: true
  },
  {
    id: 'individual_triple',
    name: '3단넘기',
    displayName: '3단넘기 (30초)',
    category: EVENT_CATEGORIES.INDIVIDUAL,
    duration: 30,
    unit: '개',
    description: '한 번 점프에 줄을 세 번 돌리기',
    icon: '🚀',
    minParticipants: 1,
    maxParticipants: 5,
    isDefault: true
  },
  {
    id: 'individual_cross',
    name: '크로스점프',
    displayName: '크로스점프 (30초)',
    category: EVENT_CATEGORIES.INDIVIDUAL,
    duration: 30,
    unit: '개',
    description: '팔을 교차하여 뛰기',
    icon: '❌',
    minParticipants: 1,
    maxParticipants: 5,
    isDefault: true
  },
  {
    id: 'individual_side_swing',
    name: '사이드스윙',
    displayName: '사이드스윙 (30초)',
    category: EVENT_CATEGORIES.INDIVIDUAL,
    duration: 30,
    unit: '개',
    description: '좌우로 스윙하며 뛰기',
    icon: '↔️',
    minParticipants: 1,
    maxParticipants: 5,
    isDefault: true
  },

  // ========================================
  // 짝줄넘기 (3개)
  // ========================================
  {
    id: 'pair_alternate',
    name: '번갈아 짝줄넘기',
    displayName: '번갈아 짝줄넘기 (30초)',
    category: EVENT_CATEGORIES.PAIR,
    duration: 30,
    unit: '개',
    description: '2명이 번갈아가며 뛰기',
    icon: '👫',
    minParticipants: 2,
    maxParticipants: 10, // 5팀
    isDefault: true
  },
  {
    id: 'pair_facing',
    name: '마주보며 짝줄넘기',
    displayName: '마주보며 짝줄넘기 (30초)',
    category: EVENT_CATEGORIES.PAIR,
    duration: 30,
    unit: '개',
    description: '2명이 마주보며 함께 뛰기',
    icon: '👥',
    minParticipants: 2,
    maxParticipants: 10, // 5팀
    isDefault: true
  },
  {
    id: 'pair_side_by_side',
    name: '나란히 짝줄넘기',
    displayName: '나란히 짝줄넘기 (30초)',
    category: EVENT_CATEGORIES.PAIR,
    duration: 30,
    unit: '개',
    description: '2명이 나란히 서서 함께 뛰기',
    icon: '🧍🧍‍♀️',
    minParticipants: 2,
    maxParticipants: 10, // 5팀
    isDefault: true
  },

  // ========================================
  // 단체줄 (5개)
  // ========================================
  {
    id: 'group_long',
    name: '긴줄넘기',
    displayName: '긴줄넘기 (1분)',
    category: EVENT_CATEGORIES.GROUP,
    duration: 60,
    unit: '개',
    description: '긴 줄 안에서 여러 명이 함께 뛰기',
    icon: '🪢',
    minParticipants: 3,
    maxParticipants: 10,
    isDefault: true
  },
  {
    id: 'group_long_4',
    name: '4인 긴줄넘기',
    displayName: '4인 긴줄넘기 (1분)',
    category: EVENT_CATEGORIES.GROUP,
    duration: 60,
    unit: '개',
    description: '4명이 함께 긴 줄 안에서 뛰기',
    icon: '🤝',
    minParticipants: 4,
    maxParticipants: 4,
    isDefault: true
  },
  {
    id: 'group_8_marathon',
    name: '8자마라톤',
    displayName: '8자마라톤 (1분 30초)',
    category: EVENT_CATEGORIES.GROUP,
    duration: 90,
    unit: '개',
    description: '긴 줄을 8자로 돌며 여러 명이 뛰기',
    icon: '♾️',
    minParticipants: 3,
    maxParticipants: 8,
    isDefault: true
  },
  {
    id: 'group_jump_in_together',
    name: '뛰어들어함께뛰기',
    displayName: '뛰어들어함께뛰기 (1분)',
    category: EVENT_CATEGORIES.GROUP,
    duration: 60,
    unit: '개',
    description: '긴 줄 안으로 뛰어들어 함께 뛰기',
    icon: '🏃‍♂️',
    minParticipants: 3,
    maxParticipants: 8,
    isDefault: true
  },
  {
    id: 'group_relay',
    name: '릴레이넘기',
    displayName: '릴레이넘기 (2분)',
    category: EVENT_CATEGORIES.GROUP,
    duration: 120,
    unit: '개',
    description: '여러 명이 이어서 뛰기',
    icon: '🏃‍♀️',
    minParticipants: 3,
    maxParticipants: 10,
    isDefault: true
  }
];

// 카테고리별 종목 가져오기
export const getEventsByCategory = (category) => {
  return DEFAULT_EVENTS.filter(event => event.category === category);
};

// 종목 ID로 종목 찾기
export const getEventById = (eventId) => {
  return DEFAULT_EVENTS.find(event => event.id === eventId);
};

// 카테고리별 색상 (UI 표시용)
export const CATEGORY_COLORS = {
  [EVENT_CATEGORIES.INDIVIDUAL]: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    badge: 'bg-blue-100 text-blue-800'
  },
  [EVENT_CATEGORIES.PAIR]: {
    bg: 'bg-green-50',
    text: 'text-green-700',
    border: 'border-green-200',
    badge: 'bg-green-100 text-green-800'
  },
  [EVENT_CATEGORIES.GROUP]: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    badge: 'bg-purple-100 text-purple-800'
  }
};

// 카테고리별 한글명
export const CATEGORY_LABELS = {
  [EVENT_CATEGORIES.INDIVIDUAL]: '개인전',
  [EVENT_CATEGORIES.PAIR]: '짝줄넘기',
  [EVENT_CATEGORIES.GROUP]: '단체줄'
};
