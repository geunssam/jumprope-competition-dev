import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';

/**
 * StudentSelectionModal
 *
 * 랜덤 팀 생성을 위한 학생 선택 모달
 * - 결석/조퇴 학생 제외 가능
 * - 전체 선택/해제 기능
 * - 선택된 학생 수 실시간 표시
 */
const StudentSelectionModal = ({ open, onOpenChange, students, onConfirm }) => {
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [isAllSelected, setIsAllSelected] = useState(true);

  // 모달이 열릴 때 전체 선택 상태로 초기화
  useEffect(() => {
    if (open && students?.length > 0) {
      setSelectedStudentIds(students.map(s => s.id));
      setIsAllSelected(true);
    }
  }, [open, students]);

  if (!students || students.length === 0) {
    return null;
  }

  // 전체 선택/해제 토글
  const handleToggleAll = () => {
    if (isAllSelected) {
      setSelectedStudentIds([]);
      setIsAllSelected(false);
    } else {
      setSelectedStudentIds(students.map(s => s.id));
      setIsAllSelected(true);
    }
  };

  // 개별 학생 선택/해제
  const handleToggleStudent = (studentId) => {
    setSelectedStudentIds(prev => {
      const newSelection = prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId];

      // 전체 선택 상태 업데이트
      setIsAllSelected(newSelection.length === students.length);

      return newSelection;
    });
  };

  // 확인 버튼 클릭
  const handleConfirm = () => {
    if (selectedStudentIds.length < 2) {
      alert('❌ 최소 2명 이상의 학생을 선택해야 합니다.');
      return;
    }

    const selectedStudents = students.filter(s => selectedStudentIds.includes(s.id));
    onConfirm(selectedStudents);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <span className="text-3xl">👥</span>
            랜덤 팀 생성: 학생 선택
          </DialogTitle>
          <DialogDescription>
            참여할 학생을 선택하세요. 결석/조퇴한 학생은 체크 해제할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4">
          {/* 선택 상태 표시 및 전체 선택/해제 */}
          <div className="flex items-center justify-between mb-4 pb-3 border-b">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-base px-3 py-1">
                {selectedStudentIds.length}명 / {students.length}명 선택
              </Badge>
              {selectedStudentIds.length < 2 && (
                <span className="text-sm text-destructive">
                  ⚠️ 최소 2명 필요
                </span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleAll}
              className="font-medium"
            >
              {isAllSelected ? '전체 해제' : '전체 선택'}
            </Button>
          </div>

          {/* 학생 목록 - 4열 그리드 */}
          <div className="grid grid-cols-4 gap-3">
            {students.map((student) => {
              const isSelected = selectedStudentIds.includes(student.id);

              return (
                <div
                  key={student.id}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg border transition cursor-pointer
                    ${isSelected
                      ? 'bg-sky-100 border-sky-300 hover:bg-sky-200'
                      : 'bg-muted/20 border-muted hover:bg-muted/40'
                    }
                  `}
                  onClick={() => handleToggleStudent(student.id)}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleToggleStudent(student.id)}
                    className="cursor-pointer flex-shrink-0"
                  />

                  <div className="flex items-center gap-1.5 flex-1 min-w-0">
                    <span className="font-semibold text-foreground text-lg whitespace-nowrap">
                      #{student.number}
                    </span>
                    <span className="font-semibold text-foreground text-lg truncate">
                      {student.name}
                    </span>
                  </div>

                  {!isSelected && (
                    <Badge variant="secondary" className="text-xs flex-shrink-0">
                      제외됨
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            취소
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedStudentIds.length < 2}
            className="min-w-[120px]"
          >
            {selectedStudentIds.length < 2
              ? '2명 이상 선택 필요'
              : `확인 (${selectedStudentIds.length}명)`
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default StudentSelectionModal;
