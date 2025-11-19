import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';

/**
 * AddStudentModal
 *
 * 학급에 학생을 추가하는 모달
 * - 일괄 입력: 쉼표 또는 줄바꿈으로 구분하여 여러 명 추가
 * - 자동 번호 부여 (기존 학생 수 + 1부터)
 */
const AddStudentModal = ({ open, onOpenChange, onAddStudents, currentStudentCount }) => {
  const [studentInput, setStudentInput] = useState('');

  const handleAdd = () => {
    if (!studentInput.trim()) {
      alert('학생 이름을 입력해주세요.');
      return;
    }

    // 쉼표 또는 줄바꿈으로 구분
    const names = studentInput
      .split(/[,\n]+/)
      .map(name => name.trim())
      .filter(name => name.length > 0);

    if (names.length === 0) {
      alert('올바른 이름을 입력해주세요.');
      return;
    }

    // 학생 객체 생성 (번호 자동 부여)
    const newStudents = names.map((name, index) => ({
      name,
      number: currentStudentCount + index + 1,
      gender: 'male', // 기본값 (나중에 수정 가능)
    }));

    onAddStudents(newStudents);
    setStudentInput('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>학생 추가</DialogTitle>
          <DialogDescription>
            학생 이름을 입력하세요. 쉼표(,) 또는 줄바꿈으로 구분하여 여러 명을 한 번에 추가할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="student-input">학생 이름</Label>
            <textarea
              id="student-input"
              value={studentInput}
              onChange={(e) => setStudentInput(e.target.value)}
              placeholder="예: 홍길동, 김철수, 이영희&#10;또는&#10;홍길동&#10;김철수&#10;이영희"
              className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              rows={5}
            />
            <p className="text-xs text-muted-foreground">
              💡 입력된 순서대로 {currentStudentCount + 1}번부터 자동으로 번호가 부여됩니다.
            </p>
            <p className="text-xs text-muted-foreground">
              📌 성별은 나중에 수정할 수 있습니다. (기본값: 남학생)
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setStudentInput('');
              onOpenChange(false);
            }}
          >
            취소
          </Button>
          <Button onClick={handleAdd}>추가</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentModal;
