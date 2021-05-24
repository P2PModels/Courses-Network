import React, { useState } from 'react'
import {
  Box, Button, IconAddUser,
  Text, textStyle,
  Card, IconUser,
  IconEdit, IconTrash, IconFolder,IconStarFilled, SearchInput
} from '@aragon/ui'
import { useAragonApi } from '@aragon/api-react'
import CreateUser from './modals/CreateUser'
import UpdateUser from './modals/UpdateUser'
import ViewUsersCourses from './modals/ViewUsersCourses'


function UsersPage() {
  const { api, appState, connectedAccount } = useAragonApi()
  const { users, usersLength, courses } = appState

  const [openedCreateUser, setOpenedCreateUser] = useState(false)
  const openCreateUser = () => setOpenedCreateUser(true)
  const closeCreateUser = () => setOpenedCreateUser(false)

  const [openedUpdateUser, setOpenedUpdateUser] = useState(false)
  const openUpdateUser = () => setOpenedUpdateUser(true)
  const closeUpdateUser = () => setOpenedUpdateUser(false)

  const [openedViewUsersCourses, setOpenedUsersCourses] = useState(false)
  const openViewUsersCourses = () => setOpenedUsersCourses(true)
  const closeViewUsersCourses = () => setOpenedUsersCourses(false)


  const [nameUpdateUser, setNameUpdateUser] = useState("")
  const [emailUpdateUser, setEmailUpdateUser] = useState("")

  const [search, setValue] = useState('')

  return (
    <div>
      <Box
        css={`
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
          margin-left:2%;
          margin-right:4.5%;
        `}>
          <Text css={`
          ${textStyle('label1')};
          font-size: 15pt;
        `}>
            Registered Users : {usersLength - 1/*Restamos 1 por el User del constructor que no sirve*/}</Text>

          <SearchInput
            icon={<SearchInput />}
            placeholder= "Search users..."
            search={search} 
            onChange={setValue}
          />

          <Button
            css={`
            background: #34495E !important;
            color: white;
          `
            }
            display="all"
            icon={<IconAddUser css={`
          color: white !important;`
            } />}
            label="New user"
            onClick={openCreateUser}
          />
        </div>
        <div css={`
        display:flex; 
        flex-direction:row;
        flex-wrap:wrap;
        `}>
          {console.log(users)}
          {renderUsers(users, openUpdateUser, api, setNameUpdateUser, setEmailUpdateUser, openViewUsersCourses, search)}
        </div>
      </Box>
      <CreateUser openedCreateUser={openedCreateUser} closeCreateUser={closeCreateUser} />
      <UpdateUser openedUpdateUser={openedUpdateUser} closeUpdateUser={closeUpdateUser}
        nameUpdateUser={nameUpdateUser} setNameUpdateUser={setNameUpdateUser}
        emailUpdateUser={emailUpdateUser} setEmailUpdateUser={setEmailUpdateUser} id={window.id} />
      <ViewUsersCourses openedViewUsersCourses={openedViewUsersCourses} closeViewUsersCourses={closeViewUsersCourses} coursesU={window.coursesU} statec = {window.statec}/>
    </div>
  );
}
function setId(id) {
  window.id = id;
}

function setCoursesU(coursesU,s) {
  window.coursesU = coursesU;
  window.statec = s;
}

