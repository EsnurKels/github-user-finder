import { useState, useEffect } from 'react'
import { FaGithub, FaSun, FaMoon } from 'react-icons/fa'
import { MdClear } from 'react-icons/md'

// --- Tipler (Types) ---
interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  language: string;
  html_url: string;
}

function App() {
  const [username, setUsername] = useState('')
  const [userData, setUserData] = useState<GitHubUser | null>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [error, setError] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(true)

  // Tema Kontrolü
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Arama ve Veri Çekme Mantığı
  const handleSearch = async () => {
    if (!username) return
    setError(null)
    setUserData(null)
    setRepos([])

    try {
      const userRes = await fetch(`https://api.github.com/users/${username}`)
      if (!userRes.ok) throw new Error("Kullanıcı bulunamadı!")
      const uData = await userRes.json()
      setUserData(uData)

      const repoRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`)
      const rData = await repoRes.json()
      setRepos(rData)
    } catch (err: any) {
      setError(err.message)
    }
  }

  // Dil Analizi Hesaplama
  const calculateLanguages = () => {
    const langMap: { [key: string]: number } = {};
    let totalValidRepos = 0;

    repos.forEach(repo => {
      if (repo.language) {
        langMap[repo.language] = (langMap[repo.language] || 0) + 1;
        totalValidRepos++;
      }
    });

    return Object.entries(langMap)
      .map(([name, count]) => ({
        name,
        percent: Math.round((count / totalValidRepos) * 100)
      }))
      .sort((a, b) => b.percent - a.percent)
      .slice(0, 4);
  };

  const languages = calculateLanguages();

  return (
    <div className="h-screen overflow-hidden bg-light-bg dark:bg-dark-bg text-light-text-1 dark:text-dark-text-1 transition-colors duration-500 flex flex-col font-sans">
      
      {/* NAVBAR */}
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
          <div className="flex justify-between w-full px-1">
             <FaSun className="text-xs text-yellow-500" />
             <FaMoon className="text-xs text-white" />
          </div>
        </button>
      </nav>

      {/* ANA İÇERİK */}
      <main className="flex-1 flex flex-col items-center py-6 px-4 max-w-7xl mx-auto w-full overflow-hidden">
        
        {/* ARAMA ALANI */}
        <div className="relative w-full max-w-md mb-8 flex-shrink-0">
          <input 
            type="text" 
            placeholder="GitHub kullanıcı adı..."
            className="w-full p-4 pl-6 pr-32 rounded-full bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-dark-accent text-light-text-1 dark:text-dark-text-1 shadow-md transition-all"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          
          {username && (
            <button 
              onClick={() => setUsername('')}
              className="absolute right-24 top-1/2 -translate-y-1/2 text-slate-400 hover:text-light-accent dark:hover:text-dark-accent transition-colors"
            >
              <MdClear className="text-xl" />
            </button>
          )}

          <button 
            onClick={handleSearch}
            className="absolute right-1.5 top-1.5 bottom-1.5 bg-light-accent dark:bg-dark-accent hover:opacity-90 px-6 rounded-full text-white font-bold transition-all text-sm"
          >
            Ara
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-xl mb-4 flex-shrink-0">
            {error}
          </div>
        )}

        {userData && (
          <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden min-h-0">
            
            {/* SOL: Profil Kartı */}
            <div className="lg:col-span-1 bg-light-card dark:bg-dark-card p-6 rounded-3xl shadow-xl border border-light-border dark:border-dark-border h-fit flex flex-col gap-4 overflow-y-auto custom-scrollbar">
              <div className="flex flex-col items-center text-center">
                <img src={userData.avatar_url} className="w-24 h-24 rounded-full border-4 border-light-accent dark:border-dark-accent mb-3 shadow-xl" alt="avatar" />
                <h2 className="text-xl font-bold leading-tight">{userData.name || userData.login}</h2>
                <p className="text-light-accent dark:text-dark-accent font-semibold mb-2">@{userData.login}</p>
                <p className="text-light-text-2 dark:text-dark-text-2 text-[11px] mb-4 italic line-clamp-3">
                  {userData.bio || "Bu maceracı henüz bir biyografi yazmamış."}
                </p>
                
                <div className="grid grid-cols-3 gap-1 w-full bg-light-bg dark:bg-dark-bg/50 p-3 rounded-xl border border-light-border dark:border-dark-border mb-4 shadow-inner">
                  <div>
                    <p className="text-md font-bold">{userData.public_repos}</p>
                    <p className="text-[9px] uppercase font-black text-light-text-2">Repo</p>
                  </div>
                  <div>
                    <p className="text-md font-bold">{userData.followers}</p>
                    <p className="text-[9px] uppercase font-black text-light-text-2">Takipçi</p>
                  </div>
                  <div>
                    <p className="text-md font-bold">{userData.following}</p>
                    <p className="text-[9px] uppercase font-black text-light-text-2">Takip</p>
                  </div>
                </div>

                {/* DİL ANALİZİ */}
                {languages.length > 0 && (
                  <div className="w-full bg-light-bg dark:bg-dark-bg/30 p-4 rounded-2xl border border-light-border dark:border-dark-border text-left">
                    <h4 className="text-[10px] uppercase font-black text-light-text-2 mb-3 tracking-widest">Dil Analizi</h4>
                    <div className="space-y-3">
                      {languages.map((lang) => (
                        <div key={lang.name}>
                          <div className="flex justify-between text-[11px] mb-1 font-bold">
                            <span>{lang.name}</span>
                            <span className="text-light-accent dark:text-dark-accent">{lang.percent}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-light-accent dark:bg-dark-accent transition-all duration-1000" 
                              style={{ width: `${lang.percent}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <a 
                  href={userData.html_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full bg-light-accent dark:bg-dark-accent text-white py-3 rounded-xl font-bold hover:scale-[1.02] transition-transform text-sm mt-4"
                >
                  GitHub Profilini Aç
                </a>
              </div>
            </div>

            {/* SAĞ: Repo Listesi */}
            <div className="lg:col-span-2 flex flex-col overflow-hidden min-h-0">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3 flex-shrink-0">
                <span className="w-1.5 h-8 bg-light-accent dark:bg-dark-accent rounded-full"></span>
                Projeler ({repos.length})
              </h3>
              
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                {repos.map((repo) => (
                  <div 
                    key={repo.id} 
                    className="bg-light-card dark:bg-dark-card p-5 rounded-2xl border border-light-border dark:border-dark-border shadow-md hover:shadow-xl hover:-translate-y-1 transition-all group h-fit"
                  >
                    <h4 className="font-bold text-md mb-2 group-hover:text-light-accent dark:group-hover:text-dark-accent transition-colors truncate">
                      {repo.name}
                    </h4>
                    <p className="text-xs text-light-text-2 dark:text-dark-text-2 line-clamp-2 mb-4 h-8">
                      {repo.description || "Proje açıklaması bulunmuyor."}
                    </p>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="px-2 py-0.5 rounded-full bg-light-bg dark:bg-dark-bg text-[9px] font-bold uppercase border border-light-border dark:border-dark-border">
                        {repo.language || "Web"}
                      </span>
                      <a 
                        href={repo.html_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-[10px] font-bold text-light-accent dark:text-dark-accent hover:underline"
                      >
                        İncele →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  )
}

export default App