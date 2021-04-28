import React, { useState } from 'react'
import {
    Box, Button, IconAddUser, IconMinus,
    Text, textStyle,
    Card, IconUser, IconVote, IconSwap,
    IconEdit, IconTrash, IconSquarePlus,IconGraph,
  } from '@aragon/ui'
import { useAragonApi } from '@aragon/api-react'
import CreateAssessment from './modals/CreateAssessment'
import ViewAssessments from './modals/ViewAssessments'

function CoursesTakingPage() {
    const { api, appState ,connectedAccount} = useAragonApi()
    const { courses , users} = appState

    const [openedCreateAssessment, setOpenedCreateAssessment] = useState(false)
    const openCreateAssessment = () => setOpenedCreateAssessment(true)
    const closeCreateAssessment = () => setOpenedCreateAssessment(false)

    const [openedViewAssessments, setOpenedViewAssessments] = useState(false)
    const openViewAssessments = () => setOpenedViewAssessments(true)
    const closeViewAssessments = () => setOpenedViewAssessments(false)

    return (
        <div>
            <Box
            css={`
            display: flex;
            text-align: center;
            
            ${textStyle('title3')};
            `}
            >
            <div
                css={`
                display: flex;
                flex-direction:row;
                align-items: center;
                justify-content: space-between;
                width: 675px;
                `}>
                <Text css={`
                ${textStyle('label1')};
                font-size: 15pt;
                `}>
                Courses Taking:{} 
                </Text>
            </div>
            <div css={`
                display:flex; 
                flex-direction:row;
                flex-wrap:wrap; 
                width: 675px;
                `}>
                {console.log(connectedAccount)}
                {renderTakingCourses(users, courses, api)}
            </div>
            </Box>
            <CreateAssessment openedCreateAssessment={openedCreateAssessment} closeCreateAssessment={closeCreateAssessment} idCourse= {window.idCourse} />
            <ViewAssessments openedViewAssessments={openedViewAssessments} closeViewAssessments={closeViewAssessments}assessments = {window.assessments}/>
        </div>
    )
}

function renderTakingCourses(users, courses, api, openCreateAssessment, openViewAssessments) {
  let user = 1
  let coursesTaking = users[user]["coursesTaking"];
  return coursesTaking.map((course, courseTakingId) => {
    let s = JSON.stringify(courses[course]);
    let obj = JSON.parse(s);
    let act = obj.isActive ? "Available" : "Unavailable";
    let color= obj.isActive ? "green" : "red";

    return (<Card width="280px" height="200px" css={`margin: 3%;`}>
      <div css={`display:flex; flex-direction:row;align-items:center;justify-content: space-between; position:absolute; top:5px; padding-left: 5%; padding-right: 2%;width: 100%;`}>
        <Text css={`${textStyle('body3')}; color: ${color}; margin-right: 10%;`}> {act}</Text>
        <div css={`display:flex; flex-direction:row; `}>
            <Button
              css={`margin-left: 10%;`}
              display="icon"
              icon={<IconMinus size="small" />}
              label="Stop taking course"
              size="mini"
              onClick={() => api.stopTakingCourse(courseTakingId).toPromise()}
            />
          </div>
      </div>
      <div css={`display:flex; flex-direction:row; align-items:center;margin-bottom: 5%;`}>
        <IconUser size="large"></IconUser>
        <Text css={`${textStyle('title4')};`}>{obj.name}, {obj.price}$</Text>
      </div>
      <div css={`display:flex; flex-direction:column; align-items:center;`}>
        <Text css={`${textStyle('label2')}; font-weight:bold;margin-right:2%;`}>Description: </Text>
        <Text css={`${textStyle('body3')};`}> {obj.desc}</Text>
      </div>
      <div css={`display:flex; flex-direction:row; margin-top:2%;`}>
          {console.log(obj.assessments)}
        </div>
        <div css={`display:flex; flex-direction:row; margin-top:2%;`}>
        <Button
              display="icon"
              icon={<IconVote/>}
              label="Rate the course"
              size="small"
                onClick={() => {openCreateAssessment();setidCourse(obj.id);}}
            />
            {console.log(obj.assessments)}
          <Button
            css={`margin-left: 10%;`}
            display="icon"
            icon={<IconGraph/>}
            label="View assessments"
            size="small"
              onClick={() => {openViewAssessments();setAssessments(obj.assessments)}}
          />
          
          </div>
      {/*<div css={`display:flex; flex-direction:row; align-items:center;`}>
        <Text css={`${textStyle('label2')}; font-weight:bold;margin-right:2%;`}>Price: </Text>
        <Text css={`${textStyle('body3')};`}> </Text>
  </div>*/}
    </Card>
    )
  })
}
export default CoursesTakingPage