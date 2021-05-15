import React, { useState } from 'react'
import { useAragonApi } from '@aragon/api-react'
import {
    Button,Text, textStyle, TextInput,
    Modal
  } from '@aragon/ui'

function UpdateUser(props) {
    const { api } = useAragonApi();

    return (
      /* Modal update User */
      <Modal visible={props.openedUpdateUser} onClose={props.closeUpdateUser} >
        <div css={`
            display: flex;
            flex-direction: column;
            align-items:center;
            `}>
            <Text css={`${textStyle('label1')};font-size: 17pt; #34495E`}>Update User</Text>

            <div css={`margin-top:5%;`}>
            <Text css={`${textStyle('label1')}; `}>Name: </Text>
            <TextInput
                autofocus
                value={props.nameUpdateUser}
                onChange={event => {
                props.setNameUpdateUser(event.target.value)
                }}
            />
            </div>
            <div css={`margin-top:2%;`}>
            <Text css={`${textStyle('label1')}; `}>Email: </Text>
            <TextInput
                value={props.emailUpdateUser}
                onChange={event => {
                props.setEmailUpdateUser(event.target.value)
                }}
            />
            </div>
            {window.id}
            <Button
            css={`
                margin-top:5%;
                background-color:#34495E;
                color: white;
                `}
            label="Update"
            onClick={() => api.updateUser(window.id, props.nameUpdateUser, props.emailUpdateUser).toPromise()}
            />

        </div>
      </Modal>
    );
}

export default UpdateUser