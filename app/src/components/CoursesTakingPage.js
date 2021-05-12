import React, { useState } from 'react'
import {
  Box, Button, IconAddUser, IconMinus,
  Text, textStyle,
  Card, IconUser, IconVote, IconSwap,
  IconEdit, IconTrash, IconSquarePlus, IconGraph, SearchInput,
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
              placeholder= "Search..."
              search={search} 
              onChange={setValue}
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
        <Box
          css={`
        margin-top:2%;
        display: flex;
        text-align: center;
        
        ${textStyle('title3')};
      `}
        >
          <Text css={`
                  ${textStyle('label1')};
                  font-size: 15pt;
                  `}>
            You are not registered. Go to users' tab to register now!</Text>
        </Box>
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
  
          return (<Card width="280px" height="200px" css={`margin: 2%;`}>
            <div css={`width:100%;position:absolute; top:0; display:flex; flex-direction:row;align-items:center;background: #EAECEE;`}>
              <div css={`display:flex; flex-direction:column; align-items:center; margin-left: 4%;`}>
                  <Text css={`${textStyle('title4')};`}>{obj.name} </Text>
                  <Text css={`${textStyle('body4')}; color: ${color}; margin-right: auto;`}> {act}</Text>
                  <Text css={`${textStyle('body4')}; margin-right: auto;`}> {obj.price/10**15}mEther</Text>
                
              </div>
                <div css={`display:flex; flex-direction:row; position:absolute; right:0; margin-right:3%;`}>
                    <Button
                      css={`margin-left: 10%;`}
                      display="icon"
                      icon={<IconMinus size="small" />}
                      label="Stop taking course"
                      size="mini"
                      onClick={() => {setFinishCourseId(courseTakingId); openCreateAssessment();}}
                    />
                </div>
            </div>
            
            <div css={`display:flex; flex-direction:column; align-items:center;`}>
              <Text css={`${textStyle('label2')}; font-weight:bold;margin-right:2%;`}>Description: </Text>
              <Text css={`${textStyle('body3')};`}> {obj.desc}</Text>
            </div>
            <div css={`display:flex; flex-direction:row; margin-top:2%;`}>
  
            </div>
          <div css={`display:flex; flex-direction:row; margin:4%; position: absolute; bottom: 0; right: 0; `}>
              <Button
                css={`margin-left: 10%;`}
                display="icon"
                icon={<IconGraph />}
                label="View assessments"
                size="small"
                onClick={() => { openViewAssessments(); setAssessments(obj.assessments) }}
              />
  
            </div>
            
          </Card>
  
          )
        })
      } else {
        return (
          <Box
            css={`
          margin-top:2%;
          display: flex;
          text-align: center;
          
          ${textStyle('title3')};
        `}
          >
            <Text css={`
                    ${textStyle('label1')};
                    font-size: 15pt;
                    `}>
              You are not taking a course! Enroll in one.</Text>
          </Box>
        )
      }
    }
  } else {
    return (
      <Box
        css={`
      margin-top:2%;
      display: flex;
      text-align: center;
      
      ${textStyle('title3')};
    `}
      >
        <Text css={`
                ${textStyle('label1')};
                font-size: 15pt;
                `}>
          Connect your account to see the courses you are taking!</Text>
      </Box>
    )
  }
}
export default CoursesTakingPage