import React, { useState } from 'react'
import {
  Box, Button, IconAddUser, IconCircleCheck,
  Text, textStyle,
  Card, IconUser, IconVote, IconSwap,
  IconEdit, IconTrash, IconSquarePlus, IconChat, SearchInput,Info
} from '@aragon/ui'
import { useAragonApi, useConnectedAccount } from '@aragon/api-react'
import CreateAssessment from './modals/CreateAssessment'
import ViewAssessments from './modals/ViewAssessments'

function CoursesTakingPage() {
  const { api, appState, connectedAccount } = useAragonApi()
  const { courses, users } = appState

  const [openedCreateAssessment, setOpenedCreateAssessment] = useState(false)
  const openCreateAssessment = () => setOpenedCreateAssessment(true)
  const closeCreateAssessment = () => setOpenedCreateAssessment(false)

  const [openedViewAssessments, setOpenedViewAssessments] = useState(false)
  const openViewAssessments = () => setOpenedViewAssessments(true)
  const closeViewAssessments = () => setOpenedViewAssessments(false)

  const [finishCourseId, setFinishCourseId] = useState(-1)

  const [search, setValue] = useState('')

  return (
    <div>
      <Box
        css={`
      text-align: center;
      
      ${textStyle('title3')};
      `}
      >
        <SearchInput
              icon={<SearchInput />}
              placeholder= "Search courses..."
              search={search} 
              onChange={setValue}
              css={`margin-left: 425px;`}
        />
        <div css={`
        display:flex; 
        flex-direction:row;
        flex-wrap:wrap;
        `}>
          {renderTakingCourses(users, courses, setFinishCourseId, openCreateAssessment, openViewAssessments, search)}
        </div>
      </Box>
      <CreateAssessment openedCreateAssessment={openedCreateAssessment} closeCreateAssessment={closeCreateAssessment} idCourse={finishCourseId} />
      <ViewAssessments openedViewAssessments={openedViewAssessments} closeViewAssessments={closeViewAssessments} assessments={window.assessments} users={users} />
    </div>
  )
}

function renderTakingCourses(users, courses, setFinishCourseId, openCreateAssessment, openViewAssessments, search) {
  let user = 0;
  if (useConnectedAccount()) {
    for (let i = 0; i < users.length; i++) {
      let s = JSON.stringify(users[i]);
      let obj = JSON.parse(s);
      if (obj._address == useConnectedAccount()) {
        user = obj.id;
      }
    }
    if (user == 0) {
      return (
        
          <Info css={`margin:auto; margin-top: 3%;`} title="Warning">You are not registered. Go to users' tab to register now!</Info>
       
      )
    } else {
      let coursesTaking = users[user - 1]["coursesTaking"];
      if (coursesTaking.length != 0) {
        let searched = [];
        if (search != "") {
          for (let i = 0; i < coursesTaking.length; i++) {
            let actualCourse = courses[coursesTaking[i]];
            if (actualCourse.name.toString().toLowerCase().includes(search.toString().toLowerCase())) {
              searched.push(coursesTaking[i]);
            }
          }
        } else {
          searched = coursesTaking;
        }

        return searched.map((course, courseTakingId) => {
          let s = JSON.stringify(courses[course]);
          let obj = JSON.parse(s);
          let act = obj.isActive ? "Available" : "Unavailable";
          let color = obj.isActive ? "green" : "red";
  
          return (<Card width="300px" height="230px" css={`margin: 2%;`}>
            <div css={`width:100%;position:absolute; top:0; display:flex; flex-direction:row;align-items:center;background: #EAECEE;`}>
              <div css={`display:flex; flex-direction:column; align-items:center; margin-left: 2%;`}>
                  <Text css={`${textStyle('title4')};`}>{obj.name} </Text>
                  <Text css={`${textStyle('body4')}; color: ${color}; margin-right: auto;`}> {act}</Text>
                  <Text css={`${textStyle('body4')}; margin-right: auto;`}> {obj.price/10**15}mEther</Text>
                
              </div>
                <div css={`display:flex; flex-direction:row; position:absolute; top:0; margin-top:1%; right:0; margin-right:2%;`}>
                    <Button
                      css={`margin-left: 10%; color:#8FA4B5`}
                      display="all"
                      icon={<IconCircleCheck size="small" />}
                      label="FINISH COURSE"
                      size="mini"
                      onClick={() => {setFinishCourseId(courseTakingId); openCreateAssessment();}}
                    />
                </div>
            </div>
            
            <div css={`display:flex; flex-direction:column; align-items:center;`}>
              <Text css={`${textStyle('label2')}; font-weight:bold;margin-right:2%;`}>Description: </Text>
              <Text css={`${textStyle('body3')};`}> {obj.desc}</Text>
            </div>
   
          <div css={`display:flex; flex-direction:row; margin:4%; position: absolute; bottom: 0; right: 0; `}>
              <Button
                css={`margin-left: 10%;`}
                display="all"
                icon={<IconChat />}
                label={obj.assessmentsLength}
                size="small"
                onClick={() => { openViewAssessments(); setAssessments(obj.assessments) }}
              />
  
            </div>
            
          </Card>
  
          )
        })
      } else {
        return (
            <Info css={`margin:auto; margin-top: 3%;`} title="Warning">You are not taking a course! Enroll in one.</Info>
        )
      }
    }
  } else {
    return (
        <Info css={`margin:auto; margin-top: 3%;`} title="Warning">Connect your account to see the courses you are taking!</Info>
    )
  }
}
export default CoursesTakingPage