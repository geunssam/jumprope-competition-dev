import { useState } from 'react';
import { Plus, Calendar, Users, Play, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import toast from 'react-hot-toast';
import { useRecord } from '../contexts/RecordContext';
import CreateSessionModal from './CreateSessionModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { getEventById } from '../constants/events';

/**
 * SessionManagementView - 세션 관리 화면
 *
 * 기능:
 * - 진행 중 세션 목록 표시
 * - 완료된 세션 목록 표시
 * - 세션 생성 (연습/대회)
 * - 세션 삭제
 */
export default function SessionManagementView() {
  const { sessions, classes, createSession, deleteSession } = useRecord();

  // ============================================
  // State
  // ============================================
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingSession, setDeletingSession] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'ongoing' | 'finished'

  // ============================================
  // 세션 필터링
  // ============================================
  const ongoingSessions = sessions.filter((session) => session.status === 'ongoing');
  const finishedSessions = sessions.filter((session) => session.status === 'finished');

  const filteredSessions =
    filter === 'ongoing'
      ? ongoingSessions
      : filter === 'finished'
      ? finishedSessions
      : sessions;

  // ============================================
  // 세션 관리
  // ============================================
  const handleCreateSession = async (sessionData) => {
    try {
      await createSession({
        ...sessionData,
        status: 'ongoing',
        createdAt: new Date().toISOString(),
      });
      toast.success('세션이 생성되었습니다.');
      setCreateModalOpen(false);
    } catch (error) {
      toast.error('세션 생성에 실패했습니다.');
      console.error(error);
    }
  };

  const handleDeleteSession = async () => {
    try {
      await deleteSession(deletingSession.id);
      toast.success('세션이 삭제되었습니다.');
      setDeleteModalOpen(false);
      setDeletingSession(null);
    } catch (error) {
      toast.error('세션 삭제에 실패했습니다.');
      console.error(error);
    }
  };

  const openDeleteModal = (session) => {
    setDeletingSession(session);
    setDeleteModalOpen(true);
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
            <h1 className="text-2xl font-bold text-gray-900">세션 관리</h1>
            <p className="text-sm text-gray-500 mt-1">
              진행 중: {ongoingSessions.length}개 | 완료: {finishedSessions.length}개
            </p>
          </div>
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            세션 생성
          </Button>
        </div>

        {/* 필터 버튼 */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            전체 ({sessions.length})
          </button>
          <button
            onClick={() => setFilter('ongoing')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'ongoing'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            진행 중 ({ongoingSessions.length})
          </button>
          <button
            onClick={() => setFilter('finished')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'finished'
                ? 'bg-gray-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            완료 ({finishedSessions.length})
          </button>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex-1 overflow-auto p-6">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Calendar className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>아직 세션이 없습니다.</p>
            <p className="text-sm mt-1">세션을 생성하여 기록을 시작해보세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSessions.map((session) => (
              <SessionCard
                key={session.id}
                session={session}
                classes={classes}
                onDelete={openDeleteModal}
              />
            ))}
          </div>
        )}
      </div>

      {/* 세션 생성 모달 */}
      <CreateSessionModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={handleCreateSession}
        classes={classes}
      />

      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onConfirm={handleDeleteSession}
        title="세션 삭제"
        message={`"${deletingSession?.name}" 세션을 삭제하시겠습니까? 해당 세션의 모든 기록도 함께 삭제됩니다.`}
      />
    </div>
  );
}

// ============================================
// SessionCard - 세션 카드 컴포넌트
// ============================================
function SessionCard({ session, classes, onDelete }) {
  const event = getEventById(session.eventId);
  const sessionClasses = classes.filter((c) =>
    session.classIds?.includes(c.id)
  );

  const isOngoing = session.status === 'ongoing';

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border-2 p-4 hover:shadow-md transition-shadow ${
        isOngoing ? 'border-green-200' : 'border-gray-200'
      }`}
    >
      {/* 헤더 */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{session.name}</h3>
            {isOngoing ? (
              <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full flex items-center gap-1">
                <Play className="w-3 h-3" />
                진행 중
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full flex items-center gap-1">
                <CheckCircle className="w-3 h-3" />
                완료
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`px-2 py-0.5 text-xs rounded-full ${
                session.type === 'practice'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-purple-100 text-purple-700'
              }`}
            >
              {session.type === 'practice' ? '연습' : '대회'}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(session)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* 종목 정보 */}
      {event && (
        <div className="mb-3 p-2 bg-gray-50 rounded">
          <div className="flex items-center gap-2">
            <span className="text-xl">{event.icon}</span>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">
                {event.displayName}
              </div>
              <div className="text-xs text-gray-500">
                ⏱️ {event.duration}초 | 📊 {event.unit}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 학급 정보 */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <Users className="w-4 h-4" />
        <span>
          {sessionClasses.length > 0
            ? sessionClasses.map((c) => c.name).join(', ')
            : '학급 없음'}
        </span>
      </div>

      {/* 날짜 정보 */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Calendar className="w-4 h-4" />
        <span>{new Date(session.date).toLocaleDateString('ko-KR')}</span>
      </div>
    </div>
  );
}
