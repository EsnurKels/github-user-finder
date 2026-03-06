import { GitHubRepo } from '../types/github';

interface RepoListProps {
  repos: GitHubRepo[];
}

export const RepoList = ({ repos }: RepoListProps) => (
  <div className="lg:col-span-2 flex flex-col overflow-hidden min-h-0">
    <h3 className="text-xl font-bold mb-4 flex items-center gap-3 flex-shrink-0">
      <span className="w-1.5 h-8 bg-light-accent dark:bg-dark-accent rounded-full"></span>
      Projeler ({repos.length})
    </h3>
    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
      {repos.map((repo) => (
        <div key={repo.id} className="bg-light-card dark:bg-dark-card p-5 rounded-2xl border border-light-border dark:border-dark-border shadow-md hover:shadow-xl transition-all group h-fit">
          <h4 className="font-bold text-md mb-2 group-hover:text-light-accent dark:group-hover:text-dark-accent truncate">{repo.name}</h4>
          <p className="text-xs text-light-text-2 dark:text-dark-text-2 line-clamp-2 mb-4 h-8">{repo.description || "Proje açıklaması bulunmuyor."}</p>
          <div className="flex justify-between items-center mt-auto">
            <span className="px-2 py-0.5 rounded-full bg-light-bg dark:bg-dark-bg text-[9px] font-bold uppercase border border-light-border dark:border-dark-border">{repo.language || "Web"}</span>
            <a href={repo.html_url} target="_blank" className="text-[10px] font-bold text-light-accent dark:text-dark-accent hover:underline">İncele →</a>
          </div>
        </div>
      ))}
    </div>
  </div>
);