import { useState, useEffect } from 'react'
import { FaGithub, FaSun, FaMoon } from 'react-icons/fa'
import { MdClear } from 'react-icons/md'

function App() {
  const [username, setUsername] = useState('')
  const [userData, setUserData] = useState<any>(null)
  const [repos, setRepos] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(true)

  // Dark Mode Mantığı: HTML etiketine "dark" sınıfını ekler/çıkarır
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const handleSearch = async () => {
    if (!username) return
    setError(null)
    setUserData(null)
    setRepos([])

    try {
      // 1. Kullanıcı verilerini çek
      const userRes = await fetch(`https://api.github.com/users/${username}`)
      if (!userRes.ok) throw new Error("Kullanıcı bulunamadı!")
      const uData = await userRes.json()
      setUserData(uData)

      // 2. Kullanıcının son 4 güncellenen reposunu çek
      const repoRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=4`)
      const rData = await repoRes.json()
      setRepos(rData)
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-light-bg dark:bg-dark-bg text-light-text-1 dark:text-dark-text-1 transition-colors duration-500 font-sans">
      
      {/* NAVBAR */}
      <nav className="w-full py-4 px-6 border-b border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card flex justify-between items-center sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2">
          <FaGithub className="text-3xl text-light-accent dark:text-dark-accent" />
          <span className="text-xl font-bold tracking-tight hidden sm:block">GitHub User Finder</span>
        </div>

        {/* MODERN SWITCH BUTON */}
        <div 
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
        </div>
      </nav>

      {/* ANA İÇERİK */}
      <main className="flex flex-col items-center py-12 px-4 max-w-6xl mx-auto">
        
        {/* KAPSÜL ARAMA ALANI */}
        <div className="relative w-full max-w-md mb-12">
          <input 
            type="text" 
            placeholder="GitHub kullanıcı adı..."
            className="w-full p-4 pl-6 pr-32 rounded-full bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border focus:outline-none focus:ring-2 focus:ring-dark-accent text-light-text-1 dark:text-dark-text-1 shadow-lg transition-all"
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

        {/* HATA MESAJI */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 animate-bounce">
            {error}
          </div>
        )}

        {/* SONUÇ ALANI: PROFİL + REPOLAR */}
        {userData && (
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in zoom-in duration-500">
            
            {/* SOL: Profil Kartı */}
            <div className="lg:col-span-1 bg-light-card dark:bg-dark-card p-8 rounded-3xl shadow-2xl border border-light-border dark:border-dark-border h-fit sticky lg:top-24">
              <div className="flex flex-col items-center text-center">
                <img 
                  src={userData.avatar_url} 
                  className="w-32 h-32 rounded-full border-4 border-light-accent dark:border-dark-accent mb-4 shadow-2xl" 
                  alt="avatar" 
                />
                <h2 className="text-2xl font-bold leading-tight">{userData.name || userData.login}</h2>
                <p className="text-light-accent dark:text-dark-accent font-semibold mb-4">@{userData.login}</p>
                <p className="text-light-text-2 dark:text-dark-text-2 text-sm mb-6 italic">
                  {userData.bio || "Bu kullanıcı henüz bir biyografi yazmamış."}
                </p>
                
                {/* İstatistik Kutusu */}
                <div className="grid grid-cols-3 gap-2 w-full bg-light-bg dark:bg-dark-bg/50 p-4 rounded-2xl border border-light-border dark:border-dark-border mb-6 shadow-inner">
                  <div>
                    <p className="text-lg font-bold">{userData.public_repos}</p>
                    <p className="text-[10px] uppercase font-black text-light-text-2">Repo</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{userData.followers}</p>
                    <p className="text-[10px] uppercase font-black text-light-text-2">Takipçi</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold">{userData.following}</p>
                    <p className="text-[10px] uppercase font-black text-light-text-2">Takip</p>
                  </div>
                </div>
                
                <a 
                  href={userData.html_url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full bg-light-accent dark:bg-dark-accent text-white py-4 rounded-2xl font-bold hover:scale-[1.02] transition-transform shadow-lg"
                >
                  GitHub Profilini Aç
                </a>
              </div>
            </div>

            {/* SAĞ: Repo Listesi */}
            <div className="lg:col-span-2">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-light-accent dark:bg-dark-accent rounded-full"></span>
                Son Projeler
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {repos.map((repo) => (
                  <div 
                    key={repo.id} 
                    className="bg-light-card dark:bg-dark-card p-6 rounded-2xl border border-light-border dark:border-dark-border shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all group"
                  >
                    <h4 className="font-bold text-lg mb-2 group-hover:text-light-accent dark:group-hover:text-dark-accent transition-colors truncate">
                      {repo.name}
                    </h4>
                    <p className="text-sm text-light-text-2 dark:text-dark-text-2 line-clamp-2 mb-6 h-10">
                      {repo.description || ""}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="px-3 py-1 rounded-full bg-light-bg dark:bg-dark-bg text-[10px] font-bold uppercase tracking-wider border border-light-border dark:border-dark-border">
                        {repo.language || "Web"}
                      </span>
                      <a 
                        href={repo.html_url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs font-bold text-light-accent dark:text-dark-accent hover:underline flex items-center gap-1"
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