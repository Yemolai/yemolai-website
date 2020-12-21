import React, { useEffect, useState } from 'react'
import { Avatar } from './Avatar'
import { getProfile, GithubProfile } from '../services/github.service'

export type ProfileProps = {
    username: string
}

export function Profile ({ username }: ProfileProps) {
    const [profile, setProfile] = useState<GithubProfile>()
    const profileAvatar = profile &&
        profile.avatar_url &&
        <Avatar src={profile.avatar_url} alt={profile.name} x={8} y={8} />
    useEffect(() => {
        getProfile(username)
        .then((profile) => {
            setProfile(profile)
        })
    }, [username, profile])
    return (
        <div className='profile'>
            <div className="avatar-wrapper">{profileAvatar}</div>
            {profile && <div className="profile-name">{profile.name}</div>}
        </div>
    )
}
