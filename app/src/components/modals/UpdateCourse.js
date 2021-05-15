import React, { useState } from 'react'
import { useAragonApi } from '@aragon/api-react'
import {
    Button,Text, textStyle, TextInput,
    Modal
  } from '@aragon/ui'

function UpdateCourse (props) {
    const { api } = useAragonApi()

    return (
        <Modal visible={props.openedEditCourse} onClose={props.closeEditCourse} >
            <div css={`
                display: flex;
                flex-direction: column;
                align-items:center;
            `}>
            <Text css={`${textStyle('label1')};font-size: 17pt; color: #34495E`}>Update Course</Text>

           
            
            <div css={`display:flex; flex-direction: column; justify-content: space-between; align-items:center; margin-top:5%;`}>
                <Text css={`${textStyle('label1')}; `}>Description: </Text>
                <TextInput
                multiline="true"
                value={props.descUpdateCourse}
                onChange={event => {
                    props.setDescUpdateCourse(event.target.value)
                }}
                />
            </div>
            
           
            <Button
                css={`
                    margin-top:5%;
                    background-color:#34495E;
                    color: white;
                `}
                label="Update"
                onClick={() => api.updateCourse(window.idCourse, props.descUpdateCourse).toPromise()}
            />

            </div>
      </Modal>
    )
}
export default UpdateCourse