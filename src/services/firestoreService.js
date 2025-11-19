import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  writeBatch,
  orderBy,
} from 'firebase/firestore';
import { db, auth } from '../config/firebase';

/**
 * FirestoreService - Firebase Firestore CRUD 서비스
 *
 * 데이터 격리 패턴: users/{userId}/
 * - 각 사용자의 데이터를 완전히 격리
 * - 실시간 리스너를 통한 자동 동기화
 * - 캐스케이드 삭제 지원
 */
class FirestoreService {
  constructor() {
    this.db = db;
    this.currentUser = null;
    this.unsubscribers = []; // 리스너 정리용
    this.listeners = {}; // 명명된 리스너 저장소
  }

  // ============================================
  // 유틸리티 함수
  // ============================================

  /**
   * 현재 로그인한 사용자 ID 반환
   * @returns {string} userId
   * @throws {Error} 로그인되지 않은 경우
   */
  getCurrentUserId() {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('로그인이 필요합니다.');
    }
    return user.uid;
  }

  /**
   * 사용자별 컬렉션 참조 반환
   * @param {string} collectionName - 컬렉션 이름
   * @returns {CollectionReference}
   */
  getUserCollection(collectionName) {
    const userId = this.getCurrentUserId();
    return collection(this.db, 'users', userId, collectionName);
  }

  /**
   * 사용자별 문서 참조 반환
   * @param {string} collectionName - 컬렉션 이름
   * @param {string} docId - 문서 ID
   * @returns {DocumentReference}
   */
  getUserDoc(collectionName, docId) {
    const userId = this.getCurrentUserId();
    return doc(this.db, 'users', userId, collectionName, docId);
  }

  // ============================================
  // 학급 관리 (Classes)
  // ============================================

  /**
   * 학급 생성
   * @param {Object} classData - 학급 데이터 { name, grade, classNum }
   * @returns {Promise<string>} classId
   */
  async createClass(classData) {
    try {
      const userId = this.getCurrentUserId();
      const classesRef = this.getUserCollection('classes');
      const newClassRef = doc(classesRef);

      const classDoc = {
        ...classData,
        id: newClassRef.id,
        ownerId: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(newClassRef, classDoc);
      console.log('✅ 학급 생성 완료:', newClassRef.id);
      return newClassRef.id;
    } catch (error) {
      console.error('❌ 학급 생성 실패:', error);
      throw new Error('학급 생성에 실패했습니다.');
    }
  }

  /**
   * 학급 목록 조회
   * @returns {Promise<Array>} 학급 배열
   */
  async getClasses() {
    try {
      const classesRef = this.getUserCollection('classes');
      const snapshot = await getDocs(classesRef);

      const classes = [];
      snapshot.forEach((doc) => {
        classes.push({ id: doc.id, ...doc.data() });
      });

      console.log(`✅ 학급 ${classes.length}개 로드 완료`);
      return classes;
    } catch (error) {
      console.error('❌ 학급 로드 실패:', error);
      throw new Error('학급 목록을 불러오는데 실패했습니다.');
    }
  }

  /**
   * 학급 목록 실시간 동기화
   * @param {Function} callback - 업데이트 시 호출될 콜백 함수
   * @returns {Function} unsubscribe 함수
   */
  subscribeToClasses(callback) {
    try {
      const classesRef = this.getUserCollection('classes');
      const q = query(classesRef, orderBy('createdAt', 'asc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const classes = [];
          snapshot.forEach((doc) => {
            classes.push({ id: doc.id, ...doc.data() });
          });

          console.log(`🔄 학급 동기화: ${classes.length}개`);
          callback(classes);
        },
        (error) => {
          console.error('❌ 학급 리스너 오류:', error);
          callback([]);
        }
      );

      this.listeners.classes = unsubscribe;
      return unsubscribe;
    } catch (error) {
      console.error('❌ 학급 동기화 실패:', error);
      throw new Error('학급 동기화에 실패했습니다.');
    }
  }

  /**
   * 학급 정보 수정
   * @param {string} classId - 학급 ID
   * @param {Object} updates - 수정할 데이터
   */
  async updateClass(classId, updates) {
    try {
      const classRef = this.getUserDoc('classes', classId);
      await updateDoc(classRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      console.log('✅ 학급 업데이트 완료:', classId);
    } catch (error) {
      console.error('❌ 학급 업데이트 실패:', error);
      throw new Error('학급 업데이트에 실패했습니다.');
    }
  }

  /**
   * 학급 삭제 (캐스케이드)
   * @param {string} classId - 학급 ID
   */
  async deleteClass(classId) {
    try {
      const batch = writeBatch(this.db);

      // 1. 학급 삭제
      const classRef = this.getUserDoc('classes', classId);
      batch.delete(classRef);

      // 2. 해당 학급의 학생들 classId 필드 제거
      const studentsRef = this.getUserCollection('students');
      const q = query(studentsRef, where('classId', '==', classId));
      const studentsSnapshot = await getDocs(q);

      studentsSnapshot.forEach((studentDoc) => {
        const studentRef = this.getUserDoc('students', studentDoc.id);
        batch.update(studentRef, {
          classId: null,
          className: null,
          updatedAt: serverTimestamp(),
        });
      });

      await batch.commit();
      console.log('✅ 학급 삭제 완료:', classId);
    } catch (error) {
      console.error('❌ 학급 삭제 실패:', error);
      throw new Error('학급 삭제에 실패했습니다.');
    }
  }

  // ============================================
  // 학생 관리 (Students)
  // ============================================

  /**
   * 학생 생성 (학생 코드 자동 발급)
   * @param {Object} studentData - 학생 데이터 { name, classId, className, number, gender }
   * @returns {Promise<string>} studentId
   */
  async createStudent(studentData) {
    try {
      const userId = this.getCurrentUserId();
      const studentsRef = this.getUserCollection('students');
      const newStudentRef = doc(studentsRef);

      // 학생 코드 생성 (6자리 랜덤)
      const studentCode = this.generateStudentCode();

      const student = {
        ...studentData,
        id: newStudentRef.id,
        ownerId: userId,
        studentCode,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(newStudentRef, student);
      console.log('✅ 학생 생성 완료:', newStudentRef.id, '코드:', studentCode);
      return newStudentRef.id;
    } catch (error) {
      console.error('❌ 학생 생성 실패:', error);
      throw new Error('학생 생성에 실패했습니다.');
    }
  }

  /**
   * 학생 코드 생성 (6자리 영숫자)
   * @returns {string} 학생 코드
   */
  generateStudentCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 혼동되는 문자 제외 (I, O, 0, 1)
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  /**
   * 학생 목록 조회
   * @returns {Promise<Array>} 학생 배열
   */
  async getStudents() {
    try {
      const studentsRef = this.getUserCollection('students');
      const snapshot = await getDocs(studentsRef);

      const students = [];
      snapshot.forEach((doc) => {
        students.push({ id: doc.id, ...doc.data() });
      });

      console.log(`✅ 학생 ${students.length}명 로드 완료`);
      return students;
    } catch (error) {
      console.error('❌ 학생 로드 실패:', error);
      throw new Error('학생 목록을 불러오는데 실패했습니다.');
    }
  }

  /**
   * 학생 목록 실시간 동기화
   * @param {Function} callback - 업데이트 시 호출될 콜백 함수
   * @returns {Function} unsubscribe 함수
   */
  subscribeToStudents(callback) {
    try {
      const studentsRef = this.getUserCollection('students');
      const q = query(studentsRef, orderBy('createdAt', 'asc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const students = [];
          snapshot.forEach((doc) => {
            students.push({ id: doc.id, ...doc.data() });
          });

          console.log(`🔄 학생 동기화: ${students.length}명`);
          callback(students);
        },
        (error) => {
          console.error('❌ 학생 리스너 오류:', error);
          callback([]);
        }
      );

      this.unsubscribers.push(unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('❌ 학생 리스너 생성 실패:', error);
      throw new Error('학생 동기화에 실패했습니다.');
    }
  }

  /**
   * 학생 정보 수정
   * @param {string} studentId - 학생 ID
   * @param {Object} updates - 수정할 데이터
   */
  async updateStudent(studentId, updates) {
    try {
      const studentRef = this.getUserDoc('students', studentId);
      await updateDoc(studentRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      console.log('✅ 학생 업데이트 완료:', studentId);
    } catch (error) {
      console.error('❌ 학생 업데이트 실패:', error);
      throw new Error('학생 업데이트에 실패했습니다.');
    }
  }

  /**
   * 학생 삭제 (캐스케이드)
   * @param {string} studentId - 학생 ID
   */
  async deleteStudent(studentId) {
    try {
      const batch = writeBatch(this.db);

      // 1. 학생 문서 삭제
      const studentRef = this.getUserDoc('students', studentId);
      batch.delete(studentRef);

      // 2. studentHistory 삭제
      const historyRef = this.getUserDoc('studentHistory', studentId);
      batch.delete(historyRef);

      // 3. studentBadges 삭제
      const badgesRef = this.getUserDoc('studentBadges', studentId);
      batch.delete(badgesRef);

      await batch.commit();
      console.log('✅ 학생 및 관련 데이터 삭제 완료:', studentId);
    } catch (error) {
      console.error('❌ 학생 삭제 실패:', error);
      throw new Error('학생 삭제에 실패했습니다.');
    }
  }

  // ============================================
  // 세션 관리 (Sessions - 연습/대회)
  // ============================================

  /**
   * 세션 생성
   * @param {Object} sessionData - 세션 데이터 { type, name, eventId, eventName, classId, className, date }
   * @returns {Promise<string>} sessionId
   */
  async createSession(sessionData) {
    try {
      const userId = this.getCurrentUserId();
      const sessionsRef = this.getUserCollection('sessions');
      const newSessionRef = doc(sessionsRef);

      const session = {
        ...sessionData,
        id: newSessionRef.id,
        ownerId: userId,
        status: 'ready', // 'ready' | 'inProgress' | 'finished'
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(newSessionRef, session);
      console.log('✅ 세션 생성 완료:', newSessionRef.id);
      return newSessionRef.id;
    } catch (error) {
      console.error('❌ 세션 생성 실패:', error);
      throw new Error('세션 생성에 실패했습니다.');
    }
  }

  /**
   * 세션 목록 조회
   * @returns {Promise<Array>} 세션 배열
   */
  async getSessions() {
    try {
      const sessionsRef = this.getUserCollection('sessions');
      const q = query(sessionsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      const sessions = [];
      snapshot.forEach((doc) => {
        sessions.push({ id: doc.id, ...doc.data() });
      });

      console.log(`✅ 세션 ${sessions.length}개 로드 완료`);
      return sessions;
    } catch (error) {
      console.error('❌ 세션 로드 실패:', error);
      throw new Error('세션 목록을 불러오는데 실패했습니다.');
    }
  }

  /**
   * 세션 목록 실시간 동기화
   * @param {Function} callback - 업데이트 시 호출될 콜백 함수
   * @returns {Function} unsubscribe 함수
   */
  subscribeToSessions(callback) {
    try {
      const sessionsRef = this.getUserCollection('sessions');
      const q = query(sessionsRef, orderBy('createdAt', 'desc'));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const sessions = [];
          snapshot.forEach((doc) => {
            sessions.push({ id: doc.id, ...doc.data() });
          });

          console.log(`🔄 세션 동기화: ${sessions.length}개`);
          callback(sessions);
        },
        (error) => {
          console.error('❌ 세션 리스너 오류:', error);
          callback([]);
        }
      );

      this.unsubscribers.push(unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('❌ 세션 리스너 생성 실패:', error);
      throw new Error('세션 동기화에 실패했습니다.');
    }
  }

  /**
   * 세션 정보 수정
   * @param {string} sessionId - 세션 ID
   * @param {Object} updates - 수정할 데이터
   */
  async updateSession(sessionId, updates) {
    try {
      const sessionRef = this.getUserDoc('sessions', sessionId);
      await updateDoc(sessionRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
      console.log('✅ 세션 업데이트 완료:', sessionId);
    } catch (error) {
      console.error('❌ 세션 업데이트 실패:', error);
      throw new Error('세션 업데이트에 실패했습니다.');
    }
  }

  /**
   * 세션 삭제
   * @param {string} sessionId - 세션 ID
   */
  async deleteSession(sessionId) {
    try {
      const sessionRef = this.getUserDoc('sessions', sessionId);
      await deleteDoc(sessionRef);
      console.log('✅ 세션 삭제 완료:', sessionId);
    } catch (error) {
      console.error('❌ 세션 삭제 실패:', error);
      throw new Error('세션 삭제에 실패했습니다.');
    }
  }

  // ============================================
  // 기록 관리 (Records)
  // ============================================

  /**
   * 기록 생성 (학생 히스토리 자동 업데이트)
   * @param {Object} recordData - 기록 데이터
   * @returns {Promise<string>} recordId
   */
  async createRecord(recordData) {
    try {
      const userId = this.getCurrentUserId();
      const recordsRef = this.getUserCollection('records');
      const newRecordRef = doc(recordsRef);

      const record = {
        ...recordData,
        id: newRecordRef.id,
        ownerId: userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const batch = writeBatch(this.db);

      // 1. 기록 생성
      batch.set(newRecordRef, record);

      // 2. studentHistory 업데이트
      const historyRef = this.getUserDoc('studentHistory', recordData.studentId);
      const historyDoc = await getDoc(historyRef);

      const existingHistory = historyDoc.exists() ? historyDoc.data() : { records: [] };

      batch.set(
        historyRef,
        {
          studentId: recordData.studentId,
          studentName: recordData.studentName,
          records: [...existingHistory.records, newRecordRef.id],
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      await batch.commit();
      console.log('✅ 기록 생성 및 히스토리 업데이트 완료:', newRecordRef.id);

      // 3. 배지 재계산 (비동기)
      this.updateStudentBadgesFromHistory(recordData.studentId).catch((err) => {
        console.warn(`⚠️ 배지 재계산 실패:`, err);
      });

      return newRecordRef.id;
    } catch (error) {
      console.error('❌ 기록 생성 실패:', error);
      throw new Error('기록 생성에 실패했습니다.');
    }
  }

  /**
   * 세션별 기록 조회
   * @param {string} sessionId - 세션 ID
   * @returns {Promise<Array>} 기록 배열
   */
  async getRecords(sessionId) {
    try {
      const recordsRef = this.getUserCollection('records');
      const q = query(recordsRef, where('sessionId', '==', sessionId));
      const snapshot = await getDocs(q);

      const records = [];
      snapshot.forEach((doc) => {
        records.push({ id: doc.id, ...doc.data() });
      });

      console.log(`✅ 기록 ${records.length}개 로드 완료`);
      return records;
    } catch (error) {
      console.error('❌ 기록 로드 실패:', error);
      throw new Error('기록 목록을 불러오는데 실패했습니다.');
    }
  }

  /**
   * 세션별 기록 실시간 동기화
   * @param {string} sessionId - 세션 ID
   * @param {Function} callback - 업데이트 시 호출될 콜백 함수
   * @returns {Function} unsubscribe 함수
   */
  subscribeToRecords(sessionId, callback) {
    try {
      const recordsRef = this.getUserCollection('records');
      const q = query(recordsRef, where('sessionId', '==', sessionId));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const records = [];
          snapshot.forEach((doc) => {
            records.push({ id: doc.id, ...doc.data() });
          });

          console.log(`🔄 기록 동기화: ${records.length}개`);
          callback(records);
        },
        (error) => {
          console.error('❌ 기록 리스너 오류:', error);
          callback([]);
        }
      );

      this.unsubscribers.push(unsubscribe);
      return unsubscribe;
    } catch (error) {
      console.error('❌ 기록 리스너 생성 실패:', error);
      throw new Error('기록 동기화에 실패했습니다.');
    }
  }

  // ============================================
  // 배지 관리 (Badges)
  // ============================================

  /**
   * 학생 배지 저장
   * @param {string} studentId - 학생 ID
   * @param {Object} badgeData - 배지 데이터
   */
  async saveStudentBadges(studentId, badgeData) {
    try {
      const badgesRef = this.getUserDoc('studentBadges', studentId);
      await setDoc(
        badgesRef,
        {
          ...badgeData,
          studentId,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      console.log('✅ 학생 배지 저장 완료:', studentId);
    } catch (error) {
      console.error('❌ 배지 저장 실패:', error);
      throw new Error('배지 저장에 실패했습니다.');
    }
  }

  /**
   * 학생 배지 조회
   * @param {string} studentId - 학생 ID
   * @returns {Promise<Object>} 배지 데이터
   */
  async getStudentBadges(studentId) {
    try {
      const badgesRef = this.getUserDoc('studentBadges', studentId);
      const badgesDoc = await getDoc(badgesRef);

      if (!badgesDoc.exists()) {
        return { badges: [], badgeOrder: [] };
      }

      return badgesDoc.data();
    } catch (error) {
      console.error('❌ 배지 로드 실패:', error);
      throw new Error('배지를 불러오는데 실패했습니다.');
    }
  }

  /**
   * 히스토리 기반 배지 재계산 (Phase 8에서 구현)
   * @param {string} studentId - 학생 ID
   */
  async updateStudentBadgesFromHistory(studentId) {
    // Phase 8에서 구현 (배지 시스템)
    console.log('🔄 배지 재계산 예정:', studentId);
  }

  // ============================================
  // 리스너 정리
  // ============================================

  /**
   * 모든 리스너 정리 (로그아웃 시 호출)
   */
  unsubscribeAll() {
    this.unsubscribers.forEach((unsubscribe) => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    });
    this.unsubscribers = [];

    Object.values(this.listeners).forEach((unsubscribe) => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    });
    this.listeners = {};

    console.log('✅ 모든 리스너 정리 완료');
  }
}

// 싱글톤 인스턴스 export
const firestoreService = new FirestoreService();
export default firestoreService;
