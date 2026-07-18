import React, { useState } from 'react';
import QuizSection from './QuizSection';
import QuizModalEditor from './QuizModalEditor';
import ChecklistSection from './ChecklistSection';
import MaterialsSection from './MaterialsSection';

const NodeDetailEditor = ({
  checklists,
  onChecklistsChange,
  materials,
  onMaterialsChange,
  quizzes,
  onQuizzesChange,
  roadmapId,
  nodeId,
  subjectId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);

  const handleAddQuiz = () => {
    setEditingQuiz(null);
    setIsModalOpen(true);
  };

  const handleEditQuiz = (quiz) => {
    setEditingQuiz(quiz);
    setIsModalOpen(true);
  };

  const handleSaveQuiz = (quizData) => {
    if (editingQuiz) {
      // Update existing
      onQuizzesChange(
        quizzes.map((q) => (q === editingQuiz ? { ...quizData, id: q.id } : q))
      );
    } else {
      // Add new
      onQuizzesChange([...(quizzes || []), quizData]);
    }
  };

  const handleDeleteQuiz = (quizToDelete) => {
    onQuizzesChange(quizzes.filter((q) => q !== quizToDelete));
  };

  return (
    <div className="space-y-4">
      <ChecklistSection items={checklists || []} onChange={onChecklistsChange} />
      <MaterialsSection materials={materials || []} onChange={onMaterialsChange} />

      <QuizSection
        quizzes={quizzes || []}
        onAdd={handleAddQuiz}
        onEdit={handleEditQuiz}
        onDelete={handleDeleteQuiz}
      />

      <QuizModalEditor
        key={editingQuiz ? `edit-${editingQuiz.id || 'temp'}` : 'new'}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveQuiz}
        initialData={editingQuiz}
        roadmapId={roadmapId}
        subjectId={subjectId}
      />
    </div>
  );
};

export default NodeDetailEditor;
