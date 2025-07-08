
import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center">
          <div className="w-10 h-10 mr-4 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">T</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Tarefas Segunda</h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
