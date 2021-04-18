import React, { useState } from 'react'
import {
    Box, Button, IconAddUser, 
    Text, textStyle,
    Card, IconUser, IconVote, IconSwap,
    IconEdit, IconTrash, IconSquarePlus,
  } from '@aragon/ui'
import { useAragonApi } from '@aragon/api-react'
import CreateCourse from './modals/CreateCourse'
import UpdateCourse from './modals/UpdateCourse'
import CreateAssessment from './modals/CreateAssessment'

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
                {renderCourses(courses, openEditCourse, api, setNameUpdateCourse, setDescUpdateCourse, setPriceUpdateCourse, openCreateAssessment)}
            </div>
            </Box>
            <CreateCourse openedCreateCourse={openedCreateCourse} closeCreateCourse={closeCreateCourse}/>
            <UpdateCourse openedEditCourse={openedEditCourse} closeEditCourse={closeEditCourse} nameUpdateCourse={nameUpdateCourse} setNameUpdateCourse={setNameUpdateCourse}
            descUpdateCourse={descUpdateCourse} setDescUpdateCourse={setDescUpdateCourse} priceUpdateCourse={priceUpdateCourse} setPriceUpdateCourse={setPriceUpdateCourse}/>
            <CreateAssessment openedCreateAssessment={openedCreateAssessment} closeCreateAssessment={closeCreateAssessment}/>
        </div>
    )
}

function renderCourses(courses, openEditCourse, api, setNameUpdateCourse, setDescUpdateCourse, setPriceUpdateCourse, openCreateAssessment) {
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
              label="Edit user"
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
        <Button
              display="icon"
              icon={<IconVote/>}
              label="Rate the course"
              size="small"
                onClick={() => {openCreateAssessment()}}
                //onClick: abre el modal, actualiza variables globales, actualiza los campos del modal
            />
        {/*<div css={`display:flex; flex-direction:row; align-items:center;`}>
          <Text css={`${textStyle('label2')}; font-weight:bold;margin-right:2%;`}>Price: </Text>
          <Text css={`${textStyle('body3')};`}> </Text>
    </div>*/}
      </Card>
      )
    })
  }
export default CoursesPage