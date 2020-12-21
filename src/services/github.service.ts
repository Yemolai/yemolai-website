export type GithubProfile = {
    avatar_url: string,
    html_url: string,
    name: string,
    company: string,
    blog: string,
    location: string,
    hireable: boolean,
    bio: string,
    public_repos: string[],
    public_gists: string[],
    followers: number,
    following: number,
    created_at: Date,
    updated_at: Date
}

export const GITHUB_API_URL = 'https://api.github.com'

export async function getProfile (username: string): Promise<GithubProfile> {
    return await fetch(`${GITHUB_API_URL}/users/${username}`)
        .then(res => {
            if (res.status !== 200) {
                throw new Error(res.statusText)
            }
            return res.json()
        })
        .then((profile: GithubProfile) => profile)
        .catch(err => {
            throw err
        })
}
