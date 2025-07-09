
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';

interface NewTaskFormProps {
  onSave: (titulo: string, descricao: string) => void;
  onCancel: () => void;
}

const NewTaskForm: React.FC<NewTaskFormProps> = ({ onSave, onCancel }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (titulo.trim()) {
      setIsSubmitting(true);
      try {
        onSave(titulo.trim(), descricao.trim());
        setTitulo('');
        setDescricao('');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    setTitulo('');
    setDescricao('');
    onCancel();
  };

  return (
    <Card className="mb-4 border-dashed border-2 border-blue-300 bg-blue-50/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2 text-blue-700">
          <Plus className="w-5 h-5" />
          Nova Tarefa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="titulo" className="text-sm font-medium text-gray-700">
              Título da Tarefa *
            </label>
            <Input
              id="titulo"
              type="text"
              placeholder="Digite o título da tarefa..."
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className="w-full"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="descricao" className="text-sm font-medium text-gray-700">
              Descrição (opcional)
            </label>
            <Textarea
              id="descricao"
              placeholder="Adicione detalhes sobre a tarefa..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              className="w-full resize-none"
              disabled={isSubmitting}
            />
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button 
              type="submit" 
              className="bg-green-600 hover:bg-green-700 text-white flex-1"
              disabled={!titulo.trim() || isSubmitting}
            >
              {isSubmitting ? 'Salvando...' : 'Salvar Tarefa'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewTaskForm;
