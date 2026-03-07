import type { GitHubUser, GitHubRepo } from '../types/github';

const BASE_URL = 'https://api.github.com/users';

export const githubService = {
  getUser: async (username: string): Promise<GitHubUser> => {
    const response = await fetch(`${BASE_URL}/${username}`);
    if (!response.ok) throw new Error("Kullanıcı bulunamadı!");
    return response.json();
  },

  getRepos: async (username: string): Promise<GitHubRepo[]> => {
    const response = await fetch(`${BASE_URL}/${username}/repos?sort=updated&per_page=100`);
    if (!response.ok) throw new Error("Projeler yüklenemedi!");
    return response.json();
  }
};