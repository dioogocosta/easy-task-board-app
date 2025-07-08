
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onUpload: (data: { [key: string]: string[] }) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.docx')) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos .docx",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simular extração de texto do Word focando em títulos em azul
      // Em uma implementação real, você usaria mammoth.js ou similar
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          // Aqui você integraria com mammoth.js para extrair corretamente
          // os títulos em azul do documento Word
          const mockData = await extractTitlesFromWord(e.target?.result as ArrayBuffer);
          onUpload(mockData);
        } catch (error) {
          console.error('Erro ao processar arquivo:', error);
          toast({
            title: "Erro",
            description: "Erro ao processar documento Word",
            variant: "destructive",
          });
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Erro ao ler arquivo:', error);
      toast({
        title: "Erro",
        description: "Erro ao ler arquivo",
        variant: "destructive",
      });
    }

    // Limpar o input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Função mock para extrair títulos - substitua pela integração real com mammoth.js
  const extractTitlesFromWord = async (arrayBuffer: ArrayBuffer): Promise<{ [key: string]: string[] }> => {
    // Simular processamento
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - em produção, use mammoth.js para extrair títulos em azul
    return {
      "João Silva": ["Revisar relatório financeiro", "Preparar apresentação", "Reunião com cliente"],
      "Maria Santos": ["Atualizar website", "Testar nova funcionalidade", "Documentar processo"],
      "Pedro Costa": ["Análise de dados", "Criar dashboard", "Treinar equipe"]
    };
  };

  return (
    <div className="flex-1 min-w-[200px]">
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx"
        onChange={handleFileChange}
        className="hidden"
        id="file-upload"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        <Upload className="w-4 h-4 mr-2" />
        Upload Document
      </Button>
    </div>
  );
};

export default FileUpload;
