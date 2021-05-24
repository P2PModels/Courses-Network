import React, { useState } from 'react'
import { useAragonApi } from '@aragon/api-react'
import {
    Button,Text, textStyle, TextInput,
    Modal, Info
  } from '@aragon/ui'

function CreateCourse(props) {
    const { api } = useAragonApi()

    const [nameNewCourse, setNameNewCourse] = useState('')
    const [descNewCourse, setDescNewCourse] = useState('')
    const [priceNewCourse, setPriceNewCourse] = useState('')

    return (
        <Modal visible={props.openedCreateCourse} onClose={props.closeCreateCourse} onClosed={() => api.createCourse(nameNewCourse, descNewCourse, priceNewCourse*10**15,  {value : priceNewCourse*10**15*10}).toPromise()}>
        <div css={`
            display: flex;
            flex-direction: column;
            align-items:center;
          `}>
          <Text css={`${textStyle('label1')};font-size: 17pt; color: #34495E`}>Add a new course</Text>
          <Info css={`margin:auto; margin-top: 3%;`} title="Warning"> To ensure the validity of 
          your course and to trust your teaching commitment, you must pay a deposit of 10 times 
          the value of the course to create it. This deposit will be refunded each time a user enrolls.</Info>
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
            <Text css={`${textStyle('label1')}; `}>Price in mini Eth (0-9): </Text>
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
            onClick={props.closeCreateCourse}
          />

        </div>
      </Modal>
    )
}

export default CreateCourse