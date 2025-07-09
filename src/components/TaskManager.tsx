import React, { useState } from 'react';
import { TaskData, Accordion, DragData } from '@/types/task';
import AccordionComponent from './AccordionComponent';
import DropZone from './DropZone';
import { useToast } from '@/hooks/use-toast';

interface TaskManagerProps {
  taskData: TaskData;
  accordions: Accordion[];
  searchTerm: string;
  onDataChange: (taskData: TaskData, accordions: Accordion[]) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({
  taskData,
  accordions,
  searchTerm,
  onDataChange
}) => {
  const [dragData, setDragData] = useState<DragData | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDragStart = (data: DragData) => {
    setDragData(data);
    console.log('Drag started:', data);
  };

  const handleDragEnd = () => {
    setDragData(null);
    setDropTarget(null);
    console.log('Drag ended');
  };

  const handleDragOver = (targetId: string) => {
    if (dragData) {
      setDropTarget(targetId);
    }
  };

  const handleDrop = (targetId: string) => {
    if (!dragData) return;
    
    console.log('Drop:', { dragData, targetId });

    if (dragData.type === 'accordion') {
      handleAccordionDrop(dragData.accordionId!, targetId);
    } else if (dragData.type === 'task') {
      handleTaskDrop(dragData.sourceId, dragData.taskId!, targetId);
    }

    setDragData(null);
    setDropTarget(null);
  };

  const handleAccordionDrop = (sourceId: string, targetId: string) => {
    if (sourceId === targetId) return;

    const newAccordions = [...accordions];
    const sourceIndex = newAccordions.findIndex(acc => acc.id === sourceId);
    const targetIndex = newAccordions.findIndex(acc => acc.id === targetId);

    if (sourceIndex !== -1 && targetIndex !== -1) {
      const [movedAccordion] = newAccordions.splice(sourceIndex, 1);
      newAccordions.splice(targetIndex, 0, movedAccordion);
      
      // Atualizar ordem
      newAccordions.forEach((acc, index) => {
        acc.order = index;
      });

      onDataChange(taskData, newAccordions);
      toast({
        title: "Sucesso",
        description: "Seção movida com sucesso!",
      });
    }
  };

  const handleTaskDrop = (sourceId: string, taskId: string | number, targetId: string) => {
    if (sourceId === targetId) return;
    
    const newTaskData = { ...taskData };
    
    if (sourceId === 'minhas-tarefas' && targetId !== 'minhas-tarefas') {
      // Mover de Minhas Tarefas para outro acordeão
      const taskIndex = newTaskData.minhasTarefas.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        const task = newTaskData.minhasTarefas[taskIndex];
        
        if (targetId === 'lista-favoritos') {
          newTaskData.favoritos.push({ pessoa: 'Minhas Tarefas', tarefa: task.titulo });
        } else {
          if (!newTaskData.tarefasPorPessoa[targetId]) {
            newTaskData.tarefasPorPessoa[targetId] = [];
          }
          newTaskData.tarefasPorPessoa[targetId].push(task.titulo);
        }
        
        newTaskData.minhasTarefas.splice(taskIndex, 1);
      }
    } else if (sourceId !== 'minhas-tarefas' && targetId === 'minhas-tarefas') {
      // Mover para Minhas Tarefas
      let taskTitle = '';
      
      if (sourceId === 'lista-favoritos') {
        const favIndex = newTaskData.favoritos.findIndex(f => f.tarefa === taskId);
        if (favIndex !== -1) {
          taskTitle = newTaskData.favoritos[favIndex].tarefa;
          newTaskData.favoritos.splice(favIndex, 1);
        }
      } else {
        const taskIndex = newTaskData.tarefasPorPessoa[sourceId]?.indexOf(taskId as string);
        if (taskIndex !== undefined && taskIndex !== -1) {
          taskTitle = taskId as string;
          newTaskData.tarefasPorPessoa[sourceId].splice(taskIndex, 1);
        }
      }
      
      if (taskTitle) {
        const newTask = {
          id: Date.now(),
          titulo: taskTitle,
          descricao: `Movida de ${sourceId}`,
          concluida: false,
          dataCreacao: new Date().toLocaleDateString('pt-BR')
        };
        newTaskData.minhasTarefas.push(newTask);
      }
    } else if (sourceId !== 'minhas-tarefas' && targetId !== 'minhas-tarefas' && sourceId !== targetId) {
      // Mover entre acordeões que não são "Minhas Tarefas"
      let taskTitle = '';
      
      if (sourceId === 'lista-favoritos') {
        const favIndex = newTaskData.favoritos.findIndex(f => f.tarefa === taskId);
        if (favIndex !== -1) {
          taskTitle = newTaskData.favoritos[favIndex].tarefa;
          newTaskData.favoritos.splice(favIndex, 1);
        }
      } else {
        const taskIndex = newTaskData.tarefasPorPessoa[sourceId]?.indexOf(taskId as string);
        if (taskIndex !== undefined && taskIndex !== -1) {
          taskTitle = taskId as string;
          newTaskData.tarefasPorPessoa[sourceId].splice(taskIndex, 1);
        }
      }
      
      if (taskTitle) {
        if (targetId === 'lista-favoritos') {
          newTaskData.favoritos.push({ pessoa: sourceId, tarefa: taskTitle });
        } else {
          if (!newTaskData.tarefasPorPessoa[targetId]) {
            newTaskData.tarefasPorPessoa[targetId] = [];
          }
          newTaskData.tarefasPorPessoa[targetId].push(taskTitle);
        }
      }
    }
    
    onDataChange(newTaskData, accordions);
    toast({
      title: "Sucesso",
      description: "Tarefa movida com sucesso!",
    });
  };

