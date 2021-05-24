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
      <Modal visible={props.openedCreateUser} onClose={props.closeCreateUser} onClosed = {() =>  api.createUser(nameNewUser, emailNewUser).toPromise()}>
      <div css={`
          display: flex;
          flex-direction: column;
          align-items:center;
        `}>
        <Text css={`${textStyle('label1')};font-size: 17pt; color: #34495E`}>Create a new user</Text>

        <div css={`margin-top:5%;`}>
          <Text css={`${textStyle('label1')}; `}>Name: </Text>
          <TextInput
            autofocus
            value={nameNewUser}
            onChange={event => {
              setNameNewUser(event.target.value)
            }}
          />
        </div>
        <div css={`margin-top:2%;`}>
          <Text css={`${textStyle('label1')}; `}>Email: </Text>
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
              background-color:#34495E;
              color: white;
            `}
          label="Create"
          onClick={ props.closeCreateUser}
        />

      </div>
      </Modal> 
    )
}
export default CreateUser