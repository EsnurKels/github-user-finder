import { GitHubUser, GitHubRepo } from '../hooks/useGitHub';

interface ProfileCardProps {
  user: GitHubUser;
  repos: GitHubRepo[];
}

export const ProfileCard = ({ user, repos }: ProfileCardProps) => {
  const langMap: { [key: string]: number } = {};
  let totalValidRepos = 0;

  repos.forEach(repo => {
    if (repo.language) {
      langMap[repo.language] = (langMap[repo.language] || 0) + 1;
      totalValidRepos++;
    }
  });

  const languages = Object.entries(langMap)
    .map(([name, count]) => ({
      name,
      percent: Math.round((count / totalValidRepos) * 100)
    }))
    .sort((a, b) => b.percent - a.percent)
    .slice(0, 4);

  return (
    <div className="lg:col-span-1 bg-light-card dark:bg-dark-card p-6 rounded-3xl shadow-xl border border-light-border dark:border-dark-border h-fit flex flex-col gap-4 overflow-y-auto custom-scrollbar">
      <div className="flex flex-col items-center text-center">
        <img src={user.avatar_url} className="w-24 h-24 rounded-full border-4 border-light-accent dark:border-dark-accent mb-3" alt="avatar" />
        <h2 className="text-xl font-bold leading-tight">{user.name || user.login}</h2>
        <p className="text-light-accent dark:text-dark-accent font-semibold mb-2">@{user.login}</p>
        
        <div className="grid grid-cols-3 gap-1 w-full bg-light-bg dark:bg-dark-bg/50 p-3 rounded-xl border border-light-border dark:border-dark-border mb-4">
          <div><p className="text-md font-bold">{user.public_repos}</p><p className="text-[9px] uppercase font-black text-light-text-2">Repo</p></div>
          <div><p className="text-md font-bold">{user.followers}</p><p className="text-[9px] uppercase font-black text-light-text-2">Takipçi</p></div>
          <div><p className="text-md font-bold">{user.following}</p><p className="text-[9px] uppercase font-black text-light-text-2">Takip</p></div>
        </div>

        {languages.length > 0 && (
          <div className="w-full bg-light-bg dark:bg-dark-bg/30 p-4 rounded-2xl border border-light-border dark:border-dark-border text-left">
            <h4 className="text-[10px] uppercase font-black text-light-text-2 mb-3 tracking-widest">Dil Analizi</h4>
            <div className="space-y-3">
              {languages.map((lang) => (
                <div key={lang.name}>
                  <div className="flex justify-between text-[11px] mb-1 font-bold"><span>{lang.name}</span><span className="text-light-accent dark:text-dark-accent">{lang.percent}%</span></div>
                  <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-light-accent dark:bg-dark-accent" style={{ width: `${lang.percent}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <a href={user.html_url} target="_blank" className="w-full bg-light-accent dark:bg-dark-accent text-white py-3 rounded-xl font-bold text-sm mt-4">GitHub Profilini Aç</a>
      </div>
    </div>
  );
};