import React from 'react'
import styled from 'styled-components'
import { Name } from './Name'

interface AccordionProps {
  items: string[]
  title: string
}

const AccordionWrapper = styled.div`
  width: calc(100% - 28px);
  background-color: #4A99E9;
  color: white;
  border-radius: 6px;
  padding-top: 6px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
`

const AccordionHeader = styled.div`
  margin-left: 10px;
  margin-right: 10px;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-size: 18px;
  font-weight: 700;
  text-transform: uppercase;
`

const AccordionTitleCount = styled.span`
  border-radius: 100px;
  background-color: white;
  color: #4A99E9;
  padding: 8px;
  margin-right: 8px;
`

const AccordionItemsWrapper = styled.div`
  background-color: white;
  width: 100%;
  margin-top: 6px;
  border-radius: 6px;
  color: black;
  min-height: 1px;
  max-height: 200px;
  overflow-y: scroll;
`

export const Accordion = (props: AccordionProps): JSX.Element => {
  return (<AccordionWrapper>
    <AccordionHeader>
      <AccordionTitleCount>{props.items.length}</AccordionTitleCount>{props.title}
    </AccordionHeader>
    <AccordionItemsWrapper>
      {props.items.map((name) => <Name key={name}>{name}</Name>)}
    </AccordionItemsWrapper>
  </AccordionWrapper>)
}
