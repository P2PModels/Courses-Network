import React, { useState} from 'react'
import { useAragonApi } from '@aragon/api-react'
import {
    Button,Text, textStyle, TextInput,
    Modal,Card, IconUser, IconStarFilled
  } from '@aragon/ui'

function ViewAssessments(props){
  const { api } = useAragonApi()


  return (
    <Modal visible={props.openedViewAssessments} onClose={props.closeViewAssessments} >
        <div css={`
            display: flex;
            flex-direction: column;
            align-items:center;
            max-height: 300px;
            overflow: scroll;
          `}>
          <Text css={`${textStyle('label1')};font-size: 17pt; color: #210963`}>Assessments </Text>
           {console.log(props.assessments)}
          {props.assessments ? renderAssessments(props.assessments, props.users): console.log("LOADING")}
          
          
          

        </div>
      </Modal>
  )
}
function renderAssessments(assessments, users) {
    return assessments.map((assessment) => {
      let a = JSON.stringify(assessment);
      let obj = JSON.parse(a);
  
      return (<Card width="500px" height="100px" css={`margin: 3%;`}>
        <div css={`display:flex; flex-direction:row; align-items:center; margin-bottom:auto;width:100%;background: #EAECEE;`}>
          <IconUser size="large"></IconUser>
          <Text css={`${textStyle('label1')};`}>{users[obj.idUser - 1].name}</Text>
        </div> 
        <div css={`display:flex; flex-direction:row; align-items:center; width: 100%; `}>
          <IconStarFilled css= {`color: #F7DC6F;`}></IconStarFilled>
          <Text css={`${textStyle('body3')}; margin-right:5%`}> {obj.assessment}</Text>
          <Text css={`${textStyle('body3')};font-weight: bold;`}>{obj.title}</Text>
        </div>
        
          <Text css={`${textStyle('body3')};word-wrap: break-word;max-height: 41px; overflow: scroll;margin-right:auto;margin-left:1%`}> {obj.commentary}</Text>
       
       
       
      </Card>
      )
    })
  }
export default ViewAssessments