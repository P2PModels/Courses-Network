import React, { useState } from 'react'
import {
    Box, Button, IconAddUser, 
    Text, textStyle,
    Card, IconUser,
    IconEdit, IconTrash, 
  } from '@aragon/ui'
import { useAragonApi } from '@aragon/api-react'
import CreateUser from './modals/CreateUser'
import UpdateUser from './modals/UpdateUser'

function UsersPage() {
    const { api, appState } = useAragonApi()
    const { users , usersLength} = appState

    const [openedCreateUser, setOpenedCreateUser] = useState(false)
    const openCreateUser = () => setOpenedCreateUser(true)
    const closeCreateUser = () => setOpenedCreateUser(false)

    const [openedUpdateUser, setOpenedUpdateUser] = useState(false)
    const openUpdateUser = () => setOpenedUpdateUser(true)
    const closeUpdateUser = () => setOpenedUpdateUser(false)

    const [nameUpdateUser, setNameUpdateUser] = useState("")
    const [emailUpdateUser, setEmailUpdateUser] = useState("")

    return (
    <div>
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
        {renderUsers(users, openUpdateUser, api, setNameUpdateUser, setEmailUpdateUser)}
      </div>
    </Box>
    <CreateUser openedCreateUser={openedCreateUser} closeCreateUser={closeCreateUser}/>
    <UpdateUser openedUpdateUser={openedUpdateUser} closeUpdateUser={closeUpdateUser} 
    nameUpdateUser={nameUpdateUser} setNameUpdateUser={setNameUpdateUser}
    emailUpdateUser={emailUpdateUser} setEmailUpdateUser={setEmailUpdateUser} id = {window.id}/>
    </div>
    );
}
function setId(id) {
  window.id = id;
}
function renderUsers(users, openEditUser, api, setNameUpdateUser, setEmailUpdateUser) {
    //const zipped = users.map((t, i) => [t]);
  
    return users.map((user) => {
      console.log(user);
      let s = JSON.stringify(user);
      let obj = JSON.parse(s);
      return (<Card width="250px" height="200px" css={`margin: 3%;`}>
  
        <div css={`display:flex; flex-direction:row;position:absolute; top:5px; right: 0; margin-left:auto; margin-right: 5%;`}>
          <Button
            display="icon"
            icon={<IconEdit size="small" />}
            label="Edit user"
            size="mini"
            onClick={() => {openEditUser(); setId(obj.id);setNameUpdateUser(obj.name); setEmailUpdateUser(obj.email);}}
            //onClick: abre el modal , actualiza los campos del modal y actualiza las variables globales
          />
          <Button
            css={`margin-left: 10%;`}
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
export default UsersPage