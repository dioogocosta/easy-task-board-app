
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Star, 
  Trash2, 
  CheckCircle, 
  Edit3, 
  GripVertical,
  RotateCcw,
  Save,
  X
} from 'lucide-react';
import { TaskData, DragData, Task, Favorito } from '@/types/task';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface TaskItemProps {
  task: Task | Favorito | string;
  accordionId: string;
  taskData: TaskData;
  onDataChange: (taskData: TaskData, accordions: any[]) => void;
  onDragStart: (data: DragData) => void;
  onDragEnd: () => void;
  searchTerm: string;
}

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  accordionId,
  taskData,
  onDataChange,
  onDragStart,
  onDragEnd,
  searchTerm
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const { toast } = useToast();

  const handleDragStart = (e: React.DragEvent) => {
    const taskId = typeof task === 'object' ? 
      ('id' in task ? task.id : task.tarefa) : 
      task;
    
    onDragStart({
      type: 'task',
      sourceId: accordionId,
      taskId: taskId
    });
  };

  const getTaskId = () => {
    if (typeof task === 'object') {
      return 'id' in task ? task.id : task.tarefa;
    }
    return task;
  };

  const getTaskTitle = () => {
    if (typeof task === 'object') {
      return 'titulo' in task ? task.titulo : task.tarefa;
    }
    return task;
  };

  const highlightText = (text: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleEdit = () => {
    if (typeof task === 'object' && 'titulo' in task) {
      setEditTitle(task.titulo);
      setEditDescription(task.descricao || '');
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (accordionId === 'minhas-tarefas' && typeof task === 'object' && 'id' in task) {
      const newTaskData = { ...taskData };
      const taskIndex = newTaskData.minhasTarefas.findIndex(t => t.id === task.id);
      
      if (taskIndex !== -1) {
        newTaskData.minhasTarefas[taskIndex] = {
          ...newTaskData.minhasTarefas[taskIndex],
          titulo: editTitle,
          descricao: editDescription
        };
        
        onDataChange(newTaskData, []);
        toast({
          title: "Sucesso",
          description: "Tarefa atualizada com sucesso!",
        });
      }
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (typeof task === 'object' && 'titulo' in task) {
      setEditTitle(task.titulo);
      setEditDescription(task.descricao || '');
    }
  };

  const handleToggleComplete = () => {
    if (accordionId === 'minhas-tarefas' && typeof task === 'object' && 'id' in task) {
      const newTaskData = { ...taskData };
      const taskIndex = newTaskData.minhasTarefas.findIndex(t => t.id === task.id);
      
      if (taskIndex !== -1) {
        newTaskData.minhasTarefas[taskIndex].concluida = !newTaskData.minhasTarefas[taskIndex].concluida;
        onDataChange(newTaskData, []);
        
        toast({
          title: "Sucesso",
          description: newTaskData.minhasTarefas[taskIndex].concluida ? 
            "Tarefa marcada como concluída!" : 
            "Tarefa reaberta!",
        });
      }
    }
  };

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
      const newTaskData = { ...taskData };
      
      if (accordionId === 'minhas-tarefas' && typeof task === 'object' && 'id' in task) {
        newTaskData.minhasTarefas = newTaskData.minhasTarefas.filter(t => t.id !== task.id);
      } else if (accordionId === 'lista-favoritos' && typeof task === 'object' && 'tarefa' in task) {
        newTaskData.favoritos = newTaskData.favoritos.filter(f => 
          f.tarefa !== task.tarefa || f.pessoa !== task.pessoa
        );
      } else {
        newTaskData.tarefasPorPessoa[accordionId] = newTaskData.tarefasPorPessoa[accordionId].filter(
          t => t !== task
        );
      }
      
      onDataChange(newTaskData, []);
      toast({
        title: "Sucesso",
        description: "Tarefa excluída com sucesso!",
      });
    }
  };

  const handleToggleFavorite = () => {
    const newTaskData = { ...taskData };
    const taskTitle = getTaskTitle();
    
    const existingFav = newTaskData.favoritos.find(f => 
      f.tarefa === taskTitle && f.pessoa === accordionId
    );
    
    if (existingFav) {
      newTaskData.favoritos = newTaskData.favoritos.filter(f => 
        !(f.tarefa === taskTitle && f.pessoa === accordionId)
      );
    } else {
      newTaskData.favoritos.push({
        pessoa: accordionId,
        tarefa: taskTitle
      });
    }
    
    onDataChange(newTaskData, []);
    toast({
      title: "Sucesso",
      description: existingFav ? "Removido dos favoritos!" : "Adicionado aos favoritos!",
    });
  };

  const isFavorited = taskData.favoritos.some(f => 
    f.tarefa === getTaskTitle() && f.pessoa === accordionId
  );

  return (
    <div
      className={cn(
        "flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors",
        typeof task === 'object' && 'concluida' in task && task.concluida && 
        "opacity-60 line-through"
      )}
    >
      <div className="flex items-center flex-1 gap-3">
        <div
          draggable
          onDragStart={handleDragStart}
          onDragEnd={onDragEnd}
          className="cursor-move text-gray-400 hover:text-gray-600"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        
        <div className="flex-1">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Título da tarefa"
              />
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Descrição da tarefa"
                rows={2}
              />
            </div>
          ) : (
            <div>
              <div className="font-medium">
                {highlightText(getTaskTitle())}
              </div>
              {typeof task === 'object' && 'descricao' in task && task.descricao && (
                <div className="text-sm text-gray-600 mt-1">
                  {highlightText(task.descricao)}
                </div>
              )}
              {typeof task === 'object' && 'dataCreacao' in task && (
                <div className="text-xs text-gray-400 mt-1">
                  Criada em: {task.dataCreacao}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-1">
        {isEditing ? (
          <>
            <Button variant="ghost" size="sm" onClick={handleSave}>
              <Save className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <>
            {accordionId === 'minhas-tarefas' && typeof task === 'object' && 'concluida' in task && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleComplete}
                className={cn(
                  task.concluida ? "text-orange-600 hover:text-orange-700" : "text-green-600 hover:text-green-700"
                )}
              >
                {task.concluida ? <RotateCcw className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              </Button>
            )}
            
            {accordionId !== 'lista-favoritos' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleFavorite}
                className={cn(
                  isFavorited ? "text-yellow-500 hover:text-yellow-600" : "text-gray-400 hover:text-gray-600"
                )}
              >
                <Star className={cn("w-4 h-4", isFavorited && "fill-current")} />
              </Button>
            )}
            
            {accordionId === 'minhas-tarefas' && (
              <Button variant="ghost" size="sm" onClick={handleEdit}>
                <Edit3 className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskItem;
