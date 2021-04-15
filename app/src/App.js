import React, { useState } from 'react'
import { useAragonApi } from '@aragon/api-react'
import {
  Box, Button, GU, Header, IconAddUser, IconPlus,
  Main, SyncIndicator, Tabs, Text, textStyle,
  TextInput, Card, IconUser,
  IconSquarePlus, IconEdit, IconTrash, IconSwap, IconVote,
  Modal
} from '@aragon/ui'
import styled from 'styled-components'

window.id;
window.name = '';
window.email = '';
window.idCourse;
window.nameCourse = '';
window.desc = '';
window.price;

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

  const [openedEditUser, setOpenedEditUser] = useState(false)
  const openEditUser = () => setOpenedEditUser(true)
  const closeEditUser = () => setOpenedEditUser(false)

  const [openedEditCourse, setOpenedEditCourse] = useState(false)
  const openEditCourse = () => setOpenedEditCourse(true)
  const closeEditCourse = () => setOpenedEditCourse(false)

  const [openedCreateCourse, setOpenedCreateCourse] = useState(false)
  const openCreateCourse = () => setOpenedCreateCourse(true)
  const closeCreateCourse = () => setOpenedCreateCourse(false)

  const [openedCreateAssessment, setOpenedCreateAssessment] = useState(false)
  const openCreateAssessment = () => setOpenedCreateAssessment(true)
  const closeCreateAssessment = () => setOpenedCreateAssessment(false)

  //Para datos de entrada
  const [nameNewUser, setNameNewUser] = useState('')
  const [emailNewUser, setEmailNewUser] = useState('')

  const [nameUpdateUser, setNameUpdateUser] = useState(window.name)
  const [emailUpdateUser, setEmailUpdateUser] = useState(window.email)

  const [nameUpdateCourse, setNameUpdateCourse] = useState(window.nameCourse)
  const [descUpdateCourse, setDescUpdateCourse] = useState(window.desc)
  const [priceUpdateCourse, setPriceUpdateCourse] = useState(window.price)

  const [nameNewCourse, setNameNewCourse] = useState('')
  const [descNewCourse, setDescNewCourse] = useState('')
  const [priceNewCourse, setPriceNewCourse] = useState('')

  const [titleNewAssessment, setTitleNewAssessment] = useState('')
  const [commentaryNewAssessment, setCommentaryNewAssessment] = useState('')
  const [numericAssessment, setNumericAssessment] = useState('')
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
              width: 675px;
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
            width: 675px;
            `}>
            {console.log(users)}
            {renderUsers(users, openEditUser, api, setNameUpdateUser, setEmailUpdateUser)}
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
              width: 675px;
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
            width: 675px;
            `}>
            {console.log(courses)}
            {renderCourses(courses,openEditCourse, api, setNameUpdateCourse, setDescUpdateCourse, setPriceUpdateCourse, openCreateAssessment)}
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
              multiline="true"
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

      {/* Modal update User */}
      <Modal visible={openedEditUser} onClose={closeEditUser} >
        <div css={`
            display: flex;
            flex-direction: column;
            align-items:center;
          `}>
          <Text css={`${textStyle('label1')};font-size: 17pt; color: #210963`}>Update User</Text>

          <div css={`margin-top:5%;`}>
            <Text css={`${textStyle('label1')}; color: #47444F`}>Name: </Text>
            <TextInput
              autofocus
              value={nameUpdateUser}
              onChange={event => {
                setNameUpdateUser(event.target.value)
              }}
            />
          </div>
          <div css={`margin-top:2%;`}>
            <Text css={`${textStyle('label1')}; color: #47444F`}>Email: </Text>
            <TextInput
              value={emailUpdateUser}
              onChange={event => {
                setEmailUpdateUser(event.target.value)
              }}
            />
          </div>
             {console.log(window.id)}
          <Button
            css={`
                margin-top:5%;
                background-color:#210963;
                color: white;
              `}
            label="Update"
            onClick={() => api.updateUser(window.id, nameUpdateUser, emailUpdateUser).toPromise()}
          />

        </div>
      </Modal>

      {/* Modal update Course */}
      <Modal visible={openedEditCourse} onClose={closeEditCourse} >
        <div css={`
            display: flex;
            flex-direction: column;
            align-items:center;
          `}>
          <Text css={`${textStyle('label1')};font-size: 17pt; color: #210963`}>Update Course</Text>

          <div css={`margin-top:5%;`}>
            <Text css={`${textStyle('label1')}; color: #47444F`}>Name: </Text>
            <TextInput
              autofocus
              value={nameUpdateCourse}
              onChange={event => {
                setNameUpdateCourse(event.target.value)
              }}
            />
          </div>
          <div css={`margin-top:2%;`}>
            <Text css={`${textStyle('label1')}; color: #47444F`}>Description: </Text>
            <TextInput
              multiline="true"
              value={descUpdateCourse}
              onChange={event => {
                setDescUpdateCourse(event.target.value)
              }}
            />
          </div>
          <div css={`margin-top:2%;`}>
            <Text css={`${textStyle('label1')}; color: #47444F`}>Price: </Text>
            <TextInput
              type="Number"
              value={priceUpdateCourse}
              onChange={event => {
                setPriceUpdateCourse(event.target.value)
              }}
            />
          </div>
             {console.log(window.idCourse)}
          <Button
            css={`
                margin-top:5%;
                background-color:#210963;
                color: white;
              `}
            label="Update"
            onClick={() => api.updateCourse(window.idCourse, nameUpdateCourse, descUpdateCourse, priceUpdateCourse).toPromise()}
          />

        </div>
      </Modal>

      {/* Modal Create Assessment */}
      <Modal visible={openedCreateAssessment} onClose={closeCreateAssessment} >
        <div css={`
            display: flex;
            flex-direction: column;
            align-items:center;
          `}>
          <Text css={`${textStyle('label1')};font-size: 17pt; color: #210963`}>Rate the course </Text>

          <div css={`margin-top:5%;`}>
            <Text css={`${textStyle('label1')}; color: #47444F`}>Tittle: </Text>
            <TextInput
              autofocus
              value={titleNewAssessment}
              onChange={event => {
                setTitleNewAssessment(event.target.value)
              }}
            />
          </div>
          <div css={`margin-top:2%;`}>
            <Text css={`${textStyle('label1')}; color: #47444F`}>Commentary: </Text>
            <TextInput
              value={commentaryNewAssessment}
              onChange={event => {
                setCommentaryNewAssessment(event.target.value)
              }}
            />
          </div>
          <div css={`margin-top:2%;`}>
            <Text css={`${textStyle('label1')}; color: #47444F`}>Assessment (1-5): </Text>
            <TextInput
              value={numericAssessment}
              type="Number"
              onChange={event => {
                setNumericAssessment(event.target.value)
              }}
            />
          </div>
          {window.idCourse}{titleNewAssessment}{commentaryNewAssessment}{numericAssessment}
          <Button
            css={`
                margin-top:5%;
                background-color:#210963;
                color: white;
              `}
            label="Assess"
            onClick={() => api.createAssessment(window.idCourse, titleNewAssessment, commentaryNewAssessment, numericAssessment).toPromise()}
          />

        </div>
      </Modal>
    </Main>
  )
}

