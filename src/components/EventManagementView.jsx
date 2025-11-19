import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import toast from 'react-hot-toast';
import {
  DEFAULT_EVENTS,
  EVENT_CATEGORIES,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  getEventsByCategory,
} from '../constants/events';
import DeleteConfirmModal from './DeleteConfirmModal';

/**
 * EventManagementView - 종목 관리 화면
 *
 * 기능:
 * - 기본 종목 16개 표시 (카테고리별 그룹핑)
 * - 커스텀 종목 추가/수정/삭제
 * - 종목 정보 상세 보기
 */
export default function EventManagementView() {
  // ============================================
  // State
  // ============================================
  const [customEvents, setCustomEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(EVENT_CATEGORIES.INDIVIDUAL);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState(null);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // ============================================
  // 카테고리별 기본 종목 가져오기
  // ============================================
  const getDefaultEventsByCategory = (category) => {
    return getEventsByCategory(category);
  };

  // ============================================
  // 커스텀 종목 관리
  // ============================================
  const handleCreateCustomEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: `custom_${Date.now()}`,
      isDefault: false,
      createdAt: new Date().toISOString(),
    };

    setCustomEvents([...customEvents, newEvent]);
    toast.success('커스텀 종목이 생성되었습니다.');
    setCreateModalOpen(false);
  };

  const handleEditCustomEvent = (eventId, updates) => {
    setCustomEvents(
      customEvents.map((event) => (event.id === eventId ? { ...event, ...updates } : event))
    );
    toast.success('종목이 수정되었습니다.');
    setEditingEvent(null);
  };

  const handleDeleteCustomEvent = (eventId) => {
    setCustomEvents(customEvents.filter((event) => event.id !== eventId));
    toast.success('종목이 삭제되었습니다.');
    setDeleteModalOpen(false);
    setDeletingEvent(null);
  };

  const openDeleteModal = (event) => {
    setDeletingEvent(event);
    setDeleteModalOpen(true);
  };

  const openInfoModal = (event) => {
    setSelectedEvent(event);
    setInfoModalOpen(true);
  };

  // ============================================
  // Render
  // ============================================
  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">종목 관리</h1>
            <p className="text-sm text-gray-500 mt-1">
              기본 종목 16개 + 커스텀 종목 관리
            </p>
          </div>
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            커스텀 종목 추가
          </Button>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 왼쪽: 기본 종목 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              기본 종목 (16개)
            </h2>

            {/* 카테고리 탭 */}
            <div className="flex gap-2 mb-4 flex-wrap">
              {Object.entries(EVENT_CATEGORIES).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === value
                      ? `${CATEGORY_COLORS[value].badge} border-2 ${CATEGORY_COLORS[value].text}`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {CATEGORY_LABELS[value]}
                </button>
              ))}
            </div>

            {/* 기본 종목 목록 - 2열 그리드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {getDefaultEventsByCategory(selectedCategory).map((event) => (
                <div
                  key={event.id}
                  className={`p-3 rounded-lg border-2 ${CATEGORY_COLORS[event.category].border} ${CATEGORY_COLORS[event.category].bg} hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{event.icon}</span>
                        <h3 className="font-semibold text-sm text-gray-900">
                          {event.displayName}
                        </h3>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-1">{event.description}</p>
                      <div className="flex gap-3 mt-1.5 text-xs text-gray-500">
                        <span>⏱️ {event.duration}초</span>
                        <span>👥 {event.minParticipants}
                          {event.maxParticipants !== event.minParticipants &&
                            `~${event.maxParticipants}`}명
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openInfoModal(event)}
                      className="h-8 w-8 p-0"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 오른쪽: 커스텀 종목 */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              커스텀 종목 ({customEvents.length}개)
            </h2>

            {customEvents.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <Plus className="w-12 h-12 mx-auto mb-2 opacity-20" />
                <p>아직 커스텀 종목이 없습니다.</p>
                <p className="text-sm mt-1">우측 상단 버튼으로 추가해보세요.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {customEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-3 rounded-lg border-2 ${CATEGORY_COLORS[event.category].border} ${CATEGORY_COLORS[event.category].bg}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{event.icon || '🎯'}</span>
                          <h3 className="font-semibold text-sm text-gray-900">
                            {event.displayName}
                          </h3>
                          <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full">
                            커스텀
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                          {event.description}
                        </p>
                        <div className="flex gap-3 mt-1.5 text-xs text-gray-500">
                          <span>⏱️ {event.duration}초</span>
                          <span>
                            👥 {event.minParticipants}~{event.maxParticipants}명
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingEvent(event)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openDeleteModal(event)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 종목 생성/수정 모달 */}
      <EventFormModal
        open={createModalOpen || !!editingEvent}
        onOpenChange={(open) => {
          if (!open) {
            setCreateModalOpen(false);
            setEditingEvent(null);
          }
        }}
        event={editingEvent}
        onSubmit={
          editingEvent
            ? (data) => handleEditCustomEvent(editingEvent.id, data)
            : handleCreateCustomEvent
        }
      />

      {/* 종목 정보 모달 */}
      <EventInfoModal
        open={infoModalOpen}
        onOpenChange={setInfoModalOpen}
        event={selectedEvent}
      />

      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={() => handleDeleteCustomEvent(deletingEvent.id)}
        title="종목 삭제"
        message={`"${deletingEvent?.displayName}" 종목을 삭제하시겠습니까?`}
      />
    </div>
  );
}