  // Função para contar tarefas filtradas por termo de busca
  const getFilteredTaskCount = (accordion: Accordion) => {
    if (!searchTerm) {
      // Se não há busca, retornar contagem total
      if (accordion.id === 'minhas-tarefas') {
        return taskData.minhasTarefas.length;
      } else if (accordion.id === 'lista-favoritos') {
        return taskData.favoritos.length;
      } else {
        return taskData.tarefasPorPessoa[accordion.id]?.length || 0;
      }
    }

    // Se há busca, contar apenas tarefas que correspondem ao termo
    if (accordion.id === 'minhas-tarefas') {
      return taskData.minhasTarefas.filter(task =>
        task.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      ).length;
    } else if (accordion.id === 'lista-favoritos') {
      return taskData.favoritos.filter(fav =>
        fav.tarefa.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fav.pessoa.toLowerCase().includes(searchTerm.toLowerCase())
      ).length;
    } else {
      return (taskData.tarefasPorPessoa[accordion.id] || []).filter(task =>
        task.toLowerCase().includes(searchTerm.toLowerCase())
      ).length;
    }
  };

  // Filtrar acordeões que têm tarefas correspondentes à busca
  const getVisibleAccordions = () => {
    if (!searchTerm) {
      return accordions.sort((a, b) => a.order - b.order);
    }

    return accordions
      .filter(accordion => getFilteredTaskCount(accordion) > 0)
      .sort((a, b) => a.order - b.order);
  };

  const visibleAccordions = getVisibleAccordions();

  console.log('TaskManager - Accordions:', accordions);
  console.log('TaskManager - TaskData:', taskData);
  console.log('TaskManager - Search Term:', searchTerm);
  console.log('TaskManager - Visible Accordions:', visibleAccordions);

  return (
    <div className="space-y-4">
      {visibleAccordions.map((accordion, index) => (
        <div key={accordion.id} className="relative">
          {dragData && dragData.type === 'accordion' && dragData.accordionId !== accordion.id && (
            <DropZone
              isVisible={dropTarget === accordion.id}
              onDrop={() => handleDrop(accordion.id)}
              className="absolute -top-2 left-0 right-0 z-10"
            />
          )}
          
          <AccordionComponent
            accordion={accordion}
            taskData={taskData}
            searchTerm={searchTerm}
            onDataChange={onDataChange}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            isDragging={dragData?.accordionId === accordion.id}
            isDropTarget={dropTarget === accordion.id}
            accordions={accordions}
            filteredTaskCount={getFilteredTaskCount(accordion)}
          />
        </div>
      ))}
      
      {searchTerm && visibleAccordions.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhuma tarefa encontrada para "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
};

export default TaskManager;
