
export interface Task {
  id: number;
  titulo: string;
  descricao: string;
  concluida: boolean;
  dataCreacao: string;
}

export interface Favorito {
  pessoa: string;
  tarefa: string;
}

export interface TaskData {
  minhasTarefas: Task[];
  favoritos: Favorito[];
  tarefasPorPessoa: { [key: string]: string[] };
}

export interface Accordion {
  id: string;
  title: string;
  isFixed: boolean;
  order: number;
}

export interface DragData {
  type: 'task' | 'accordion';
  sourceId: string;
  taskId?: string | number;
  accordionId?: string;
}
