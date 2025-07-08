
import React from 'react';

const Footer = () => {
  const currentDate = new Date().toLocaleDateString('pt-BR');
  
  return (
    <footer className="bg-white border-t mt-8">
      <div className="container mx-auto px-4 py-3">
        <div className="text-center text-sm text-gray-500">
          Versão 1.0.5 • {currentDate}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
