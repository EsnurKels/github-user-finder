import { useState } from 'react';
import { GitHubUser, GitHubRepo} from '../types/github'

export const useGitHub = () => {
  const [userData, setUserData] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [error, setError] = useState<string | null>(null);

  const searchUser = async (username: string) => {
    if (!username) return;
    try {
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (!userRes.ok) throw new Error("Kullanıcı bulunamadı!");
      const uData = await userRes.json();
      setUserData(uData);

      const repoRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
      const rData = await repoRes.json();
      setRepos(rData);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setUserData(null);
      setRepos([]);
    }
  };

  return { userData, repos, error, searchUser };
};