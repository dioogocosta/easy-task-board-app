
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface NewTaskFormProps {
  onSave: (titulo: string, descricao: string) => void;
  onCancel: () => void;
}

const NewTaskForm: React.FC<NewTaskFormProps> = ({ onSave, onCancel }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (titulo.trim()) {
      onSave(titulo.trim(), descricao.trim());
      setTitulo('');
      setDescricao('');
    }
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-4">
      <h4 className="font-semibold mb-3">Nova Tarefa</h4>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          type="text"
          placeholder="Título da tarefa"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <Textarea
          placeholder="Descrição da tarefa (opcional)"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={3}
        />
        <div className="flex gap-2">
          <Button type="submit" className="bg-green-600 hover:bg-green-700">
            Salvar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewTaskForm;
