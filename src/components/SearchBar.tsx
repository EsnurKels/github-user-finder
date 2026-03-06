import { useState } from 'react';
import { MdClear } from 'react-icons/md';

interface SearchBarProps {
  onSearch: (username: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [username, setUsername] = useState('');

  return (
    <div className="relative w-full max-w-md mb-8 flex-shrink-0">
      <input 
        type="text" 
        placeholder="GitHub kullanıcı adı..."
        className="w-full p-4 pl-6 pr-32 rounded-full bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-dark-accent text-light-text-1 dark:text-dark-text-1 shadow-md transition-all"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch(username)}
      />
      {username && (
        <button onClick={() => setUsername('')} className="absolute right-24 top-1/2 -translate-y-1/2 text-slate-400 hover:text-light-accent dark:hover:text-dark-accent transition-colors">
          <MdClear className="text-xl" />
        </button>
      )}
      <button onClick={() => onSearch(username)} className="absolute right-1.5 top-1.5 bottom-1.5 bg-light-accent dark:bg-dark-accent hover:opacity-90 px-6 rounded-full text-white font-bold transition-all text-sm">
        Ara
      </button>
    </div>
  );
};