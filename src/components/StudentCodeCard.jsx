import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import toast from 'react-hot-toast';

export default function StudentCodeCard({ student }) {
  const [copying, setCopying] = useState(false);

  // Phase 8-9에서 학생 뷰 구현 시 활성화
  const handleViewPage = () => {
    if (!student.studentCode) {
      toast.error('학생 코드가 없습니다.');
      return;
    }
    // TODO: Phase 8-9 학생 뷰 페이지로 이동
    toast('학생 뷰는 Phase 8-9에서 구현 예정입니다.', {
      icon: '🚧',
    });
  };

  const handleCopy = async () => {
    if (!student.studentCode) {
      toast.error('학생 코드가 없습니다.');
      return;
    }

    try {
      setCopying(true);
      await navigator.clipboard.writeText(student.studentCode);

      toast.success(
        <div className="flex flex-col gap-1">
          <span className="font-bold">✅ 코드가 복사되었습니다!</span>
          <span className="text-sm">{student.name}: {student.studentCode}</span>
        </div>,
        {
          duration: 3000,
          position: 'top-right',
        }
      );
    } catch (error) {
      toast.error('복사에 실패했습니다.');
      console.error('Copy error:', error);
    } finally {
      setTimeout(() => setCopying(false), 500);
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        {student.studentCode ? (
          <div className="space-y-3">
            {/* 상단: 이름 + 버튼 (한 줄 배치) */}
            <div className="flex items-center justify-between">
              {/* 좌측: 이모지 + 이름 */}
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {student.gender === 'male' ? '👨‍🎓' : student.gender === 'female' ? '👩‍🎓' : '👨‍🎓'}
                </span>
                <span className="font-bold text-base">{student.name}</span>
              </div>

              {/* 우측: 버튼들 */}
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleCopy}
                  disabled={copying}
                  size="sm"
                  className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 whitespace-nowrap"
                  title="클립보드에 학생 코드 복사"
                >
                  {copying ? '복사 중...' : '📋 코드 복사'}
                </Button>
                <Button
                  onClick={handleViewPage}
                  size="sm"
                  className="text-xs bg-green-100 hover:bg-green-200 text-green-700 whitespace-nowrap"
                  title="학생 페이지 미리보기"
                >
                  🔍 미리보기
                </Button>
              </div>
            </div>

            {/* 하단: 학생 코드 박스 (줄바꿈 없이) */}
            <div className="bg-blue-50 p-3 rounded-lg border-2 border-blue-200">
              <div className="text-sm font-mono font-bold text-blue-600 select-all whitespace-nowrap overflow-x-auto">
                학생코드: {student.studentCode}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {/* 상단: 이름만 */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">
                {student.gender === 'male' ? '👨‍🎓' : student.gender === 'female' ? '👩‍🎓' : '👨‍🎓'}
              </span>
              <span className="font-bold text-base">{student.name}</span>
            </div>

            {/* 하단: 코드 없음 경고 */}
            <div className="bg-yellow-50 border-2 border-yellow-200 p-3 rounded-lg text-center">
              <div className="text-yellow-600 text-sm">⚠️ 코드 없음</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
