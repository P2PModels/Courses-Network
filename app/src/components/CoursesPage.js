import React, { useState } from 'react'
import {
  Box, Button, IconAddUser, IconCoin,
  Text, textStyle,
  Card, IconUser, IconVote, IconSwap, IconStarFilled, ProgressBar,
  IconEdit, IconTrash, IconSquarePlus, IconGraph, SearchInput,
} from '@aragon/ui'
import { useAragonApi } from '@aragon/api-react'
import CreateCourse from './modals/CreateCourse'
import UpdateCourse from './modals/UpdateCourse'
import CreateAssessment from './modals/CreateAssessment'
import ViewAssessments from './modals/ViewAssessments'

function CoursesPage() {
  const { api, appState, connectedAccount } = useAragonApi()
  const { courses, coursesLength, users } = appState

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

  const [search, setValue] = useState('')

  return (
    <div>
      <Box
        css={`
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
                margin-left:2%;
                margin-right:4.5%;
                `}>
          <Text css={`
                ${textStyle('label1')};
                font-size: 15pt;
                `}>
            Added Courses : {coursesLength}</Text>

          <SearchInput
            icon={<SearchInput />}
            placeholder="Search..."
            search={search}
            onChange={setValue}
          />

          <Button
            css={`
                  background: #34495E  !important;
                  color: white;
                `
            }
            display="all"
            icon={<IconSquarePlus css={`
                color: white !important;`
            } />}
            label="Add Course"
            onClick={openCreateCourse}
          />
        </div>
        <div css={`
                display:flex; 
                flex-direction:row;
                flex-wrap:wrap; 
                `}>
          {console.log(courses)}
          {renderCourses(courses, openEditCourse, api, setNameUpdateCourse, setDescUpdateCourse, setPriceUpdateCourse, openCreateAssessment, openViewAssessments, search)}
        </div>
      </Box>
      <CreateCourse openedCreateCourse={openedCreateCourse} closeCreateCourse={closeCreateCourse} />
      <UpdateCourse openedEditCourse={openedEditCourse} closeEditCourse={closeEditCourse} 
        descUpdateCourse={descUpdateCourse} setDescUpdateCourse={setDescUpdateCourse} />
      <CreateAssessment openedCreateAssessment={openedCreateAssessment} closeCreateAssessment={closeCreateAssessment} idCourse={window.idCourse} />
      <ViewAssessments openedViewAssessments={openedViewAssessments} closeViewAssessments={closeViewAssessments} assessments={window.assessments} users={users} />
    </div>
  )
}
function setidCourse(id) {
  window.idCourse = id;

}
function setAssessments(assessments) {
  window.assessments = assessments;
  console.log("aqui");
  console.log(window.assessments);
}
function renderCourses(courses, openEditCourse, api, setNameUpdateCourse, setDescUpdateCourse, setPriceUpdateCourse, openCreateAssessment, openViewAssessments, search) {
  let searched = [];
  if (search != "") {
    for (let i = 0; i < courses.length; i++) {
      let s = JSON.stringify(courses[i]);
      let a = JSON.parse(s);
      if (a.name.toString().toLowerCase().includes(search.toString().toLowerCase())) {
        searched.push(a);
      }
    }
  } else {
    searched = courses;
  }

  return searched.map((course) => {
    let s = JSON.stringify(course);
    let obj = JSON.parse(s);
    let act = obj.isActive ? "Available" : "Unavailable";
    let color = obj.isActive ? "green" : "red";

    return (<Card width="300px" height="230px" css={`margin: 2%;`}>

      <div css={`width:100%;position:absolute; top:0; display:flex; flex-direction:row;align-items:center;background: #EAECEE;`}>
        <div css={`display:flex; flex-direction:column; align-items:center; margin-left: 2%;`}>
          <Text css={`${textStyle('title4')};`}>{obj.name} </Text>
          <div css={`display:flex; flex-direction:row; align-items:center; margin-right:auto;`}>
            <Text css={`${textStyle('body4')}; color: ${color}; margin-right: auto;`}> {act} </Text>
            <Button
              css={`margin-left: 10%; height:15px;`}
              display="icon"
              icon={<IconSwap size="tiny" />}
              label="Change availability"
              size="mini"
              onClick={() => api.updateCourseState(obj.id).toPromise()}
            /></div>
          <Text css={`${textStyle('body4')}; margin-right: auto;`}> {obj.price / (10 ** 15)}mEth</Text>

        </div>
        <div css={`display:flex; flex-direction:row; position:absolute; top:0; margin-top:1%; right:0; margin-right:2%;`}>
          <Button
            //<div css={`display:flex; flex-direction:row;align-items:center;justify-content: space-between; position:absolute; top:5px; padding-left: 5%; padding-right: 2%;width: 100%;`}>
            display="icon"
            icon={<IconEdit size="small" />}
            label="Edit course"
            size="mini"
            onClick={() => { openEditCourse(); setidCourse(obj.id); setDescUpdateCourse(obj.desc); }}
          //onClick: abre el modal, actualiza variables globales, actualiza los campos del modal
          />

          <Button
            css={`margin-left: 10%;color:#8FA4B5;min-width:10%;`}
            display="all"
            icon={<IconCoin size="small" />}
            label="BUY"
            size="mini"
            onClick={() => api.takeCourse(obj.id, { value: obj.price }).toPromise()}

          />
        </div>
      </div>
      {console.log(obj.isActive)}
      {console.log(obj.idSpeaker)}

      <div css={`display:flex; flex-direction:column; align-items:center; margin-top:8%`}>
        <Text css={`${textStyle('label2')}; font-weight:bold;margin-right:2%;`}>Description: </Text>
        <Text css={`${textStyle('body3')};`}> {obj.desc}</Text>
      </div>
      <div css={`display:flex; flex-direction:row; align-items:center;width:100%; margin-top: 5%;`}>
        <IconStarFilled css={`color: #F7DC6F;`}></IconStarFilled><ProgressBar value={obj.reputation / 5} />
      </div>
      <div css={`display:flex; flex-direction:row; margin:4%; position: absolute; bottom: 0; right: 0; `}>
        {console.log(obj.assessments)}
        <Button
          css={`margin-left: 10%;`}
          display="icon"
          icon={<IconGraph />}
          label="View assessments"
          size="small"
          onClick={() => { openViewAssessments(); setAssessments(obj.assessments) }}
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
