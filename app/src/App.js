import React from 'react'
import { useAragonApi } from '@aragon/api-react'
import {
  Box, Button, GU, Header, IconAddUser, IconPlus,
  Main, SyncIndicator, Tabs, Text, textStyle,
  TextInput,Card, DropDown,
  Field,Table, TableHeader, TableRow, TableCell,
} from '@aragon/ui'
import styled from 'styled-components'
function App() {
  const { api, appState, path, requestPath } = useAragonApi()
  const { usersLength,users, isSyncing } = appState

  const pathParts = path.match(/^\/tab\/([0-9]+)/)
  const pageIndex = Array.isArray(pathParts)
    ? parseInt(pathParts[1], 10) - 1
    : 0

  return (
    <Main>
      {isSyncing && <SyncIndicator />}
      <Header
        primary="Counter"
        secondary={
          <span
            css={`
              ${textStyle('title2')}
            `}
          >
            {usersLength}
          </span>
        }
      />
      
      <Tabs
      //podemos usar estas tabs para cambiar de users a courses
        items={['Users', 'Courses']}
        selected={pageIndex}
        onChange={index => requestPath(`/tab/${index + 1}`)}
      />
      <Box
        css={`
          display: flex;
          text-align: center;
          height: ${50 * GU}px;
          ${textStyle('title3')};
        `}
      >
        <div
        css={`
          display: flex;
          flex-direction:row;
          align-items: center;
          width: 272%;
          justify-content: space-between;

        `}>
       <Text css={`
       ${textStyle('label1')};
       font-size: 15pt;
        `}> 
      Registered Users : {usersLength}</Text>
        
          <Button
          
            display="icon"
            icon={<IconAddUser />}
            label="Create User"
            onClick={() => api.createUser("Marta", "mranz02@ucm.es").toPromise()}
          />
          
       
        </div>
        {renderUsers(users)}
        
      </Box>
    </Main>
  )
}

function renderUsers(users) {
  const zipped = users.map((t,i) => [t]);
  return zipped.map((user) => {
    const [name] = user
    return (<Card width="100px" height="50px">
        <Text css={`${textStyle('body2')};`}>{name}</Text>
        </Card>
    )
  })
}

const Buttons = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 40px;
  margin-top: 20px;
`

export default App
