import React, { useState } from 'react'
import { useAragonApi } from '@aragon/api-react'
import {
  Box, Button, GU, Header, IconAddUser, IconPlus,
  Main, SyncIndicator, Tabs, Text, textStyle,
  TextInput, Card, DropDown,
  Field, Table, TableHeader, TableRow, TableCell,
  Modal
} from '@aragon/ui'
import styled from 'styled-components'
function App() {
  const { api, appState, path, requestPath } = useAragonApi()
  const { usersLength, users, isSyncing } = appState

  const pathParts = path.match(/^\/tab\/([0-9]+)/)
  const pageIndex = Array.isArray(pathParts)
    ? parseInt(pathParts[1], 10) - 1
    : 0

  //Para abrir y cerrar el modal
  const [openedCreateUser, setOpenedCreateUser] = useState(false)
  const openCreateUser = () => setOpenedCreateUser(true)
  const closeCreateUser = () => setOpenedCreateUser(false)
  const [nameNewUser, setNameNewUser] = useState('')
  const [emailNewUser, setEmailNewUser] = useState('')

  return (
    <Main>
      {isSyncing && <SyncIndicator />}
      <Header
        primary="Courses Network"
        secondary={
          <span
            css={`
              ${textStyle('title2')}
            `}
          >
            TFG
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
            Registered Users : {usersLength - 1/*Restamos 1 por el User del constructor que no sirve*/}</Text>

          <Button

            display="icon"
            icon={<IconAddUser />}
            label="Create User"
            onClick={openCreateUser/**/}
          />


        </div>
        {renderUsers(users)}

        {/* Modal Create User */}
        <Modal visible={openedCreateUser} onClose={closeCreateUser} >
          <div css={`
            display: flex;
            flex-direction: column;
            align-items:center;
          `}>
            <Text css={`${textStyle('label1')};font-size: 17pt; color: #210963`}>Create a new user</Text>

            <div css={`margin-top:5%;`}>
              <Text css={`${textStyle('label1')}; color: #47444F`}>Name: </Text>
              <TextInput
                autofocus
                value={nameNewUser}
                onChange={event => {
                  setNameNewUser(event.target.value)
                }}
              />
            </div>
            <div css={`margin-top:2%;`}>
              <Text css={`${textStyle('label1')}; color: #47444F`}>Email: </Text>
              <TextInput
                value={emailNewUser}
                onChange={event => {
                  setEmailNewUser(event.target.value)
                }}
              />
            </div>
            <Button
              css={`
                margin-top:5%;
                background-color:#210963;
                color: white;
              `}
              label="Create"
              onClick={() => api.createUser(nameNewUser, emailNewUser).toPromise()}
            />

          </div>
        </Modal>
      </Box>
    </Main>
  )
}

function renderUsers(users) {
  const zipped = users.map((t, i) => [t]);
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
