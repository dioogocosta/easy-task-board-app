import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Edit3, GripVertical, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TaskData, Accordion, DragData } from '@/types/task';
import TaskList from './TaskList';
import NewTaskForm from './NewTaskForm';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AccordionComponentProps {
  accordion: Accordion;
  taskData: TaskData;
  searchTerm: string;
  onDataChange: (taskData: TaskData, accordions: Accordion[]) => void;
  onDragStart: (data: DragData) => void;
  onDragEnd: () => void;
  onDragOver: (targetId: string) => void;
  onDrop: (targetId: string) => void;
  isDragging: boolean;
  isDropTarget: boolean;
}

const AccordionComponent: React.FC<AccordionComponentProps> = ({
  accordion,
  taskData,
  searchTerm,
  onDataChange,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragging,
  isDropTarget
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(accordion.title);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const { toast } = useToast();

  const handleDragStart = (e: React.DragEvent) => {
    if (accordion.isFixed) return;
    
    onDragStart({
      type: 'accordion',
      sourceId: accordion.id,
      accordionId: accordion.id
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    onDragOver(accordion.id);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onDrop(accordion.id);
  };

  const handleTitleEdit = () => {
    if (accordion.isFixed) return;
    setIsEditing(true);
  };

  const handleTitleSave = () => {
    if (editingTitle.trim() && editingTitle !== accordion.title) {
      // Implementar lógica de renomeação
      const newTaskData = { ...taskData };
      const newAccordions = [accordion]; // Simplificado por agora
      
      if (newTaskData.tarefasPorPessoa[accordion.id]) {
        newTaskData.tarefasPorPessoa[editingTitle] = newTaskData.tarefasPorPessoa[accordion.id];
        delete newTaskData.tarefasPorPessoa[accordion.id];
      }
      
      onDataChange(newTaskData, newAccordions);
    }
    setIsEditing(false);
  };

  const handleTitleCancel = () => {
    setEditingTitle(accordion.title);
    setIsEditing(false);
  };

  const handleNewTask = (titulo: string, descricao: string) => {
    const newTaskData = { ...taskData };
    
    if (accordion.id === 'minhas-tarefas') {
      const newTask = {
        id: Date.now(),
        titulo,
        descricao,
        concluida: false,
        dataCreacao: new Date().toLocaleDateString('pt-BR')
      };
      newTaskData.minhasTarefas.push(newTask);
      
      onDataChange(newTaskData, []);
      setShowNewTaskForm(false);
      
      toast({
        title: "Sucesso!",
        description: "Nova tarefa criada com sucesso.",
      });
    }
  };

  const getTaskCount = () => {
    if (accordion.id === 'minhas-tarefas') {
      return taskData.minhasTarefas.length;
    } else if (accordion.id === 'lista-favoritos') {
      return taskData.favoritos.length;
    } else {
      return taskData.tarefasPorPessoa[accordion.id]?.length || 0;
    }
  };

  return (
    <div
      className={cn(
        "bg-white rounded-lg shadow-sm border transition-all duration-200",
        isDragging && "opacity-50 scale-95",
        isDropTarget && "ring-2 ring-blue-500 ring-opacity-50"
      )}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center flex-1">
          {!accordion.isFixed && (
            <div
              draggable
              onDragStart={handleDragStart}
              onDragEnd={onDragEnd}
              className="cursor-move mr-3 p-1 hover:bg-blue-700 rounded"
            >
              <GripVertical className="w-4 h-4" />
            </div>
          )}
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center flex-1 text-left"
          >
            {isOpen ? (
              <ChevronDown className="w-5 h-5 mr-2" />
            ) : (
              <ChevronRight className="w-5 h-5 mr-2" />
            )}
            
            {isEditing ? (
              <div className="flex items-center flex-1" onClick={(e) => e.stopPropagation()}>
                <Input
                  value={editingTitle}
                  onChange={(e) => setEditingTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleTitleSave();
                    if (e.key === 'Escape') handleTitleCancel();
                  }}
                  className="bg-transparent border-white text-white placeholder-blue-200"
                  autoFocus
                />
              </div>
            ) : (
              <span className="font-semibold">
                {accordion.title} ({getTaskCount()})
              </span>
            )}
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          {!accordion.isFixed && !isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleTitleEdit}
              className="text-white hover:bg-blue-700 p-2"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
          )}
          
          {accordion.id === 'minhas-tarefas' && (
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "text-white hover:bg-blue-700 transition-colors",
                showNewTaskForm && "bg-blue-700"
              )}
              onClick={() => setShowNewTaskForm(!showNewTaskForm)}
            >
              <Plus className="w-4 h-4 mr-1" />
              {showNewTaskForm ? 'Cancelar' : 'Nova Tarefa'}
            </Button>
          )}
        </div>
      </div>
      
      {isOpen && (
        <div className="p-4">
          {showNewTaskForm && accordion.id === 'minhas-tarefas' && (
            <NewTaskForm
              onSave={handleNewTask}
              onCancel={() => setShowNewTaskForm(false)}
            />
          )}
          
          <TaskList
            accordionId={accordion.id}
            taskData={taskData}
            searchTerm={searchTerm}
            onDataChange={onDataChange}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          />
        </div>
      )}
    </div>
  );
};

export default AccordionComponent;
