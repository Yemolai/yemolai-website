import React from 'react'
import {Profile} from "../components/Profile";
import {Page} from "../components/Page";
import {Tech, TechKnowledge} from "../components/TechKnowledge";
import {Row} from "../components/Row";

const techList: Tech[] = [
    { name: 'Javascript', iconUrl: 'https://img.icons8.com/ios/128/000000/javascript.png' },
    { name: 'HTML5', iconUrl: 'https://img.icons8.com/windows/128/000000/html-5.png' },
    { name: 'Angular', iconUrl: 'https://img.icons8.com/windows/128/000000/angularjs.png' },
    { name: 'CSS3', iconUrl: 'https://img.icons8.com/windows/128/000000/css3.png' },
    { name: 'C#', iconUrl: 'https://img.icons8.com/windows/128/000000/c-sharp-logo.png' },
    { name: 'Docker', iconUrl: 'https://img.icons8.com/windows/128/000000/docker.png' },
    { name: 'Git', iconUrl: 'https://img.icons8.com/windows/128/000000/git.png' },
    { name: 'jQuery', iconUrl: 'https://img.icons8.com/ios/128/000000/jquery.png' },
    { name: 'React', iconUrl: 'https://img.icons8.com/windows/128/000000/react-native.png' },
    { name: 'Node', iconUrl: 'https://img.icons8.com/windows/128/000000/node-js.png' },
    { name: 'Sass', iconUrl: 'https://img.icons8.com/windows/128/000000/sass.png' },
    { name: 'Vue', iconUrl: 'https://img.icons8.com/windows/128/000000/vuejs.png'},
    { name: 'Linux', iconUrl: 'https://img.icons8.com/windows/128/000000/linux-client.png'},
    { name: 'Windows', iconUrl: 'https://img.icons8.com/windows/128/000000/windows-client.png'},
    { name: 'Typescript', iconUrl: 'https://img.icons8.com/windows/128/000000/typescript.png' }
]
    .slice(0)
    .sort(({ name: a }, { name: b }) => a < b ? -1 : a > b ? 1 : 0)

export function HomePage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
            <Page>
                <Row full-width><Profile username='yemolai'/></Row>
                <Row full-width><TechKnowledge tech={techList}/></Row>
            </Page>
        </div>
    )
}
