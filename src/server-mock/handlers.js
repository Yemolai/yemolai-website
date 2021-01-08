import { rest } from 'msw'
import githubProfile from '../fixtures/github-profile.json'

export const handlers = [
    rest.get(githubProfile.url, async (req, res, ctx) => {
        return res(ctx.json(githubProfile))
    })
]
