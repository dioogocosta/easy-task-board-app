
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import * as mammoth from 'mammoth';

interface FileUploadProps {
  onUpload: (data: { [key: string]: string[] }) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const isValidTitle = (line: string): boolean => {
    // Critérios mais rigorosos para identificar títulos
    const trimmedLine = line.trim();
    
    // Não pode estar vazio
    if (!trimmedLine) return false;
    
    // Não pode conter certas palavras/frases que indicam conteúdo
    const excludePatterns = [
      /ver\s+questão/i,
      /ver\s+permissões/i,
      /questão\s+financeira/i,
      /painel\s+da\s+mensageria/i,
      /novo\s+painel/i,
      /\d+\s*\)/,  // números com parênteses como "1)"
      /^\d+\./,    // números com ponto como "1."
      /^\-/,       // linhas que começam com hífen
      /^\*/,       // linhas que começam com asterisco
      /:/,         // linhas que contêm dois pontos
      /;/,         // linhas que contêm ponto e vírgula
    ];
    
    // Verificar se a linha contém padrões excluídos
    if (excludePatterns.some(pattern => pattern.test(trimmedLine))) {
      return false;
    }
    
    // Deve ser relativamente curto (títulos geralmente são concisos)
    if (trimmedLine.length > 80) return false;
    
    // Deve começar com letra maiúscula
    if (!/^[A-ZÁÉÍÓÚÃÕÇ]/.test(trimmedLine)) return false;
    
    // Não deve ter muitos caracteres especiais
    const specialCharCount = (trimmedLine.match(/[^\w\sÀ-ÿ]/g) || []).length;
    if (specialCharCount > 2) return false;
    
    // Deve conter pelo menos 2 caracteres alfabéticos
    const letterCount = (trimmedLine.match(/[A-Za-zÀ-ÿ]/g) || []).length;
    if (letterCount < 2) return false;
    
    return true;
  };

  const isValidTask = (line: string): boolean => {
    const trimmedLine = line.trim();
    
    // Não pode estar vazio
    if (!trimmedLine) return false;
    
    // Não pode ser muito curto (menos de 3 caracteres)
    if (trimmedLine.length < 3) return false;
    
    // Deve conter pelo menos uma letra
    if (!/[A-Za-zÀ-ÿ]/.test(trimmedLine)) return false;
    
    return true;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      const lines = result.value.split('\n');
      const processedData: { [key: string]: string[] } = {};
      let currentPerson = '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        if (isValidTitle(trimmedLine)) {
          // Se já temos uma pessoa e ela tem tarefas, mantemos
          if (currentPerson && processedData[currentPerson]?.length > 0) {
            currentPerson = trimmedLine;
            processedData[currentPerson] = [];
          } else {
            // Se a pessoa anterior não tem tarefas, removemos ela
            if (currentPerson && (!processedData[currentPerson] || processedData[currentPerson].length === 0)) {
              delete processedData[currentPerson];
            }
            currentPerson = trimmedLine;
            processedData[currentPerson] = [];
          }
        } else if (currentPerson && isValidTask(trimmedLine)) {
          // Adicionar tarefa à pessoa atual
          processedData[currentPerson].push(trimmedLine);
        }
      }

      // Remover pessoas sem tarefas no final
      Object.keys(processedData).forEach(person => {
        if (!processedData[person] || processedData[person].length === 0) {
          delete processedData[person];
        }
      });

      if (Object.keys(processedData).length === 0) {
        toast({
          title: "Aviso",
          description: "Nenhum dado válido foi encontrado no arquivo. Verifique o formato.",
          variant: "destructive",
        });
        return;
      }

      onUpload(processedData);
      
      const totalTasks = Object.values(processedData).reduce((sum, tasks) => sum + tasks.length, 0);
      toast({
        title: "Sucesso",
        description: `Arquivo processado! Encontradas ${Object.keys(processedData).length} seções com ${totalTasks} tarefas.`,
      });

      // Limpar input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      toast({
        title: "Erro",
        description: "Erro ao processar o arquivo Word. Verifique se o arquivo está correto.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-1 min-w-[200px]">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".docx"
        className="hidden"
      />
      <Button
        onClick={handleFileSelect}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        <Upload className="w-4 h-4 mr-2" />
        Carregar Documento Word
      </Button>
    </div>
  );
};

export default FileUpload;
