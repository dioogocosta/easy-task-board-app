
import React, { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import TaskManager from '@/components/TaskManager';
import FileUpload from '@/components/FileUpload';
import SearchBar from '@/components/SearchBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ExportButtons from '@/components/ExportButtons';
import { TaskData, Accordion } from '@/types/task';
import { loadFromStorage, saveToStorage } from '@/utils/storage';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [accordions, setAccordions] = useState<Accordion[]>([]);
  const [taskData, setTaskData] = useState<TaskData>({
    minhasTarefas: [],
    favoritos: [],
    tarefasPorPessoa: {}
  });
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadFromStorage();
        setTaskData(data.taskData);
        setAccordions(data.accordions);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar dados salvos",
          variant: "destructive",
        });
      }
    };
    loadData();
  }, [toast]);

  const saveData = async (newTaskData: TaskData, newAccordions: Accordion[]) => {
    try {
      await saveToStorage(newTaskData, newAccordions);
      setTaskData(newTaskData);
      setAccordions(newAccordions);
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar dados",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (uploadedData: { [key: string]: string[] }) => {
    const newAccordions = [...accordions];
    const newTaskData = { ...taskData };

    Object.entries(uploadedData).forEach(([person, tasks]) => {
      // Adicionar à lista de tarefas por pessoa
      newTaskData.tarefasPorPessoa[person] = tasks;
      
      // Criar acordeão se não existir
      if (!newAccordions.find(acc => acc.id === person)) {
        newAccordions.push({
          id: person,
          title: person,
          isFixed: false,
          order: newAccordions.length
        });
      }
    });

    saveData(newTaskData, newAccordions);
    toast({
      title: "Sucesso",
      description: "Documento carregado com sucesso!",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <FileUpload onUpload={handleFileUpload} />
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
        
        <ExportButtons taskData={taskData} />
        
        <TaskManager
          taskData={taskData}
          accordions={accordions}
          searchTerm={searchTerm}
          onDataChange={saveData}
        />
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;