function renderUsers(users, openEditUser, api, setNameUpdateUser, setEmailUpdateUser, openViewUsersCourses, search) {
  //const zipped = users.map((t, i) => [t]);
  let searched = [];
  if (search != "") {
    for (let i = 0; i < users.length; i++) {
      let s = JSON.stringify(users[i]);
      let a = JSON.parse(s);
      if (a.name.toString().toLowerCase().includes(search.toString().toLowerCase())) {
        searched.push(a);
      }
    }
  } else {
    searched = users;
  }

  return searched.map((user) => {
    let s = JSON.stringify(user);
    let obj = JSON.parse(s);
    return (<Card width="300px" height="230px" css={`margin: 2%;`}>
      <div css={`width:100%;position:absolute; top:0; display:flex; flex-direction:row;align-items:center;background: #EAECEE;`}>
        <div css={`display:flex; flex-direction:row;align-items:center;`} >
          <IconUser size="large"></IconUser>
          <Text css={`${textStyle('title4')};`}>{obj.name}</Text>

        </div>
        <div css={` display:flex; flex-direction:row;align-items:center;position:absolute;right:0; margin-right:2%;`}>
          <Button
            display="icon"
            icon={<IconEdit size="small" />}
            label="Edit user"
            size="mini"
            onClick={() => { openEditUser(); setId(obj.id); setNameUpdateUser(obj.name); setEmailUpdateUser(obj.email); }}
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
          {/*<Button
            css={`margin-left: 10%;`}
            display="icon"
            icon={<IconFolder size="small" />}
            label="My offered courses"
            size="mini"
            onClick={() => { setCoursesU(obj.coursesOffered); openViewUsersCourses(); }}
          />*/}

        </div>
      </div>
      <div>
        <div css={`display:flex; flex-direction:row; align-items:center;`}>
          <Text css={`${textStyle('label2')}; font-weight:bold;margin-right:2%;`}>Email: </Text>
          <Text css={`${textStyle('body3')};`}> {obj.email}</Text>
        </div>
        <div css={`display:flex; flex-direction:row; align-items:center;`}>
          <Text css={`${textStyle('label2')}; font-weight:bold;margin-right:2%;`}>Account: </Text>
          <Text css={`${textStyle('body3')};`}> 0x...{obj._address.substring(37,42)}</Text>
        </div>
       
      </div>
      <div css={`display:flex; flex-direction:row; align-items:center; position:absolute; bottom:0; margin-bottom:5%;  width:100%;  `}>
      <div css={`display:flex; flex-direction:row; align-items:center; margin-left: 8%;`}>
        <div css={`display:flex; flex-direction:column; align-items:center;position:absolute; left:0; margin-left:1%;`}>
          <Text css={`${textStyle('body3')};`}> {obj.coursesOfferedLength}</Text>
          <Button
            css={`font-size:14px; margin-left: 10%; height: 20px; width: 65px; min-width:60px;border:none;box-shadow:none;`}
            display="label"
            label="Offered"
            size="mini"
            onClick={() => { setCoursesU(obj.coursesOffered, "Offered"); openViewUsersCourses(); }}
          />
        </div>
        <div css={`display:flex; flex-direction:column; align-items:center;position:absolute; left:0; margin-left:25%;`}>
          <Text css={`${textStyle('body3')}; `}> {obj.coursesTakingLength}</Text>
          <Button
            css={`font-size:14px; margin-left: 10%; height: 20px; width: 65px; min-width:60px;border:none;box-shadow:none;`}
            display="label"
            label="Taking"
            size="mini"
            onClick={() => { setCoursesU(obj.coursesTaking, "Enrolled"); openViewUsersCourses(); }}
          />
        </div>
        <div css={`display:flex; flex-direction:column; align-items:center;position:absolute; left:0; margin-left:49%;`}>
          <Text css={`${textStyle('body3')}; `}> {obj.coursesCompletedLength}</Text>
          <Button
            css={`font-size:14px; margin-left: 10%;height: 20px; width: 65px; min-width:60px;border:none;box-shadow:none;`}
            display="label"
            label="Completed"
            size="mini"
            onClick={() => { setCoursesU(obj.coursesCompleted, "Completed"); openViewUsersCourses(); }}
          />
        </div>

      </div>
      
        <IconStarFilled css= {`color: #F7DC6F; margin-left:auto;`}></IconStarFilled>
        <Text css={`${textStyle('body2')}; margin-right:8%`}> {obj.reputation}</Text>
      </div>
    </Card>
    )
  })
}
export default UsersPage