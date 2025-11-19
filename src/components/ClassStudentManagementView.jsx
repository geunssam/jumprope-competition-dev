import { useState, useEffect, useMemo } from 'react';
import { useRecord } from '../contexts/RecordContext';
import { useAuth } from '../contexts/AuthContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, Trash2, GripVertical, Edit2, Users, Code } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import DeleteConfirmModal from './DeleteConfirmModal';
import AddStudentModal from './AddStudentModal';
import StudentCodeListModal from './StudentCodeListModal';
import toast from 'react-hot-toast';

/**
 * SortableStudentCard
 * 드래그 가능한 학생 카드
 */
const SortableStudentCard = ({ student, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(student.name);
  const [editedGender, setEditedGender] = useState(student.gender || 'male');

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: student.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
  };

  const handleSave = () => {
    if (!editedName.trim()) {
      toast.error('이름을 입력해주세요.');
      return;
    }

    onEdit(student.id, {
      name: editedName.trim(),
      gender: editedGender,
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(student.name);
    setEditedGender(student.gender || 'male');
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative p-4 bg-white border-2 rounded-lg transition-all hover:shadow-md ${
        isDragging ? 'opacity-50 border-blue-400 shadow-lg' : 'border-gray-200'
      }`}
    >
      {/* 드래그 핸들 */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 cursor-move text-gray-400 hover:text-gray-600 transition-colors"
      >
        <GripVertical className="w-4 h-4" />
      </div>

      {/* 번호 배지 */}
      <div className="absolute top-2 right-2">
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 font-bold text-sm px-2 py-0.5">
          #{student.number}
        </Badge>
      </div>

      {/* 학생 정보 */}
      <div className="mt-6 space-y-2">
        {isEditing ? (
          // 편집 모드
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-gray-600">이름</Label>
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="mt-1 h-9 text-sm"
                autoFocus
              />
            </div>

            <div>
              <Label className="text-xs text-gray-600">성별</Label>
              <Select value={editedGender} onValueChange={setEditedGender}>
                <SelectTrigger className="mt-1 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">남학생</SelectItem>
                  <SelectItem value="female">여학생</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-1.5 pt-1">
              <Button
                size="sm"
                onClick={handleSave}
                className="flex-1 h-8 text-xs"
              >
                저장
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 h-8 text-xs"
              >
                취소
              </Button>
            </div>
          </div>
        ) : (
          // 보기 모드
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-800">
                  {student.name}
                </span>
                <span className="text-xl">
                  {student.gender === 'female' ? '👧' : '👦'}
                </span>
              </div>
            </div>

            {student.studentCode && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Code className="w-3 h-3" />
                <span className="font-mono">{student.studentCode}</span>
              </div>
            )}

            <div className="flex gap-1.5 mt-3 pt-3 border-t">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="flex-1 h-8 text-xs gap-1"
              >
                <Edit2 className="w-3 h-3" />
                수정
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDelete(student)}
                className="flex-1 h-8 text-xs gap-1 text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              >
                <Trash2 className="w-3 h-3" />
                삭제
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/**
 * ClassCard
 * 학급 카드 컴포넌트 (좌측 사이드바)
 */
const ClassCard = ({ classData, isSelected, onClick, onEdit, onDelete, studentCount }) => {
  return (
    <div
      onClick={onClick}
      className={`p-3 border-2 rounded-lg cursor-pointer transition-all ${
        isSelected
          ? 'bg-blue-50 border-blue-400 shadow-md'
          : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm text-gray-800 truncate">
            {classData.name}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {classData.grade}학년 {classData.classNumber}반
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-gray-600">
          <Users className="w-3 h-3" />
          <span>{studentCount}명</span>
        </div>

        <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            size="sm"
            variant="ghost"
            onClick={onEdit}
            className="h-6 w-6 p-0"
          >
            <Edit2 className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={onDelete}
            className="h-6 w-6 p-0 text-rose-600 hover:text-rose-700"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

/**
 * CreateClassModal
 * 학급 생성/수정 모달
 */
const CreateClassModal = ({ open, onOpenChange, onSubmit, editingClass }) => {
  const [className, setClassName] = useState('');
  const [grade, setGrade] = useState('3');
  const [classNumber, setClassNumber] = useState('1');

  useEffect(() => {
    if (editingClass) {
      setClassName(editingClass.name);
      setGrade(String(editingClass.grade));
      setClassNumber(String(editingClass.classNumber));
    } else {
      setClassName('');
      setGrade('3');
      setClassNumber('1');
    }
  }, [editingClass, open]);

  const handleSubmit = () => {
    if (!className.trim()) {
      toast.error('학급명을 입력해주세요.');
      return;
    }

    onSubmit({
      name: className.trim(),
      grade: Number(grade),
      classNumber: Number(classNumber),
    });

    setClassName('');
    setGrade('3');
    setClassNumber('1');
    onOpenChange(false); // 모달 닫기
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editingClass ? '학급 수정' : '학급 추가'}</DialogTitle>
          <DialogDescription>
            학급 정보를 입력하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="className">학급명 *</Label>
            <Input
              id="className"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              placeholder="예: 3학년 1반"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-2">
              <Label htmlFor="grade">학년 *</Label>
              <Select value={grade} onValueChange={setGrade}>
                <SelectTrigger id="grade">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1학년</SelectItem>
                  <SelectItem value="2">2학년</SelectItem>
                  <SelectItem value="3">3학년</SelectItem>
                  <SelectItem value="4">4학년</SelectItem>
                  <SelectItem value="5">5학년</SelectItem>
                  <SelectItem value="6">6학년</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="classNumber">반 *</Label>
              <Select value={classNumber} onValueChange={setClassNumber}>
                <SelectTrigger id="classNumber">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={String(num)}>
                      {num}반
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            취소
          </Button>
          <Button onClick={handleSubmit}>
            {editingClass ? '수정' : '추가'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/**
 * ClassStudentManagementView
 * 학급/학생 관리 메인 컴포넌트
 */
export default function ClassStudentManagementView() {
  const { user } = useAuth();
  const {
    classes,
    students,
    createClass,
    updateClass,
    deleteClass,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentsByClass,
    saveStatus,
  } = useRecord();

  // 상태 관리
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [codeListModalOpen, setCodeListModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeId, setActiveId] = useState(null);

  // DnD Kit 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // 선택된 학급
  const selectedClass = useMemo(() => {
    return classes.find((c) => c.id === selectedClassId) || null;
  }, [classes, selectedClassId]);

  // 선택된 학급의 학생 목록 (번호순 정렬)
  const classStudents = useMemo(() => {
    if (!selectedClassId) return [];
    return getStudentsByClass(selectedClassId).sort((a, b) => a.number - b.number);
  }, [selectedClassId, students, getStudentsByClass]);

  // 학급별 학생 수
  const studentCountByClass = useMemo(() => {
    const counts = {};
    students.forEach((student) => {
      if (student.classId) {
        counts[student.classId] = (counts[student.classId] || 0) + 1;
      }
    });
    return counts;
  }, [students]);

  // 첫 번째 학급 자동 선택
  useEffect(() => {
    if (classes.length > 0 && !selectedClassId) {
      setSelectedClassId(classes[0].id);
    }
  }, [classes, selectedClassId]);

  // ============================================
  // 학급 관리 함수
  // ============================================

  const handleCreateClass = () => {
    setEditingClass(null);
    setClassModalOpen(true);
  };

  const handleEditClass = (classData) => {
    setEditingClass(classData);
    setClassModalOpen(true);
  };

  const handleClassSubmit = async (classData) => {
    try {
      if (editingClass) {
        // 수정
        await updateClass(editingClass.id, classData);
        toast.success('학급이 수정되었습니다.');
      } else {
        // 생성
        const classId = await createClass({
          ...classData,
          userId: user.uid,
          createdAt: new Date().toISOString(),
        });
        toast.success('학급이 추가되었습니다.');
        setSelectedClassId(classId);
      }
      setClassModalOpen(false);
    } catch (error) {
      console.error('학급 저장 실패:', error);
      toast.error('학급 저장에 실패했습니다.');
    }
  };

  const handleDeleteClass = (classData) => {
    const studentCount = studentCountByClass[classData.id] || 0;
    setDeleteTarget({
      type: 'class',
      data: classData,
      items: studentCount > 0
        ? [`${studentCount}명의 학생`]
        : [],
    });
    setDeleteModalOpen(true);
  };

  // ============================================
  // 학생 관리 함수
  // ============================================

  const handleAddStudents = async (newStudents) => {
    if (!selectedClassId) {
      toast.error('학급을 먼저 선택해주세요.');
      return;
    }

    try {
      for (const studentData of newStudents) {
        await createStudent({
          ...studentData,
          classId: selectedClassId,
          className: selectedClass.name,
          userId: user.uid,
          createdAt: new Date().toISOString(),
        });
      }

      toast.success(`${newStudents.length}명의 학생이 추가되었습니다.`);
    } catch (error) {
      console.error('학생 추가 실패:', error);
      toast.error('학생 추가에 실패했습니다.');
    }
  };

  const handleEditStudent = async (studentId, updates) => {
    try {
      await updateStudent(studentId, updates);
      toast.success('학생 정보가 수정되었습니다.');
    } catch (error) {
      console.error('학생 수정 실패:', error);
      toast.error('학생 수정에 실패했습니다.');
    }
  };

  const handleDeleteStudent = (student) => {
    setDeleteTarget({
      type: 'student',
      data: student,
      items: [],
    });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);

    try {
      if (deleteTarget.type === 'class') {
        // 학급 삭제 (학생도 함께 삭제)
        const classId = deleteTarget.data.id;
        const studentsToDelete = getStudentsByClass(classId);

        // 학생 먼저 삭제
        for (const student of studentsToDelete) {
          await deleteStudent(student.id);
        }

        // 학급 삭제
        await deleteClass(classId);

        toast.success('학급이 삭제되었습니다.');

        // 다른 학급 선택
        const remainingClasses = classes.filter((c) => c.id !== classId);
        if (remainingClasses.length > 0) {
          setSelectedClassId(remainingClasses[0].id);
        } else {
          setSelectedClassId(null);
        }
      } else if (deleteTarget.type === 'student') {
        // 학생 삭제
        await deleteStudent(deleteTarget.data.id);
        toast.success('학생이 삭제되었습니다.');

        // 번호 재정렬은 삭제 후 리스너가 업데이트된 후 자동으로 처리됨
        // reorderStudentNumbers는 드래그앤드롭에서만 사용
      }

      // 삭제 완료 후 상태 초기화
      setIsDeleting(false);
      setDeleteModalOpen(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error('삭제 실패:', error);
      toast.error('삭제에 실패했습니다.');
      setIsDeleting(false);
    }
  };

  // ============================================
  // 드래그앤드롭 함수
  // ============================================

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    const oldIndex = classStudents.findIndex((s) => s.id === active.id);
    const newIndex = classStudents.findIndex((s) => s.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newOrder = arrayMove(classStudents, oldIndex, newIndex);

      // 번호 재부여
      for (let i = 0; i < newOrder.length; i++) {
        const student = newOrder[i];
        if (student.number !== i + 1) {
          await updateStudent(student.id, { number: i + 1 });
        }
      }

      toast.success('학생 순서가 변경되었습니다.');
    }

    setActiveId(null);
  };

  // 번호 재정렬
  const reorderStudentNumbers = async () => {
    const sortedStudents = [...classStudents].sort((a, b) => a.number - b.number);

    for (let i = 0; i < sortedStudents.length; i++) {
      const student = sortedStudents[i];
      const newNumber = i + 1;

      if (student.number !== newNumber) {
        await updateStudent(student.id, { number: newNumber });
      }
    }
  };

  // ============================================
  // UI 렌더링
  // ============================================

  const activeStudent = classStudents.find((s) => s.id === activeId);

  return (
    <div className="flex h-full bg-gray-50">
      {/* 좌측: 학급 목록 */}
      <div className="w-72 border-r bg-white p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">학급 목록</h2>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300">
            {classes.length}개
          </Badge>
        </div>

        <Button
          onClick={handleCreateClass}
          className="w-full mb-3 gap-2"
        >
          <Plus className="w-4 h-4" />
          학급 추가
        </Button>

        <div className="space-y-2">
          {classes.map((classData) => (
            <ClassCard
              key={classData.id}
              classData={classData}
              isSelected={selectedClassId === classData.id}
              onClick={() => setSelectedClassId(classData.id)}
              onEdit={() => handleEditClass(classData)}
              onDelete={() => handleDeleteClass(classData)}
              studentCount={studentCountByClass[classData.id] || 0}
            />
          ))}

          {classes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">학급을 추가해주세요</p>
            </div>
          )}
        </div>
      </div>

      {/* 우측: 학생 목록 */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedClass ? (
          <>
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedClass.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedClass.grade}학년 {selectedClass.classNumber}반 · {classStudents.length}명
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCodeListModalOpen(true)}
                  className="gap-2"
                >
                  <Code className="w-4 h-4" />
                  학생 코드 발급
                </Button>
                <Button
                  onClick={() => setAddStudentModalOpen(true)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  학생 추가
                </Button>
              </div>
            </div>

            {/* 학생 그리드 */}
            {classStudents.length > 0 ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext items={classStudents.map((s) => s.id)} strategy={rectSortingStrategy}>
                  <div className="grid grid-cols-4 gap-4">
                    {classStudents.map((student) => (
                      <SortableStudentCard
                        key={student.id}
                        student={student}
                        onEdit={handleEditStudent}
                        onDelete={handleDeleteStudent}
                      />
                    ))}
                  </div>
                </SortableContext>

                <DragOverlay>
                  {activeStudent ? (
                    <div className="p-4 bg-white border-2 border-blue-400 rounded-lg shadow-lg">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-300 font-bold">
                        #{activeStudent.number}
                      </Badge>
                      <div className="mt-2">
                        <span className="text-lg font-bold">{activeStudent.name}</span>
                        <span className="ml-2 text-xl">
                          {activeStudent.gender === 'female' ? '👧' : '👦'}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            ) : (
              <div className="text-center py-16 text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">학생을 추가해주세요</p>
                <p className="text-sm mt-1">드래그앤드롭으로 순서를 변경할 수 있습니다</p>
              </div>
            )}

            {/* 저장 상태 표시 */}
            {saveStatus === 'saving' && (
              <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="text-sm font-medium">저장 중...</span>
              </div>
            )}

            {saveStatus === 'saved' && (
              <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in-out">
                <span className="text-sm font-medium">✓ 저장 완료</span>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <Users className="w-24 h-24 mx-auto mb-4 opacity-20" />
              <p className="text-xl font-medium">학급을 선택해주세요</p>
              <p className="text-sm mt-2">좌측에서 학급을 선택하거나 새로 추가하세요</p>
            </div>
          </div>
        )}
      </div>

      {/* 모달들 */}
      <CreateClassModal
        open={classModalOpen}
        onOpenChange={setClassModalOpen}
        onSubmit={handleClassSubmit}
        editingClass={editingClass}
      />

      <AddStudentModal
        open={addStudentModalOpen}
        onOpenChange={setAddStudentModalOpen}
        onAddStudents={handleAddStudents}
        currentStudentCount={classStudents.length}
      />

      <StudentCodeListModal
        open={codeListModalOpen}
        onOpenChange={setCodeListModalOpen}
      />

      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleConfirmDelete}
        title={deleteTarget?.type === 'class' ? '학급 삭제' : '학생 삭제'}
        itemName={deleteTarget?.data?.name || ''}
        deletedItems={deleteTarget?.items || []}
        isDeleting={isDeleting}
      />
    </div>
  );
}
