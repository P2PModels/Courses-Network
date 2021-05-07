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

            <div css = {`display:flex; flex-direction:column; `}>
            <div css={`display:flex; flex-direction: row; justify-content: space-between; align-items:center; margin-top:5%;`}>
                <Text css={`${textStyle('label1')}; `}>Name: </Text>
                <TextInput
                autofocus
                value={props.nameUpdateCourse}
                onChange={event => {
                    props.setNameUpdateCourse(event.target.value)
                }}
                />
            </div>
            <div css={`display:flex; flex-direction: row; justify-content: space-between; align-items:center; margin-top:5%;`}>
                <Text css={`${textStyle('label1')}; `}>Description: </Text>
                <TextInput
                multiline="true"
                value={props.descUpdateCourse}
                onChange={event => {
                    props.setDescUpdateCourse(event.target.value)
                }}
                />
            </div>
            <div css={`display:flex; flex-direction: row; justify-content: space-between; align-items:center; margin-top:5%;`}>
                <Text css={`${textStyle('label1')}; `}>Price: </Text>
                <TextInput
                type="Number"
                value={props.priceUpdateCourse}
                onChange={event => {
                    props.setPriceUpdateCourse(event.target.value)
                }}
                />
            </div>
            </div>
                {console.log(window.idCourse)}
            <Button
                css={`
                    margin-top:5%;
                    background-color:#34495E;
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