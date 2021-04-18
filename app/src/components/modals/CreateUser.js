import React, { useState } from 'react'
import { useAragonApi } from '@aragon/api-react'
import {
    Button,Text, textStyle, TextInput,
    Modal
  } from '@aragon/ui'


function CreateUser(props){
  const { api } = useAragonApi()

  const [nameNewUser, setNameNewUser] = useState('')
  const [emailNewUser, setEmailNewUser] = useState('')

    return (
      <Modal visible={props.openedCreateUser} onClose={props.closeCreateUser} >
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
    )
}
export default CreateUser