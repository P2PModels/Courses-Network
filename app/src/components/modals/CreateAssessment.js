import React, { useState} from 'react'
import { useAragonApi } from '@aragon/api-react'
import {
    Button,Text, textStyle, TextInput,
    Modal, Info
  } from '@aragon/ui'

function CreateAssessment(props){
  const { api } = useAragonApi()

  const [titleNewAssessment, setTitleNewAssessment] = useState('')
  const [commentaryNewAssessment, setCommentaryNewAssessment] = useState('')
  const [numericAssessment, setNumericAssessment] = useState('')

  return (
    <Modal visible={props.openedCreateAssessment} onClose={props.closeCreateAssessment} onClosed={() => api.finishCourse(props.idCourse, titleNewAssessment, commentaryNewAssessment, numericAssessment).toPromise()}>
        <div css={`
            display: flex;
            flex-direction: column;
            align-items:center;
          `}>
          <Text css={`${textStyle('label1')};font-size: 17pt; color: ##34495E`}>Finish the course and leave a rating</Text>
          <Info css={`margin:auto; margin-top: 3%;`} title="Congratulations!"> You have completed the course! Leave a comment before you go.</Info>
          <div css = {`display:flex; flex-direction:column; `}>
          <div css={`display:flex; flex-direction: row; justify-content: space-between; align-items:center; margin-top:5%;`}>
            <Text css={`${textStyle('label1')}; `}>Tittle: </Text>
            <TextInput
              autofocus
              value={titleNewAssessment}
              onChange={event => {
                setTitleNewAssessment(event.target.value)
              }}
            />
          </div>
          <div css={`display:flex; flex-direction: row; justify-content: space-between; align-items:center; margin-top:5%;`}>
            <Text css={`${textStyle('label1')}; `}>Commentary: </Text>
            <TextInput
              value={commentaryNewAssessment}
              onChange={event => {
                setCommentaryNewAssessment(event.target.value)
              }}
            />
          </div>
          <div css={`display:flex; flex-direction: row; justify-content: space-between; align-items:center; margin-top:5%;`}>
            <Text css={`${textStyle('label1')}; `}>Rating (1-5): </Text>
            <TextInput
              value={numericAssessment}
              type="Number"
              onChange={event => {
                setNumericAssessment(event.target.value)
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
            label="Assess"
            onClick={props.closeCreateAssessment}
          />

        </div>
      </Modal>
  )
}
export default CreateAssessment