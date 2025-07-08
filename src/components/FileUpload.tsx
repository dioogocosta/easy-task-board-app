
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import mammoth from 'mammoth';

interface FileUploadProps {
  onUpload: (data: { [key: string]: string[] }) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = () => {
    fileInputRef.current?.click();
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

        // Detectar títulos (nomes de pessoas) - texto em azul no Word geralmente são títulos
        // Assumindo que títulos são linhas que começam com maiúscula e não contêm dois pontos
        if (/^[A-ZÁÉÍÓÚÃÕÇ][a-záéíóúãõç\s]+$/.test(trimmedLine) && !trimmedLine.includes(':')) {
          currentPerson = trimmedLine;
          processedData[currentPerson] = [];
        } else if (currentPerson && trimmedLine) {
          // Adicionar tarefa à pessoa atual
          processedData[currentPerson].push(trimmedLine);
        }
      }

      if (Object.keys(processedData).length === 0) {
        toast({
          title: "Aviso",
          description: "Nenhum dado foi encontrado no arquivo. Verifique o formato.",
          variant: "destructive",
        });
        return;
      }

      onUpload(processedData);
      
      toast({
        title: "Sucesso",
        description: `Arquivo processado! Encontradas ${Object.keys(processedData).length} seções.`,
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
