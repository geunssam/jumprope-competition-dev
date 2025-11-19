import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import toast from 'react-hot-toast';
import { DEFAULT_EVENTS, CATEGORY_LABELS, EVENT_CATEGORIES } from '../constants/events';

/**
 * CreateSessionModal - 세션 생성 모달
 *
 * 기능:
 * - 세션명 입력
 * - 세션 타입 선택 (연습/대회)
 * - 종목 선택 (기본 16개 + 커스텀)
 * - 학급 선택 (멀티셀렉트)
 * - 날짜 선택
 */
export default function CreateSessionModal({ open, onOpenChange, onSubmit, classes }) {
  // ============================================
  // State
  // ============================================
  const [formData, setFormData] = useState({
    name: '',
    type: 'practice', // 'practice' | 'competition'
    eventId: '',
    classIds: [],
    date: new Date().toISOString().split('T')[0],
  });

  // ============================================
  // 폼 초기화
  // ============================================
  useEffect(() => {
    if (open) {
      setFormData({
        name: '',
        type: 'practice',
        eventId: '',
        classIds: [],
        date: new Date().toISOString().split('T')[0],
      });
    }
  }, [open]);

  // ============================================
  // 학급 선택/해제
  // ============================================
  const toggleClass = (classId) => {
    setFormData((prev) => ({
      ...prev,
      classIds: prev.classIds.includes(classId)
        ? prev.classIds.filter((id) => id !== classId)
        : [...prev.classIds, classId],
    }));
  };

  // ============================================
  // 전체 학급 선택/해제
  // ============================================
  const toggleAllClasses = () => {
    setFormData((prev) => ({
      ...prev,
      classIds:
        prev.classIds.length === classes.length ? [] : classes.map((c) => c.id),
    }));
  };

  // ============================================
  // 폼 제출
  // ============================================
  const handleSubmit = () => {
    // 유효성 검사
    if (!formData.name.trim()) {
      toast.error('세션명을 입력해주세요.');
      return;
    }

    if (!formData.eventId) {
      toast.error('종목을 선택해주세요.');
      return;
    }

    if (formData.classIds.length === 0) {
      toast.error('학급을 최소 1개 이상 선택해주세요.');
      return;
    }

    // 제출
    onSubmit(formData);
  };

  // ============================================
  // Render
  // ============================================
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>세션 생성</DialogTitle>
          <DialogDescription>
            연습 또는 대회 세션을 생성하여 기록을 시작하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 세션명 */}
          <div>
            <Label htmlFor="name">세션명 *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="예: 3학년 줄넘기 연습"
            />
          </div>

          {/* 세션 타입 */}
          <div>
            <Label>세션 타입 *</Label>
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => setFormData({ ...formData, type: 'practice' })}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  formData.type === 'practice'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">📝</div>
                  <div className="font-semibold">연습</div>
                  <div className="text-xs text-gray-500 mt-1">
                    일상적인 연습 세션
                  </div>
                </div>
              </button>
              <button
                onClick={() => setFormData({ ...formData, type: 'competition' })}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  formData.type === 'competition'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🏆</div>
                  <div className="font-semibold">대회</div>
                  <div className="text-xs text-gray-500 mt-1">
                    공식 대회 또는 시험
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* 종목 선택 */}
          <div>
            <Label htmlFor="eventId">종목 선택 *</Label>
            <select
              id="eventId"
              value={formData.eventId}
              onChange={(e) => setFormData({ ...formData, eventId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="">종목을 선택하세요</option>
              {Object.entries(EVENT_CATEGORIES).map(([key, category]) => (
                <optgroup key={key} label={CATEGORY_LABELS[category]}>
                  {DEFAULT_EVENTS.filter((e) => e.category === category).map(
                    (event) => (
                      <option key={event.id} value={event.id}>
                        {event.icon} {event.displayName}
                      </option>
                    )
                  )}
                </optgroup>
              ))}
            </select>
          </div>

          {/* 학급 선택 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>참여 학급 * ({formData.classIds.length}개 선택)</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleAllClasses}
                className="text-xs"
              >
                {formData.classIds.length === classes.length
                  ? '전체 해제'
                  : '전체 선택'}
              </Button>
            </div>

            {classes.length === 0 ? (
              <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
                <p>등록된 학급이 없습니다.</p>
                <p className="text-sm mt-1">
                  학급/학생 관리에서 학급을 먼저 생성해주세요.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-3 border border-gray-200 rounded-lg">
                {classes.map((cls) => (
                  <label
                    key={cls.id}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                      formData.classIds.includes(cls.id)
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.classIds.includes(cls.id)}
                      onChange={() => toggleClass(cls.id)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">{cls.name}</span>
                    <span className="text-xs text-gray-500">
                      ({cls.grade}-{cls.classNumber})
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* 날짜 선택 */}
          <div>
            <Label htmlFor="date">날짜 *</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              취소
            </Button>
            <Button onClick={handleSubmit} className="flex-1">
              세션 생성
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
