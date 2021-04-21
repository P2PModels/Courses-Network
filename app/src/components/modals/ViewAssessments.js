import React, { useState} from 'react'
import { useAragonApi } from '@aragon/api-react'
import {
    Button,Text, textStyle, TextInput,
    Modal,Card, IconUser
  } from '@aragon/ui'

function ViewAssessments(props){
  const { api } = useAragonApi()


  return (
    <Modal visible={props.openedViewAssessments} onClose={props.closeViewAssessments} >
        <div css={`
            display: flex;
            flex-direction: column;
            align-items:center;
          `}>
          <Text css={`${textStyle('label1')};font-size: 17pt; color: #210963`}>Assessments </Text>
           {console.log(props.assessments)}
          {props.assessments ? renderAssessments(props.assessments): console.log("LOADING")}
          
          
          

        </div>
      </Modal>
  )
}
function renderAssessments(assessments) {
    return assessments.map((assessment) => {
      let a = JSON.stringify(assessment);
      let obj = JSON.parse(a);
  
      return (<Card width="280px" height="200px" css={`margin: 3%;`}>
       
        <div css={`display:flex; flex-direction:row; align-items:center;margin-bottom: 5%;`}>
          <IconUser size="large"></IconUser>
          {obj.id}{obj.idUser}
          <Text css={`${textStyle('title4')};`}>{obj.title}, Puntuación: {obj.assessment}</Text>
        </div>
        <div css={`display:flex; flex-direction:column; align-items:center;`}>
          <Text css={`${textStyle('label2')}; font-weight:bold;margin-right:2%;`}>Description: </Text>
          <Text css={`${textStyle('body3')};`}> {obj.commentary}</Text>
        </div>
       
       
      </Card>
      )
    })
  }
export default ViewAssessments