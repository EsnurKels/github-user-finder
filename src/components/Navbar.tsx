import { FaGithub, FaSun, FaMoon } from 'react-icons/fa';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export const Navbar = ({ darkMode, setDarkMode }: NavbarProps) => (
  <nav className="w-full py-4 px-6 border-b border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card flex justify-between items-center z-50 shadow-sm">
    <div className="flex items-center gap-2">
      <FaGithub className="text-3xl text-light-accent dark:text-dark-accent" />
      <span className="text-xl font-bold tracking-tight hidden sm:block">GitHub User Finder</span>
    </div>
    <button 
      onClick={() => setDarkMode(!darkMode)}
      className="relative w-14 h-7 flex items-center bg-slate-300 dark:bg-dark-accent rounded-full p-1 cursor-pointer transition-colors duration-300"
    >
      <div className={`absolute w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center z-10 ${darkMode ? 'translate-x-7' : 'translate-x-0'}`}>
        {darkMode ? <FaMoon className="text-[10px] text-dark-accent" /> : <FaSun className="text-[10px] text-yellow-500" />}
      </div>
      <div className="flex justify-between w-full px-1 text-xs">
         <FaSun className="text-yellow-500" />
         <FaMoon className="text-white" />
      </div>
    </button>
  </nav>
);