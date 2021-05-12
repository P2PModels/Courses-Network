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
          <Text css={`${textStyle('label1')};font-size: 17pt; color: #34495E`}>Add a new course</Text>

          <div css = {`display:flex; flex-direction:column; `}>
          <div css={`display:flex; flex-direction: row; justify-content: space-between; align-items:center; margin-top:5%;`}>
            <Text css={`${textStyle('label1')}; `}>Name: </Text>
            <TextInput
              autofocus
              value={nameNewCourse}
              onChange={event => {
                setNameNewCourse(event.target.value)
              }}
            />
          </div>
          <div css={`display:flex; flex-direction: row; justify-content: space-between; align-items:center; margin-top:5%;`}>
            <Text css={`${textStyle('label1')}; `}>Description: </Text>
            <TextInput
              multiline="true"
              value={descNewCourse}
              onChange={event => {
                setDescNewCourse(event.target.value)
              }}
            />
          </div>
          <div css={`display:flex; flex-direction: row; justify-content: space-between; align-items:center; margin-top:5%;`}>
            <Text css={`${textStyle('label1')}; `}>Price (in mini Eth): </Text>
            <TextInput
              value={priceNewCourse}
              type="number"
              onChange={event => {
                setPriceNewCourse(event.target.value)
              }}
            />
          </div>
          </div>
          <Button
            css={`
                margin-top:5%;
                background-color:#34495E;
                color: white;
              `}
            label="Create"
            onClick={() => api.createCourse(nameNewCourse, descNewCourse, priceNewCourse*10**15,  {value : priceNewCourse*10**15*10}).toPromise()}
          />

        </div>
      </Modal>
    )
}

export default CreateCourse