// ============================================
// EventFormModal - 종목 생성/수정 모달
// ============================================
function EventFormModal({ open, onOpenChange, event, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    displayName: '',
    category: EVENT_CATEGORIES.INDIVIDUAL,
    duration: 30,
    unit: '개',
    description: '',
    icon: '🎯',
    minParticipants: 1,
    maxParticipants: 1,
  });

  // event가 변경될 때 formData 업데이트
  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name,
        displayName: event.displayName,
        category: event.category,
        duration: event.duration,
        unit: event.unit,
        description: event.description,
        icon: event.icon || '🎯',
        minParticipants: event.minParticipants,
        maxParticipants: event.maxParticipants,
      });
    }
  }, [event]);

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.displayName.trim()) {
      toast.error('종목명과 표시명을 입력해주세요.');
      return;
    }

    onSubmit(formData);

    // 폼 초기화
    setFormData({
      name: '',
      displayName: '',
      category: EVENT_CATEGORIES.INDIVIDUAL,
      duration: 30,
      unit: '개',
      description: '',
      icon: '🎯',
      minParticipants: 1,
      maxParticipants: 1,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{event ? '종목 수정' : '커스텀 종목 추가'}</DialogTitle>
          <DialogDescription>
            줄넘기 종목 정보를 입력해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 종목명 */}
          <div>
            <Label htmlFor="name">종목명 (시스템용)</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="예: 3단뛰기"
            />
          </div>

          {/* 표시명 */}
          <div>
            <Label htmlFor="displayName">표시명 (사용자용)</Label>
            <Input
              id="displayName"
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
              placeholder="예: 3단뛰기 (30초)"
            />
          </div>

          {/* 카테고리 */}
          <div>
            <Label htmlFor="category">카테고리</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* 시간/단위 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration">시간 (초)</Label>
              <Input
                id="duration"
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label htmlFor="unit">단위</Label>
              <Input
                id="unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="개, 점, 회"
              />
            </div>
          </div>

          {/* 참가 인원 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="minParticipants">최소 인원</Label>
              <Input
                id="minParticipants"
                type="number"
                value={formData.minParticipants}
                onChange={(e) =>
                  setFormData({ ...formData, minParticipants: Number(e.target.value) })
                }
              />
            </div>
            <div>
              <Label htmlFor="maxParticipants">최대 인원</Label>
              <Input
                id="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={(e) =>
                  setFormData({ ...formData, maxParticipants: Number(e.target.value) })
                }
              />
            </div>
          </div>

          {/* 아이콘 */}
          <div>
            <Label htmlFor="icon">아이콘 (이모지)</Label>
            <Input
              id="icon"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="🎯"
            />
          </div>

          {/* 설명 */}
          <div>
            <Label htmlFor="description">설명</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="종목 설명을 입력하세요"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none"
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              취소
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              {event ? '수정' : '생성'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================
// EventInfoModal - 종목 정보 모달
// ============================================
function EventInfoModal({ open, onOpenChange, event }) {
  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-3xl">{event.icon}</span>
            {event.displayName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 카테고리 */}
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">카테고리</div>
            <span className={`px-3 py-1 rounded-full text-sm ${CATEGORY_COLORS[event.category].badge}`}>
              {CATEGORY_LABELS[event.category]}
            </span>
          </div>

          {/* 설명 */}
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">설명</div>
            <p className="text-gray-700">{event.description}</p>
          </div>

          {/* 세부 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">시간</div>
              <div className="text-lg font-semibold">{event.duration}초</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">단위</div>
              <div className="text-lg font-semibold">{event.unit}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">최소 인원</div>
              <div className="text-lg font-semibold">{event.minParticipants}명</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">최대 인원</div>
              <div className="text-lg font-semibold">{event.maxParticipants}명</div>
            </div>
          </div>

          {/* 기본 종목 여부 */}
          {event.isDefault && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-blue-700">
                <Info className="w-4 h-4" />
                <span className="text-sm font-medium">기본 제공 종목입니다</span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
