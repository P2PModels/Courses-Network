import React, { useState } from 'react'
import { useAragonApi } from '@aragon/api-react'
import {
  Box, Button, GU, Header, IconAddUser, IconPlus,
  Main, SyncIndicator, Tabs, Text, textStyle,
  TextInput, Card, IconUser,
  IconSquarePlus, IconEdit, IconTrash, TableRow, TableCell,
  Modal
} from '@aragon/ui'
import styled from 'styled-components'
function App() {
  const { api, appState, path, requestPath } = useAragonApi()
  const { usersLength, users, coursesLength, courses, isSyncing } = appState

  const pathParts = path.match(/^\/tab\/([0-9]+)/)
  const pageIndex = Array.isArray(pathParts)
    ? parseInt(pathParts[1], 10) - 1
    : 0

  //Para abrir y cerrar el modal
  const [openedCreateUser, setOpenedCreateUser] = useState(false)
  const openCreateUser = () => setOpenedCreateUser(true)
  const closeCreateUser = () => setOpenedCreateUser(false)

  const [openedCreateCourse, setOpenedCreateCourse] = useState(false)
  const openCreateCourse = () => setOpenedCreateCourse(true)
  const closeCreateCourse = () => setOpenedCreateCourse(false)

  //Para datos de entrada
  const [nameNewUser, setNameNewUser] = useState('')
  const [emailNewUser, setEmailNewUser] = useState('')

  const [nameNewCourse, setNameNewCourse] = useState('')
  const [descNewCourse, setDescNewCourse] = useState('')
  const [priceNewCourse, setPriceNewCourse] = useState('')

  //Para seleccionar la Tab
  const [pageSelected, setPageSelected] = useState(0)

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
        selected={pageSelected}
        onChange={setPageSelected}
      />

      {/*pageSelected Users */}
      {pageSelected == 0 ? (
        <Box
          css={`
          display: flex;
          text-align: center;
          
          ${textStyle('title3')};
        `}
        >
          <div
            css={`
              display: flex;
              flex-direction:row;
              align-items: center;
              justify-content: space-between;
              width: 155%;
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
          <div css={`
            display:flex; 
            flex-direction:row;
            flex-wrap:wrap; 
            width: 155%;
            `}>
            {console.log(users)}
            {renderUsers(users, api)}
          </div>


        </Box>) : ""}

      {/*pageSelected Courses */}
      {pageSelected == 1 ? (
        <Box
          css={`
          display: flex;
          text-align: center;
          
          ${textStyle('title3')};
        `}
        >
          <div
            css={`
              display: flex;
              flex-direction:row;
              align-items: center;
              justify-content: space-between;
              width: 155%;
            `}>
            <Text css={`
              ${textStyle('label1')};
              font-size: 15pt;
            `}>
              Added Courses : {coursesLength}</Text>

            <Button

              display="icon"
              icon={<IconSquarePlus />}
              label="Create Course"
              onClick={openCreateCourse/**/}
            />
          </div>
          <div css={`
            display:flex; 
            flex-direction:row;
            flex-wrap:wrap; 
            width: 155%;
            `}>
            {console.log(courses)}
            {renderCourses(courses)}
          </div>
        </Box>) : ""}

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
      {/* Modal Create Course */}
      <Modal visible={openedCreateCourse} onClose={closeCreateCourse} >
        <div css={`
            display: flex;
            flex-direction: column;
            align-items:center;
          `}>
          <Text css={`${textStyle('label1')};font-size: 17pt; color: #210963`}>Add a new course</Text>

          <div css={`margin-top:5%;`}>
            <Text css={`${textStyle('label1')}; color: #47444F`}>Name: </Text>
            <TextInput
              autofocus
              value={nameNewCourse}
              onChange={event => {
                setNameNewCourse(event.target.value)
              }}
            />
          </div>
          <div css={`margin-top:2%;`}>
            <Text css={`${textStyle('label1')}; color: #47444F`}>Description: </Text>
            <TextInput
              value={descNewCourse}
              onChange={event => {
                setDescNewCourse(event.target.value)
              }}
            />
          </div>
          <div css={`margin-top:2%;`}>
            <Text css={`${textStyle('label1')}; color: #47444F`}>Price: </Text>
            <TextInput
              value={priceNewCourse}
              type="number"
              onChange={event => {
                setPriceNewCourse(event.target.value)
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
            onClick={() => api.createCourse(nameNewCourse, descNewCourse, priceNewCourse).toPromise()}
          />

        </div>
      </Modal>
    </Main>
  )
}

function renderUsers(users, api) {
  //const zipped = users.map((t, i) => [t]);
  return users.map((user) => {
    console.log(user);
    let s = JSON.stringify(user);
    let obj = JSON.parse(s);
    return (<Card width="200px" height="200px" css={`margin-right: 5%;`}>
      <div css={`display:flex; flex-direction:row; align-items:center;margin-bottom:15%;`}>

        <div className='icons'>
          <Button
            display="icon"
            icon={<IconEdit/>}
            label="Edit user"
            /*onClick={TODO}*/
          />
          <Button 
            display="icon"
            icon={<IconTrash/>}
            label="Delete user"
            onClick={() => api.deleteUser(obj.id).toPromise()}
          />
        </div>
        <IconUser size="large"></IconUser>
        <Text css={`${textStyle('title4')};`}>{obj.name}</Text>
      </div>
      <div css={`display:flex; flex-direction:row; align-items:center;`}>
        <Text css={`${textStyle('label2')}; font-weight:bold;margin-right:2%;`}>Email: </Text>
        <Text css={`${textStyle('body3')};`}> {obj.email}</Text>
      </div>
      <div css={`display:flex; flex-direction:row; align-items:center;`}>
        <Text css={`${textStyle('label2')}; font-weight:bold;margin-right:2%;`}>Reputation: </Text>
        <Text css={`${textStyle('body3')};`}> {obj.reputation}</Text>
      </div>
    </Card>
    )
  })
}

function renderCourses(courses) {
  return courses.map((course) => {
    let s = JSON.stringify(course);
    let obj = JSON.parse(s);
    return (<Card width="200px" height="200px" css={`margin-right: 5%;`}>
      <div css={`display:flex; flex-direction:row; align-items:center;margin-bottom:15%;`}>
        <IconUser size="large"></IconUser>
        <Text css={`${textStyle('title4')};`}>{obj.name}</Text>
      </div>
      <div css={`display:flex; flex-direction:row; align-items:center;`}>
        <Text css={`${textStyle('label2')}; font-weight:bold;margin-right:2%;`}>Description: </Text>
        <Text css={`${textStyle('body3')};`}> {obj.desc}</Text>
      </div>
      <div css={`display:flex; flex-direction:row; align-items:center;`}>
        <Text css={`${textStyle('label2')}; font-weight:bold;margin-right:2%;`}>Price: </Text>
        <Text css={`${textStyle('body3')};`}> {obj.price}$</Text>
      </div>
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
