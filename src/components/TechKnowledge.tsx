import React from "react"
import styled from "styled-components"
import {Card} from "./Card"
import {Column} from "./Column";
import {Row} from "./Row"
import {Paragraph} from "./text/Paragraph";

export type Tech = { name: string, iconUrl: string }

const TechIcon = styled.img`
    margin: 0.12cm 0.5cm;
    width: 1cm;
`

const TechRepresentation = ({ tech: { name, iconUrl } }: { tech: Tech }) => (
    <div style={{ margin: '0.2cm' }}>
        <Row justify-center><TechIcon src={iconUrl}/></Row>
        <Row justify-center><Paragraph style={{ margin: 0 }}>{name}</Paragraph></Row>
    </div>
)

export const TechKnowledge = ({ tech }: { tech: Tech[] }) => (
    <Card style={{ width: '100%' }}>
        <Row full-width>
            <Paragraph>
                Tech proficient in
            </Paragraph>
        </Row>
        <Row full-width justify-center style={{ flexWrap: 'wrap' }}>
            {
                tech.map(tech => (
                    <Column><TechRepresentation tech={tech}/></Column>
                ))
            }
        </Row>
    </Card>
)
