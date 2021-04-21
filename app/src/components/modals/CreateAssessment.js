import React, { useState} from 'react'
import { useAragonApi } from '@aragon/api-react'
import {
    Button,Text, textStyle, TextInput,
    Modal
  } from '@aragon/ui'

function CreateAssessment(props){
  const { api } = useAragonApi()

  const [titleNewAssessment, setTitleNewAssessment] = useState('')
  const [commentaryNewAssessment, setCommentaryNewAssessment] = useState('')
  const [numericAssessment, setNumericAssessment] = useState('')

  return (
    <Modal visible={props.openedCreateAssessment} onClose={props.closeCreateAssessment} >
        <div css={`
            display: flex;
            flex-direction: column;
            align-items:center;
          `}>
          <Text css={`${textStyle('label1')};font-size: 17pt; color: #210963`}>Rate the course </Text>

          <div css={`margin-top:5%;`}>
            <Text css={`${textStyle('label1')}; color: #47444F`}>Tittle: </Text>
            <TextInput
              autofocus
              value={titleNewAssessment}
              onChange={event => {
                setTitleNewAssessment(event.target.value)
              }}
            />
          </div>
          <div css={`margin-top:2%;`}>
            <Text css={`${textStyle('label1')}; color: #47444F`}>Commentary: </Text>
            <TextInput
              value={commentaryNewAssessment}
              onChange={event => {
                setCommentaryNewAssessment(event.target.value)
              }}
            />
          </div>
          <div css={`margin-top:2%;`}>
            <Text css={`${textStyle('label1')}; color: #47444F`}>Assessment (1-5): </Text>
            <TextInput
              value={numericAssessment}
              type="Number"
              onChange={event => {
                setNumericAssessment(event.target.value)
              }}
            />
          </div>
          {props.idCourse}{titleNewAssessment}{commentaryNewAssessment}{numericAssessment}
          <Button
            css={`
                margin-top:5%;
                background-color:#210963;
                color: white;
              `}
            label="Assess"
            onClick={() => api.createAssessment(props.idCourse, titleNewAssessment, commentaryNewAssessment, numericAssessment).toPromise()}
          />

        </div>
      </Modal>
  )
}
export default CreateAssessment