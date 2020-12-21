import { getProfile } from './github.service'

describe('Github service', () => {
    it('should fetch a profile', async () => {
        const profile = await getProfile('yemolai')
        expect(profile).toHaveProperty('login', 'Yemolai')
    })
})
