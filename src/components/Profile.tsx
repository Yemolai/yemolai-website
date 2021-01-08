import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Twitter as TwitterIcon, Github as GithubIcon } from "@styled-icons/feather";
import { getProfile, GithubProfile } from '../services/github.service'
import { Avatar } from './Avatar'
import { Card } from "./Card";
import { Column } from "./Column";
import { Row } from "./Row";
import { Paragraph } from "./text/Paragraph";

const Title = styled.h1`
    font-size: 1cm;
    margin: 0.2em 0;
    font-family: 'Playfair Display', serif;
`

const RoundLink = styled.a`
    border-radius: 50%;
    padding: 0.2em;
    margin-left: 0.25em;
    width: 1em;
`

export type ProfileProps = {
    username: string
}

export function Profile ({ username }: ProfileProps) {
    const [profile, setProfile] = useState<GithubProfile>()
    useEffect(() => {
        getProfile(username)
            .then((profile) => {
                setProfile(profile)
            })
    }, [username])
    if (!profile) {
        return (<div/>)
    }
    const profileAvatar = profile &&
        profile.avatar_url &&
        <Avatar src={profile.avatar_url} alt={profile.name} x={8} y={8} />
    return (
        <Card style={{ width: '100%', padding: '0.25cm 0' }}>
            <Row justify-space-between full-width>
                {profileAvatar}
                <Column text-right>
                    <Paragraph text-right>
                        {profile.location}
                    </Paragraph>
                    <Row justify-flex-end>
                        <RoundLink
                            href={`https://twitter.com/${profile.twitter_username}`}
                            target="_blank">
                            <TwitterIcon/>
                        </RoundLink>
                        <RoundLink href={profile.html_url} target="_blank">
                            <GithubIcon/>
                        </RoundLink>
                    </Row>
                </Column>
            </Row>
            <Title>{profile.name}</Title>
            <Paragraph>{profile.bio}</Paragraph>
        </Card>
    )
}
