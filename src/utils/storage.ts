
import { TaskData, Accordion } from '@/types/task';

const STORAGE_KEYS = {
  TASK_DATA: 'taskData',
  ACCORDIONS: 'accordions'
};

const getDefaultAccordions = (): Accordion[] => [
  { id: 'minhas-tarefas', title: 'Minhas Tarefas', isFixed: true, order: 0 },
  { id: 'lista-favoritos', title: 'Lista de Favoritos', isFixed: true, order: 1 }
];

const getDefaultTaskData = (): TaskData => ({
  minhasTarefas: [],
  favoritos: [],
  tarefasPorPessoa: {}
});

export const loadFromStorage = async (): Promise<{
  taskData: TaskData;
  accordions: Accordion[];
}> => {
  try {
    const taskDataStr = localStorage.getItem(STORAGE_KEYS.TASK_DATA);
    const accordionsStr = localStorage.getItem(STORAGE_KEYS.ACCORDIONS);
    
    const taskData: TaskData = taskDataStr ? JSON.parse(taskDataStr) : getDefaultTaskData();
    
    let accordions: Accordion[] = accordionsStr ? JSON.parse(accordionsStr) : [];
    
    // Garantir que os acordeões padrão sempre existam
    const defaultAccordions = getDefaultAccordions();
    defaultAccordions.forEach(defaultAcc => {
      const exists = accordions.find(acc => acc.id === defaultAcc.id);
      if (!exists) {
        accordions.push(defaultAcc);
      }
    });
    
    // Ordenar os acordeões
    accordions.sort((a, b) => a.order - b.order);
    
    return { taskData, accordions };
  } catch (error) {
    console.error('Erro ao carregar dados do localStorage:', error);
    return {
      taskData: getDefaultTaskData(),
      accordions: getDefaultAccordions()
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
