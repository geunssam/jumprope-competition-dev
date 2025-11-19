/**
 * classStatsCalculator.js
 * 학급별 통계를 계산하는 유틸리티 함수
 * 줄넘기 대회 시스템용
 */

/**
 * 학급별 기본 통계 계산 (학생 수, 성별 분포, 코드 발급 여부)
 * @param {Array} classes - 학급 배열
 * @param {Array} students - 학생 배열
 * @returns {Object} - { [classId]: { className, studentCount, maleCount, femaleCount, codeIssuedCount } }
 */
export const calculateAllClassStats = (classes, students) => {
  try {
    const classStatsMap = new Map();

    // 모든 학급 초기화
    classes.forEach((cls) => {
      classStatsMap.set(cls.id, {
        classId: cls.id,
        className: cls.name,
        grade: cls.grade,
        studentCount: 0,
        maleCount: 0,
        femaleCount: 0,
        codeIssuedCount: 0,
      });
    });

    // 학생별로 집계
    students.forEach((student) => {
      const { classId, gender, studentCode } = student;

      if (!classId || !classStatsMap.has(classId)) return;

      const classStats = classStatsMap.get(classId);
      classStats.studentCount += 1;

      // 성별 집계
      if (gender === 'male') {
        classStats.maleCount += 1;
      } else if (gender === 'female') {
        classStats.femaleCount += 1;
      }

      // 코드 발급 여부
      if (studentCode && studentCode.trim() !== '') {
        classStats.codeIssuedCount += 1;
      }
    });

    // Map을 Object로 변환
    const classStatsObject = {};
    classStatsMap.forEach((value, key) => {
      classStatsObject[key] = value;
    });

    console.log('📊 [classStatsCalculator] 학급별 통계 계산 완료:', classStatsObject);

    return classStatsObject;
  } catch (error) {
    console.error('❌ [classStatsCalculator] 학급 통계 계산 실패:', error);
    return {};
  }
};

/**
 * 특정 학급의 통계만 계산
 * @param {Array} classes - 학급 배열
 * @param {Array} students - 학생 배열
 * @param {string} classId - 학급 ID
 * @returns {Object} - { className, studentCount, maleCount, femaleCount, codeIssuedCount }
 */
export const calculateClassStats = (classes, students, classId) => {
  const allStats = calculateAllClassStats(classes, students);
  return (
    allStats[classId] || {
      classId,
      className: '알 수 없음',
      studentCount: 0,
      maleCount: 0,
      femaleCount: 0,
      codeIssuedCount: 0,
    }
  );
};

/**
 * 개별 학생의 기록 통계 계산 (Phase 7 이후에 구현)
 * @param {string} studentId - 학생 ID
 * @param {Array} records - 기록 배열
 * @returns {Object} - { totalRecords, bestScore, averageScore }
 */
export const calculateStudentRecordStats = (studentId, records) => {
  try {
    // Phase 7에서 구현 예정 (기록 시스템 완성 후)
    const studentRecords = records.filter((record) => record.studentId === studentId);

    if (studentRecords.length === 0) {
      return {
        totalRecords: 0,
        bestScore: 0,
        averageScore: 0,
      };
    }

    const scores = studentRecords.map((r) => r.score || 0);
    const totalRecords = studentRecords.length;
    const bestScore = Math.max(...scores);
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / totalRecords;

    return {
      totalRecords,
      bestScore,
      averageScore: Math.round(averageScore * 10) / 10, // 소수점 1자리
    };
  } catch (error) {
    console.error('❌ [classStatsCalculator] 학생 기록 통계 계산 실패:', error);
    return {
      totalRecords: 0,
      bestScore: 0,
      averageScore: 0,
    };
  }
};

/**
 * 학급별 기록 통계 계산 (Phase 7 이후에 구현)
 * @param {Array} students - 학생 배열
 * @param {Array} records - 기록 배열
 * @param {string} classId - 학급 ID
 * @returns {Object} - { totalRecords, averageScore, topStudents }
 */
export const calculateClassRecordStats = (students, records, classId) => {
  try {
    // Phase 7에서 구현 예정
    const classStudents = students.filter((s) => s.classId === classId);
    const classRecords = records.filter((r) =>
      classStudents.some((s) => s.id === r.studentId)
    );

    if (classRecords.length === 0) {
      return {
        totalRecords: 0,
        averageScore: 0,
        topStudents: [],
      };
    }

    const scores = classRecords.map((r) => r.score || 0);
    const totalRecords = classRecords.length;
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / totalRecords;

    // 상위 3명 학생 (추후 구현)
    const topStudents = [];

    return {
      totalRecords,
      averageScore: Math.round(averageScore * 10) / 10,
      topStudents,
    };
  } catch (error) {
    console.error('❌ [classStatsCalculator] 학급 기록 통계 계산 실패:', error);
    return {
      totalRecords: 0,
      averageScore: 0,
      topStudents: [],
    };
  }
};
