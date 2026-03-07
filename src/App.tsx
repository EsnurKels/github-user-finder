import { useState, useEffect } from 'react'
import { Navbar } from './components/Navbar'
import { SearchBar } from './components/SearchBar'
import { ProfileCard } from './components/ProfileCard'
import { RepoList } from './components/RepoList'
import type { GitHubUser, GitHubRepo } from './types/github'
import { githubService } from '../src/services/githubService'

function App() {
  const [userData, setUserData] = useState<GitHubUser | null>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [error, setError] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
  }, [darkMode])

  const searchUser = async (username: string) => {
    setError(null);
    try {
      // Servis üzerinden verileri paralel olarak çekelim (daha hızlı olur)
      const [uData, rData] = await Promise.all([
        githubService.getUser(username),
        githubService.getRepos(username)
      ]);

      setUserData(uData);
      setRepos(rData);
    } catch (err: any) {
      setError(err.message);
      setUserData(null);
      setRepos([]);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-light-bg dark:bg-dark-bg text-light-text-1 dark:text-dark-text-1 transition-colors duration-500 flex flex-col font-sans">
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <main className="flex-1 flex flex-col items-center py-6 px-4 max-w-7xl mx-auto w-full overflow-hidden">
        <SearchBar onSearch={searchUser} />
        
        {error && <div className="text-red-500 mb-4">{error}</div>}

        {userData && (
          <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 overflow-hidden min-h-0">
            <ProfileCard user={userData} repos={repos} />
            <RepoList repos={repos} />
          </div>
        )}
      </main>
    </div>
  )
}

export default App