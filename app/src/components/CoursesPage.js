import React, { useState } from 'react'
import {
    Box, Button, IconAddUser, IconPlus,
    Text, textStyle,
    Card, IconUser, IconVote, IconSwap, IconStarFilled, ProgressBar,
    IconEdit, IconTrash, IconSquarePlus,IconGraph,
  } from '@aragon/ui'
import { useAragonApi } from '@aragon/api-react'
import CreateCourse from './modals/CreateCourse'
import UpdateCourse from './modals/UpdateCourse'
import CreateAssessment from './modals/CreateAssessment'
import ViewAssessments from './modals/ViewAssessments'

function CoursesPage() {
    const { api, appState } = useAragonApi()
    const { courses , coursesLength} = appState

    const [openedCreateCourse, setOpenedCreateCourse] = useState(false)
    const openCreateCourse = () => setOpenedCreateCourse(true)
    const closeCreateCourse = () => setOpenedCreateCourse(false)

    const [openedEditCourse, setOpenedEditCourse] = useState(false)
    const openEditCourse = () => setOpenedEditCourse(true)
    const closeEditCourse = () => setOpenedEditCourse(false)

    const [openedCreateAssessment, setOpenedCreateAssessment] = useState(false)
    const openCreateAssessment = () => setOpenedCreateAssessment(true)
    const closeCreateAssessment = () => setOpenedCreateAssessment(false)

    const [openedViewAssessments, setOpenedViewAssessments] = useState(false)
    const openViewAssessments = () => setOpenedViewAssessments(true)
    const closeViewAssessments = () => setOpenedViewAssessments(false)

    const [nameUpdateCourse, setNameUpdateCourse] = useState(window.nameCourse)
    const [descUpdateCourse, setDescUpdateCourse] = useState(window.desc)
    const [priceUpdateCourse, setPriceUpdateCourse] = useState(window.price)
  
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
                Added Courses : {coursesLength}</Text>

                <Button

                display="icon"
                icon={<IconSquarePlus />}
                label="Create Course"
                onClick={openCreateCourse}
                />
            </div>
            <div css={`
                display:flex; 
                flex-direction:row;
                flex-wrap:wrap; 
                width: 675px;
                `}>
                {console.log(courses)}
                {renderCourses(courses, openEditCourse, api, setNameUpdateCourse, setDescUpdateCourse, setPriceUpdateCourse, openCreateAssessment, openViewAssessments)}
            </div>
            </Box>
            <CreateCourse openedCreateCourse={openedCreateCourse} closeCreateCourse={closeCreateCourse}/>
            <UpdateCourse openedEditCourse={openedEditCourse} closeEditCourse={closeEditCourse} nameUpdateCourse={nameUpdateCourse} setNameUpdateCourse={setNameUpdateCourse}
            descUpdateCourse={descUpdateCourse} setDescUpdateCourse={setDescUpdateCourse} priceUpdateCourse={priceUpdateCourse} setPriceUpdateCourse={setPriceUpdateCourse}/>
            <CreateAssessment openedCreateAssessment={openedCreateAssessment} closeCreateAssessment={closeCreateAssessment} idCourse= {window.idCourse} />
            <ViewAssessments openedViewAssessments={openedViewAssessments} closeViewAssessments={closeViewAssessments}assessments = {window.assessments}/>
        </div>
    )
}
function setidCourse (id) {
  window.idCourse = id;
 
} 
function setAssessments(assessments) {
  window.assessments = assessments;
  console.log("aqui");
  console.log(window.assessments);
}
function renderCourses(courses, openEditCourse, api, setNameUpdateCourse, setDescUpdateCourse, setPriceUpdateCourse, openCreateAssessment, openViewAssessments) {
    return courses.map((course) => {
      let s = JSON.stringify(course);
      let obj = JSON.parse(s);
      let act = obj.isActive ? "Available" : "Unavailable";
      let color= obj.isActive ? "green" : "red";
  
      return (<Card width="280px" height="200px" css={`margin: 3%;`}>
        <div css={`display:flex; flex-direction:row;align-items:center;justify-content: space-between; position:absolute; top:5px; padding-left: 5%; padding-right: 2%;width: 100%;`}>
          <Text css={`${textStyle('body3')}; color: ${color}; margin-right: 10%;`}> {act}</Text>
          <div css={`display:flex; flex-direction:row; `}>
            <Button
              display="icon"
              icon={<IconEdit size="small" />}
              label="Edit course"
              size="mini"
              onClick={() => {openEditCourse(); setNameUpdateCourse(obj.name);setDescUpdateCourse(obj.desc);setPriceUpdateCourse(obj.price);}}
              //onClick: abre el modal, actualiza variables globales, actualiza los campos del modal
            />
            <Button
              css={`margin-left: 10%;`}
              display="icon"
              icon={<IconSwap size="small" />}
              label="Delete user"
              size="mini"
              onClick={() => api.updateCourseState(obj.id).toPromise()}
            />
            <Button
              css={`margin-left: 10%;`}
              display="icon"
              icon={<IconPlus size="small" />}
              label="Take course"
              size="mini"
              onClick={() => api.takeCourse(obj.id).toPromise()}
            />
          </div>
        </div>
        {console.log(obj.isActive)}
        {console.log(obj.idSpeaker)}
        <div css={`display:flex; flex-direction:row; align-items:center;margin-bottom: 5%;`}>
          <IconUser size="large"></IconUser>
          <Text css={`${textStyle('title4')};`}>{obj.name}, {obj.price}$</Text>
        </div>
        <div css={`display:flex; flex-direction:column; align-items:center;`}>
          <Text css={`${textStyle('label2')}; font-weight:bold;margin-right:2%;`}>Description: </Text>
          <Text css={`${textStyle('body3')};`}> {obj.desc}</Text>
        </div>
        <ProgressBar value={0.3}/>
        <div css={`display:flex; flex-direction:row; margin-top:2%;`}>
        <Button
              display="icon"
              icon={<IconVote/>}
              label="Rate the course"
              size="small"
                onClick={() => {openCreateAssessment();setidCourse(obj.id);}}
                //onClick: abre el modal, actualiza variables globales, actualiza los campos del modal
            />
            {console.log(obj.assessments)}
          <Button
            css={`margin-left: 10%;`}
            display="icon"
            icon={<IconGraph/>}
            label="View assessments"
            size="small"
              onClick={() => {openViewAssessments();setAssessments(obj.assessments)}}
              //onClick: abre el modal, actualiza variables globales, actualiza los campos del modal
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
export default CoursesPage
