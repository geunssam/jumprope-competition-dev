import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import firestoreService from '../services/firestoreService';

/**
 * RecordContext - 줄넘기 기록 전역 상태 관리
 *
 * 제공 기능:
 * - 학급/학생/세션/기록 실시간 동기화
 * - CRUD 작업 (생성/조회/수정/삭제)
 * - 저장 상태 추적 ('saving' | 'saved' | 'error')
 */
const RecordContext = createContext();

export const RecordProvider = ({ children }) => {
  const { user: currentUser } = useAuth();

  // ============================================
  // 상태 관리
  // ============================================
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [records, setRecords] = useState([]);
  const [studentBadges, setStudentBadges] = useState({});
  const [studentHistory, setStudentHistory] = useState({});

  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('saved'); // 'saving' | 'saved' | 'error'

  // ============================================
  // 실시간 리스너 연결 (로그인 시 자동 실행)
  // ============================================
  useEffect(() => {
    if (!currentUser) {
      // 로그아웃 시 모든 데이터 초기화
      setClasses([]);
      setStudents([]);
      setSessions([]);
      setRecords([]);
      setStudentBadges({});
      setStudentHistory({});
      setLoading(false);
      firestoreService.unsubscribeAll();
      return;
    }

    setLoading(true);
    console.log('🚀 [RecordContext] 리스너 연결 시작...');

    // 1. 학급 목록 실시간 동기화
    const unsubscribeClasses = firestoreService.subscribeToClasses((updatedClasses) => {
      console.log('🔄 [RecordContext] 학급 목록 업데이트:', updatedClasses.length);
      setClasses(updatedClasses);
    });

    // 2. 학생 목록 실시간 동기화
    const unsubscribeStudents = firestoreService.subscribeToStudents((updatedStudents) => {
      console.log('🔄 [RecordContext] 학생 목록 업데이트:', updatedStudents.length);
      setStudents(updatedStudents);
    });

    // 3. 세션 목록 실시간 동기화
    const unsubscribeSessions = firestoreService.subscribeToSessions((updatedSessions) => {
      console.log('🔄 [RecordContext] 세션 목록 업데이트:', updatedSessions.length);
      setSessions(updatedSessions);
    });

    // 4. 초기 데이터 로드 완료
    const timer = setTimeout(() => {
      setLoading(false);
      console.log('✅ [RecordContext] 초기 데이터 로드 완료');
    }, 500);

    // 컴포넌트 언마운트 시 리스너 정리
    return () => {
      clearTimeout(timer);
      unsubscribeClasses();
      unsubscribeStudents();
      unsubscribeSessions();
      console.log('🧹 [RecordContext] 리스너 정리 완료');
    };
  }, [currentUser]);

  // ============================================
  // 학급 관리 함수
  // ============================================

  const createClass = async (classData) => {
    try {
      setSaveStatus('saving');
      const classId = await firestoreService.createClass(classData);
      setSaveStatus('saved');
      return classId;
    } catch (error) {
      setSaveStatus('error');
      console.error('[RecordContext] 학급 생성 실패:', error);
      throw error;
    }
  };

  const updateClass = async (classId, updates) => {
    try {
      setSaveStatus('saving');
      await firestoreService.updateClass(classId, updates);
      setSaveStatus('saved');
    } catch (error) {
      setSaveStatus('error');
      console.error('[RecordContext] 학급 업데이트 실패:', error);
      throw error;
    }
  };

  const deleteClass = async (classId) => {
    try {
      setSaveStatus('saving');
      await firestoreService.deleteClass(classId);
      setSaveStatus('saved');
    } catch (error) {
      setSaveStatus('error');
      console.error('[RecordContext] 학급 삭제 실패:', error);
      throw error;
    }
  };

  // ============================================
  // 학생 관리 함수
  // ============================================

  const createStudent = async (studentData) => {
    try {
      setSaveStatus('saving');
      const studentId = await firestoreService.createStudent(studentData);
      setSaveStatus('saved');
      return studentId;
    } catch (error) {
      setSaveStatus('error');
      console.error('[RecordContext] 학생 생성 실패:', error);
      throw error;
    }
  };

  const updateStudent = async (studentId, updates) => {
    try {
      setSaveStatus('saving');
      await firestoreService.updateStudent(studentId, updates);
      setSaveStatus('saved');
    } catch (error) {
      setSaveStatus('error');
      console.error('[RecordContext] 학생 업데이트 실패:', error);
      throw error;
    }
  };

  const deleteStudent = async (studentId) => {
    try {
      setSaveStatus('saving');
      await firestoreService.deleteStudent(studentId);
      setSaveStatus('saved');
    } catch (error) {
      setSaveStatus('error');
      console.error('[RecordContext] 학생 삭제 실패:', error);
      throw error;
    }
  };

  // ============================================
  // 세션 관리 함수
  // ============================================

  const createSession = async (sessionData) => {
    try {
      setSaveStatus('saving');
      const sessionId = await firestoreService.createSession(sessionData);
      setSaveStatus('saved');
      return sessionId;
    } catch (error) {
      setSaveStatus('error');
      console.error('[RecordContext] 세션 생성 실패:', error);
      throw error;
    }
  };

  const updateSession = async (sessionId, updates) => {
    try {
      setSaveStatus('saving');
      await firestoreService.updateSession(sessionId, updates);
      setSaveStatus('saved');
    } catch (error) {
      setSaveStatus('error');
      console.error('[RecordContext] 세션 업데이트 실패:', error);
      throw error;
    }
  };

  const deleteSession = async (sessionId) => {
    try {
      setSaveStatus('saving');
      await firestoreService.deleteSession(sessionId);
      setSaveStatus('saved');
    } catch (error) {
      setSaveStatus('error');
      console.error('[RecordContext] 세션 삭제 실패:', error);
      throw error;
    }
  };

  // ============================================
  // 기록 관리 함수
  // ============================================

  const createRecord = async (recordData) => {
    try {
      setSaveStatus('saving');
      const recordId = await firestoreService.createRecord(recordData);
      setSaveStatus('saved');
      return recordId;
    } catch (error) {
      setSaveStatus('error');
      console.error('[RecordContext] 기록 생성 실패:', error);
      throw error;
    }
  };

  const getRecords = async (sessionId) => {
    try {
      return await firestoreService.getRecords(sessionId);
    } catch (error) {
      console.error('[RecordContext] 기록 로드 실패:', error);
      throw error;
    }
  };

  const subscribeToRecords = (sessionId, callback) => {
    try {
      return firestoreService.subscribeToRecords(sessionId, callback);
    } catch (error) {
      console.error('[RecordContext] 기록 리스너 생성 실패:', error);
      throw error;
    }
  };

  // ============================================
  // 배지 관리 함수
  // ============================================

  const saveStudentBadges = async (studentId, badgeData) => {
    try {
      setSaveStatus('saving');
      await firestoreService.saveStudentBadges(studentId, badgeData);
      setSaveStatus('saved');

      // 로컬 상태 업데이트
      setStudentBadges((prev) => ({
        ...prev,
        [studentId]: badgeData,
      }));
    } catch (error) {
      setSaveStatus('error');
      console.error('[RecordContext] 배지 저장 실패:', error);
      throw error;
    }
  };

  const getStudentBadges = async (studentId) => {
    try {
      const badges = await firestoreService.getStudentBadges(studentId);

      // 로컬 상태 업데이트
      setStudentBadges((prev) => ({
        ...prev,
        [studentId]: badges,
      }));

      return badges;
    } catch (error) {
      console.error('[RecordContext] 배지 로드 실패:', error);
      throw error;
    }
  };

  // ============================================
  // 유틸리티 함수
  // ============================================

  /**
   * 학급 ID로 해당 학급의 학생 목록 반환
   * @param {string} classId - 학급 ID
   * @returns {Array} 학생 배열
   */
  const getStudentsByClass = (classId) => {
    return students.filter((student) => student.classId === classId);
  };

  /**
   * 학생 ID로 학생 정보 반환
   * @param {string} studentId - 학생 ID
   * @returns {Object|null} 학생 객체
   */
  const getStudentById = (studentId) => {
    return students.find((student) => student.id === studentId) || null;
  };

  /**
   * 학급 ID로 학급 정보 반환
   * @param {string} classId - 학급 ID
   * @returns {Object|null} 학급 객체
   */
  const getClassById = (classId) => {
    return classes.find((cls) => cls.id === classId) || null;
  };

  // ============================================
  // Context 값
  // ============================================

  const value = {
    // 상태
    classes,
    students,
    sessions,
    records,
    studentBadges,
    studentHistory,
    loading,
    saveStatus,

    // 학급 관리
    createClass,
    updateClass,
    deleteClass,
    getClassById,

    // 학생 관리
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    getStudentsByClass,

    // 세션 관리
    createSession,
    updateSession,
    deleteSession,

    // 기록 관리
    createRecord,
    getRecords,
    subscribeToRecords,

    // 배지 관리
    saveStudentBadges,
    getStudentBadges,
  };

  return <RecordContext.Provider value={value}>{children}</RecordContext.Provider>;
};

// ============================================
// Custom Hook
// ============================================

export const useRecord = () => {
  const context = useContext(RecordContext);
  if (!context) {
    throw new Error('useRecord must be used within a RecordProvider');
  }
  return context;
};
