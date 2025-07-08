
import { TaskData, Accordion } from '@/types/task';

const STORAGE_KEYS = {
  TASK_DATA: 'taskData',
  ACCORDIONS: 'accordions'
};

export const loadFromStorage = async (): Promise<{
  taskData: TaskData;
  accordions: Accordion[];
}> => {
  try {
    const taskDataStr = localStorage.getItem(STORAGE_KEYS.TASK_DATA);
    const accordionsStr = localStorage.getItem(STORAGE_KEYS.ACCORDIONS);
    
    const taskData: TaskData = taskDataStr ? JSON.parse(taskDataStr) : {
      minhasTarefas: [],
      favoritos: [],
      tarefasPorPessoa: {}
    };
    
    const accordions: Accordion[] = accordionsStr ? JSON.parse(accordionsStr) : [
      { id: 'minhas-tarefas', title: 'Minhas Tarefas', isFixed: true, order: 0 },
      { id: 'lista-favoritos', title: 'Lista de Favoritos', isFixed: true, order: 1 }
    ];
    
    return { taskData, accordions };
  } catch (error) {
    console.error('Erro ao carregar dados do localStorage:', error);
    return {
      taskData: {
        minhasTarefas: [],
        favoritos: [],
        tarefasPorPessoa: {}
      },
      accordions: [
        { id: 'minhas-tarefas', title: 'Minhas Tarefas', isFixed: true, order: 0 },
        { id: 'lista-favoritos', title: 'Lista de Favoritos', isFixed: true, order: 1 }
      ]
    };
  }
};

export const saveToStorage = async (taskData: TaskData, accordions: Accordion[]): Promise<void> => {
  try {
    localStorage.setItem(STORAGE_KEYS.TASK_DATA, JSON.stringify(taskData));
    localStorage.setItem(STORAGE_KEYS.ACCORDIONS, JSON.stringify(accordions));
  } catch (error) {
    console.error('Erro ao salvar dados no localStorage:', error);
    throw error;
  }
};
