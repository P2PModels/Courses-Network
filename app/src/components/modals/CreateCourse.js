import React, { useState } from 'react'
import { useAragonApi } from '@aragon/api-react'
import {
    Button,Text, textStyle, TextInput,
    Modal
  } from '@aragon/ui'

function CreateCourse(props) {
    const { api } = useAragonApi()

    const [nameNewCourse, setNameNewCourse] = useState('')
    const [descNewCourse, setDescNewCourse] = useState('')
    const [priceNewCourse, setPriceNewCourse] = useState('')

    return (
        <Modal visible={props.openedCreateCourse} onClose={props.closeCreateCourse} >
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
    )
}

export default CreateCourse