function prueba(id, name, email) {
  window.id = id;
  window.name = name;
  window.email = email; 
}
function renderUsers(users, openEditUser, api, setNameUpdateUser, setEmailUpdateUser) {
  //const zipped = users.map((t, i) => [t]);

  return users.map((user) => {
    console.log(user);
    let s = JSON.stringify(user);
    let obj = JSON.parse(s);
    return (<Card width="250px" height="200px" css={`margin: 3%;`}>

      <div css={`position: absolute; top:0;right: 0; margin-left:auto; margin-right: 5%;`}>
        <Button
          display="icon"
          icon={<IconEdit size="small" />}
          label="Edit user"
          size="mini"
          onClick={() => {openEditUser(); prueba(obj.id, obj.name, obj.email); setNameUpdateUser(window.name);setEmailUpdateUser(window.email);}}
          //onClick: abre el modal, actualiza variables globales, actualiza los campos del modal
        />
        <Button
          display="icon"
          icon={<IconTrash size="small" />}
          label="Delete user"
          size="mini"
          onClick={() => api.deleteUser(obj.id).toPromise()}
        />
      </div>
      <div css={`display:flex; flex-direction:row; align-items:center; margin-bottom: 5%;`}>
        <IconUser size="large"></IconUser>
        <Text css={`${textStyle('title4')};`}>{obj.name}</Text>

      </div>
      <div css={``}>
        <div css={`display:flex; flex-direction:row; align-items:center;`}>
          <Text css={`${textStyle('label2')}; font-weight:bold;margin-right:2%;`}>Email: </Text>
          <Text css={`${textStyle('body3')};`}> {obj.email}</Text>
        </div>
        <div css={`display:flex; flex-direction:row; align-items:center;`}>
          <Text css={`${textStyle('label2')}; font-weight:bold;margin-right:2%;`}>Reputation: </Text>
          <Text css={`${textStyle('body3')};`}> {obj.reputation}</Text>
        </div>
        <div css={`display:flex; flex-direction:row; align-items:center;`}>
          <Text css={`${textStyle('label2')}; font-weight:bold;margin-right:2%;`}>Offered courses: </Text>
          <Text css={`${textStyle('body3')};`}> {obj.coursesOfferedLength}</Text>
        </div>
        <div css={`display:flex; flex-direction:row; align-items:center;`}>
          <Text css={`${textStyle('label2')}; font-weight:bold;`}>Completed courses: </Text>
          <Text css={`${textStyle('body3')}; `}> { obj.coursesCompletedLength}</Text>
        </div>
      </div>
    </Card>
    )
  })
}
function setGlobalCourses(id, nameC, desc, price) {
  window.idCourse = id;
  window.nameCourse = nameC;
  window.desc = desc;
  window.price = price;
}
function prueba2(id) {
  window.idCourse = id;
}
function renderCourses(courses, openEditCourse, api, setNameUpdateCourse, setDescUpdateCourse, setPriceUpdateCourse, openCreateAssessment) {
  return courses.map((course) => {
    let s = JSON.stringify(course);
    let obj = JSON.parse(s);
    let act = obj.isActive ? "Available" : "Unavailable";
    let color= obj.isActive ? "green" : "red";

    return (<Card width="280px" height="200px" css={`margin: 3%;`}>
      <div css={`display:flex; flex-direction:row;align-items:center;justify-content: space-between; position:absolute; top:5px; padding-left: 5%; padding-right: 2%;width: 100%;`}>
        <Text css={`${textStyle('body3')}; color: ${color}; margin-right: 10%;`}> {act}</Text>
        <div css={`display:flex; flex-direction:row; `}>
          <Button
            display="icon"
            icon={<IconEdit size="small" />}
            label="Edit user"
            size="mini"
            onClick={() => {openEditCourse(); setGlobalCourses(obj.id, obj.name, obj.desc, obj.price); setNameUpdateCourse(window.nameCourse);setDescUpdateCourse(window.desc);setPriceUpdateCourse(window.price);}}
            //onClick: abre el modal, actualiza variables globales, actualiza los campos del modal
          />
          <Button
            css={`margin-left: 10%;`}
            display="icon"
            icon={<IconSwap size="small" />}
            label="Delete user"
            size="mini"
            onClick={() => api.updateCourseState(obj.id).toPromise()}
          />
        </div>
      </div>
      {console.log(obj.isActive)}
      {console.log(obj.idSpeaker)}
      <div css={`display:flex; flex-direction:row; align-items:center;margin-bottom: 5%;`}>
        <IconUser size="large"></IconUser>
        <Text css={`${textStyle('title4')};`}>{obj.name}, {obj.price}$</Text>
      </div>
      <div css={`display:flex; flex-direction:column; align-items:center;`}>
        <Text css={`${textStyle('label2')}; font-weight:bold;margin-right:2%;`}>Description: </Text>
        <Text css={`${textStyle('body3')};`}> {obj.desc}</Text>
      </div>
      <Button
            display="icon"
            icon={<IconVote/>}
            label="Rate the course"
            size="small"
            onClick={() => {openCreateAssessment(); prueba2(obj.id);}}
            //onClick: abre el modal, actualiza variables globales, actualiza los campos del modal
          />
      {/*<div css={`display:flex; flex-direction:row; align-items:center;`}>
        <Text css={`${textStyle('label2')}; font-weight:bold;margin-right:2%;`}>Price: </Text>
        <Text css={`${textStyle('body3')};`}> </Text>
  </div>*/}
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
