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
            max-height: 300px;
            overflow: scroll;
          `}>
          <Text css={`${textStyle('label1')};font-size: 17pt; color: #210963`}>{props.statec} Courses</Text>   
          {props.coursesU ? renderUsersCourses(props.coursesU, courses): console.log("LOADING")}
        </div>
      </Modal>
  )
}
function renderUsersCourses(coursesU, courses) {
  return coursesU.map((userCourses) => {
    let s = JSON.stringify(courses[userCourses]);
    let obj = JSON.parse(s);
    let act = obj.isActive ? "Available" : "Unavailable";
    let color = obj.isActive ? "green" : "red";

    return (<Card width="500px" height="100px" css={`margin: 2%;`}>
      
      <div css={`width:100%; display:flex; flex-direction:row;align-items:center;background: #EAECEE; margin-bottom:auto;`}>
        <div css={`display:flex; flex-direction:column; align-items:center; margin-left: 4%; `}>
            <Text css={`${textStyle('title4')};`}>{obj.name}, {obj.price/(10**15)}mEth </Text>
            <Text css={`${textStyle('body4')}; color: ${color}; margin-right: auto;`}> {act}</Text>
            {/*<Text css={`${textStyle('body4')}; margin-right: auto;`}> {obj.price/(10**15)}mEth</Text>*/}
          
        </div>
      </div>
      <div css={`text-align: center;  display:flex; flex-direction:column; align-items:center;  `}>
        <Text css={`${textStyle('label2')}; font-weight:bold;margin-right:2%;`}>Description: </Text>
        <Text css={`${textStyle('body3')};word-wrap: break-word;max-height: 41px;
    overflow: scroll;`}> {obj.desc}</Text>
      </div>
      
      
    </Card>
    )
  })
}
export default ViewUsersCourses