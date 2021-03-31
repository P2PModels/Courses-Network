import React, { useState } from 'react'
import { useAragonApi } from '@aragon/api-react'
import {
  Box, Button, GU, Header, IconMinus, IconPlus,
  Main, SyncIndicator, Tabs, Text, textStyle,
  TextInput,Card, DropDown,
  Field,Table, TableHeader, TableRow, TableCell,
} from '@aragon/ui'
import styled from 'styled-components'

function App() {
  const { api, appState, path, requestPath } = useAragonApi()
  const { usersLength, users, priorities, isDone,  isSyncing} = appState

  const pathParts = path.match(/^\/tab\/([0-9]+)/)
  const pageIndex = Array.isArray(pathParts)
    ? parseInt(pathParts[1], 10) - 1
    : 0
    
  
  /*/const [newName, setNewName] = useState('')
  const [nameToDel, setnameToDel] = useState('')
  const [nameEdit, setnameEdit] = useState('')
  const [pEdit, setpEdit] = useState(-1)
  const [nameEnd, setnameEnd] = useState('')
  const [newTaskPrio, setNewTaskPrio] = useState(-1)*/
  return (
    <Main>
      {isSyncing && <SyncIndicator />}
      <Header
        GHprimary="P2P Models:"
        secondary={
          <span
            css={`
              ${textStyle('title2')}
            `}
          >
            Total tasks: {numTasks}
          </span>
        }
      />
    </Main>
  )
}

/*function renderTable(tasks, priorities, isDone) {
  const zipped = tasks.map((t,i) => [t, priorities[i],isDone[i] ]);
  return zipped.map((task) => {
    const [name, prio, done] = task
    return (<TableRow>
      <TableCell>
        <Text css={`${textStyle('body2')};`}>{name}</Text>
      </TableCell>
      <TableCell>
        <Text css={`${textStyle('body2')};`}>{prio}</Text>
      </TableCell>
      <TableCell>
        <Text css={`${textStyle('body2')};`}>{done}</Text>
      </TableCell>
    </TableRow>
    )
  })
}*/
const Buttons = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 40px;
  margin-top: 20px;
`

export default App
