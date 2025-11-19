import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Alert } from './ui/alert';
import ClassStudentCodesModal from './ClassStudentCodesModal';
import { useRecord } from '../contexts/RecordContext';
import { useAuth } from '../contexts/AuthContext';
import { generateStudentCode } from '../utils/studentCodeGenerator';
import toast from 'react-hot-toast';

export default function StudentCodeListModal({ open, onOpenChange }) {
  const { students, updateStudent } = useRecord();
  const { user } = useAuth();
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [searchQuery, setSearchQuery] = useState(''); // 검색어
  const [selectedClass, setSelectedClass] = useState(null); // 선택된 학급
  const [classModalOpen, setClassModalOpen] = useState(false); // 학급 상세 모달

  // 학급별로 학생 그룹화
  const studentsByClass = useMemo(() => {
    const grouped = {};
    students.forEach(student => {
      const className = student.className || '미분류';
      if (!grouped[className]) {
        grouped[className] = [];
      }
      grouped[className].push(student);
    });
    return grouped;
  }, [students]);

  // 검색 필터링된 학급별 학생
  const filteredStudentsByClass = useMemo(() => {
    if (!searchQuery.trim()) return studentsByClass;

    const filtered = {};
    Object.entries(studentsByClass).forEach(([className, students]) => {
      const matchedStudents = students.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      if (matchedStudents.length > 0) {
        filtered[className] = matchedStudents;
      }
    });
    return filtered;
  }, [studentsByClass, searchQuery]);

  // 코드 없는 학생 찾기
  const studentsWithoutCode = useMemo(() => {
    return students.filter(s => !s.studentCode);
  }, [students]);

  // 코드 일괄 생성
  const handleGenerateMissingCodes = async () => {
    if (!user?.uid) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    if (studentsWithoutCode.length === 0) {
      toast.error('생성할 코드가 없습니다.');
      return;
    }

    const confirmed = confirm(
      `${studentsWithoutCode.length}명의 학생에게 코드를 생성하시겠습니까?`
    );

    if (!confirmed) return;

    setGenerating(true);
    setProgress({ current: 0, total: studentsWithoutCode.length });

    try {
      for (let i = 0; i < studentsWithoutCode.length; i++) {
        const student = studentsWithoutCode[i];

        // 코드 생성
        const studentCode = generateStudentCode(user.uid, student.id);

        // Firestore 업데이트
        await updateStudent(student.id, { studentCode });

        // 진행률 업데이트
        setProgress({ current: i + 1, total: studentsWithoutCode.length });
      }

      toast.success(
        <div>
          <div className="font-bold">✅ 코드 생성 완료!</div>
          <div className="text-sm">{studentsWithoutCode.length}명</div>
        </div>,
        { duration: 4000 }
      );

    } catch (error) {
      console.error('코드 생성 실패:', error);
      toast.error('코드 생성에 실패했습니다: ' + error.message);
    } finally {
      setGenerating(false);
      setProgress({ current: 0, total: 0 });
    }
  };

  // 학급 카드 클릭 시 상세 모달 열기
  const openClassModal = (className) => {
    setSelectedClass(className);
    setClassModalOpen(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">🔑 학급 선택</DialogTitle>
            <DialogDescription>
              학급을 선택하면 학생들의 로그인 코드를 확인할 수 있습니다.
            </DialogDescription>
          </DialogHeader>

          {/* 검색창 */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 학급 또는 학생 이름 검색..."
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="검색어 지우기"
              >
                ✕
              </button>
            )}
          </div>

          {/* 코드 없는 학생 경고 */}
          {studentsWithoutCode.length > 0 && (
            <Alert className="bg-yellow-50 border-yellow-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <div className="font-bold text-yellow-800">
                      {studentsWithoutCode.length}명의 학생에게 코드가 없습니다.
                    </div>
                    <div className="text-sm text-yellow-700">
                      코드를 생성해야 학생들이 로그인할 수 있습니다.
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleGenerateMissingCodes}
                  disabled={generating}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  {generating
                    ? `생성 중... (${progress.current}/${progress.total})`
                    : '🔄 코드 일괄 생성'}
                </Button>
              </div>
            </Alert>
          )}

          {/* 학급 카드 그리드 (미니멀 디자인) */}
          {Object.keys(filteredStudentsByClass).length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {Object.keys(filteredStudentsByClass).sort().map(className => {
                const classStudents = filteredStudentsByClass[className];
                const noCodeCount = classStudents.filter(s => !s.studentCode).length;
                const hasWarning = noCodeCount > 0;

                return (
                  <button
                    key={className}
                    onClick={() => openClassModal(className)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 hover:shadow-lg ${
                      hasWarning
                        ? 'bg-yellow-50 text-yellow-800 border-2 border-yellow-300 hover:bg-yellow-100'
                        : 'bg-blue-50 text-blue-800 border-2 border-blue-300 hover:bg-blue-100'
                    }`}
                    title={hasWarning ? `코드 없음: ${noCodeCount}명` : `${className} 학급 코드 보기`}
                  >
                    <span className="font-bold">{className}</span>
                    <span className="mx-1.5 text-gray-400">|</span>
                    <span className="text-xs">{classStudents.length}명</span>
                    {hasWarning && <span className="ml-1.5">⚠️</span>}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <div className="text-6xl mb-4">👥</div>
              <div className="text-lg">
                {searchQuery ? '검색 결과가 없습니다.' : '등록된 학생이 없습니다.'}
              </div>
              <div className="text-sm mt-2">
                {searchQuery ? '다른 검색어를 입력해보세요.' : '학급/학생 관리에서 학생을 추가해주세요.'}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 학급 상세 모달 */}
      {selectedClass && (
        <ClassStudentCodesModal
          open={classModalOpen}
          onOpenChange={setClassModalOpen}
          className={selectedClass}
          students={studentsByClass[selectedClass] || []}
        />
      )}
    </>
  );
}
