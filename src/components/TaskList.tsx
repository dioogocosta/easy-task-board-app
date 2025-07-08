
import React from 'react';
import { TaskData, DragData } from '@/types/task';
import TaskItem from './TaskItem';

interface TaskListProps {
  accordionId: string;
  taskData: TaskData;
  searchTerm: string;
  onDataChange: (taskData: TaskData, accordions: any[]) => void;
  onDragStart: (data: DragData) => void;
  onDragEnd: () => void;
}

const TaskList: React.FC<TaskListProps> = ({
  accordionId,
  taskData,
  searchTerm,
  onDataChange,
  onDragStart,
  onDragEnd
}) => {
  const getTasks = () => {
    if (accordionId === 'minhas-tarefas') {
      return taskData.minhasTarefas.filter(task =>
        task.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else if (accordionId === 'lista-favoritos') {
      return taskData.favoritos.filter(fav =>
        fav.tarefa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fav.pessoa.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } else {
      return (taskData.tarefasPorPessoa[accordionId] || []).filter(task =>
        task.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  };

  const tasks = getTasks();

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {searchTerm ? 'Nenhuma tarefa encontrada.' : 'Nenhuma tarefa disponível.'}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task, index) => (
        <TaskItem
          key={typeof task === 'object' ? task.id || index : index}
          task={task}
          accordionId={accordionId}
          taskData={taskData}
          onDataChange={onDataChange}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          searchTerm={searchTerm}
        />
      ))}
    </div>
  );
};

export default TaskList;
