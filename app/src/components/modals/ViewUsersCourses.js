import React, { useState} from 'react'
import { useAragonApi } from '@aragon/api-react'
import {
    Button,Text, textStyle, TextInput,
    Modal,Card, IconUser
  } from '@aragon/ui'

function ViewUsersCourses(props){
  const { api, appState } = useAragonApi()
  const { courses } = appState    

  return (
    <Modal visible={props.openedViewUsersCourses} onClose={props.closeViewUsersCourses} >
        <div css={`
            display: flex;
            flex-direction: column;
            align-items:center;
          `}>
          <Text css={`${textStyle('label1')};font-size: 17pt; color: #210963`}>Courses </Text>   
          {props.coursesOffered ? renderUsersCourses(props.coursesOffered, courses): console.log("LOADING")}
        </div>
      </Modal>
  )
}
function renderUsersCourses(coursesOffered, courses) {
  return coursesOffered.map((userCourses) => {
    let s = JSON.stringify(courses[userCourses]);
    let obj = JSON.parse(s);

    return (<Card width="300px" height="230px" css={`margin: 2%;`}>
      
      <div css={`width:100%;position:absolute; top:0; display:flex; flex-direction:row;align-items:center;background: #EAECEE;`}>
        <div css={`display:flex; flex-direction:column; align-items:center; margin-left: 4%;`}>
            <Text css={`${textStyle('title4')};`}>{obj.name}, {obj.price}$</Text>
          
        </div>
      </div>
      <div css={`display:flex; flex-direction:column; align-items:center;`}>
        <Text css={`${textStyle('label2')}; font-weight:bold;margin-right:2%;`}>Description: </Text>
        <Text css={`${textStyle('body3')};`}> {obj.desc}</Text>
      </div>
      
      
    </Card>
    )
  })
}
export default ViewUsersCourses