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
            <Text css={`${textStyle('label1')};font-size: 17pt; color: #210963`}>Update Course</Text>

            <div css={`margin-top:5%;`}>
                <Text css={`${textStyle('label1')}; color: #47444F`}>Name: </Text>
                <TextInput
                autofocus
                value={props.nameUpdateCourse}
                onChange={event => {
                    props.setNameUpdateCourse(event.target.value)
                }}
                />
            </div>
            <div css={`margin-top:2%;`}>
                <Text css={`${textStyle('label1')}; color: #47444F`}>Description: </Text>
                <TextInput
                multiline="true"
                value={props.descUpdateCourse}
                onChange={event => {
                    props.setDescUpdateCourse(event.target.value)
                }}
                />
            </div>
            <div css={`margin-top:2%;`}>
                <Text css={`${textStyle('label1')}; color: #47444F`}>Price: </Text>
                <TextInput
                type="Number"
                value={props.priceUpdateCourse}
                onChange={event => {
                    props.setPriceUpdateCourse(event.target.value)
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
                onClick={() => api.updateCourse(window.idCourse, props.nameUpdateCourse, props.descUpdateCourse, props.priceUpdateCourse).toPromise()}
            />

            </div>
      </Modal>
    )
}
export default UpdateCourse