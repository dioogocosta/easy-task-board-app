
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, FileText, Database, Upload, RotateCcw } from 'lucide-react';
import { TaskData } from '@/types/task';
import { useToast } from '@/hooks/use-toast';

interface ExportButtonsProps {
  taskData: TaskData;
  onRestoreBackup: (backupData: TaskData) => void;
}

const ExportButtons: React.FC<ExportButtonsProps> = ({ taskData, onRestoreBackup }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportFavoritosJSON = () => {
    const exportData = {
      favoritos: taskData.favoritos,
      minhasTarefas: taskData.minhasTarefas,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "favoritos_e_minhas_tarefas.json";
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Sucesso",
      description: "Favoritos e Minhas Tarefas exportados!",
    });
  };

  const exportFavoritosCSV = () => {
    let csv = "Responsável,Tarefa\n";
    taskData.favoritos.forEach(({ pessoa, tarefa }) => {
      csv += `"${pessoa}","${tarefa.replace(/"/g, '""')}"\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "favoritos.csv";
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Sucesso",
      description: "Favoritos exportados em CSV!",
    });
  };

  const exportDatabase = () => {
    const backup = {
      ...taskData,
      timestamp: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tarefas_segunda_backup.json";
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Sucesso",
      description: "Backup criado com sucesso!",
    });
  };

  const handleRestoreClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const backupData = JSON.parse(text);
      
      // Validar se é um backup válido
      if (!backupData.minhasTarefas && !backupData.favoritos && !backupData.tarefasPorPessoa) {
        throw new Error('Formato de backup inválido');
      }

      onRestoreBackup(backupData);
      
      toast({
        title: "Sucesso",
        description: "Backup restaurado com sucesso!",
      });

      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      toast({
        title: "Erro",
        description: "Erro ao restaurar backup. Verifique se o arquivo está correto.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json"
        className="hidden"
      />
      
      <Button onClick={exportFavoritosJSON} variant="default">
        <FileText className="w-4 h-4 mr-2" />
        Exportar Favoritos + Minhas Tarefas (JSON)
      </Button>
      <Button onClick={exportFavoritosCSV} variant="default">
        <Download className="w-4 h-4 mr-2" />
        Exportar Favoritos (CSV)
      </Button>
      <Button onClick={exportDatabase} variant="default" className="bg-green-600 hover:bg-green-700">
        <Database className="w-4 h-4 mr-2" />
        Backup Completo
      </Button>
      <Button onClick={handleRestoreClick} variant="default" className="bg-orange-600 hover:bg-orange-700">
        <RotateCcw className="w-4 h-4 mr-2" />
        Restaurar Backup
      </Button>
    </div>
  );
};

export default ExportButtons;
