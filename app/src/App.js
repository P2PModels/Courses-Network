import React, { useState } from 'react'
import { useAragonApi } from '@aragon/api-react'
import {
  Header, 
  Main, SyncIndicator, Tabs, textStyle, Text
} from '@aragon/ui'
import styled from 'styled-components'
import UsersPage from './components/UsersPage'
import CoursesPage from './components/CoursesPage'
import CoursesTakingPage from './components/CoursesTakingPage'

window.id;
window.name = '';
window.email = '';
window.idCourse;
window.nameCourse = '';
window.desc = '';
window.price;

function App() {
  const { appState, path, requestPath } = useAragonApi()
  const { isSyncing } = appState

  const pathParts = path.match(/^\/tab\/([0-9]+)/)
  const pageIndex = Array.isArray(pathParts)
    ? parseInt(pathParts[1], 10) - 1
    : 0

  //Para seleccionar la Tab
  const [pageSelected, setPageSelected] = useState(0)

  function renderSelectedPage() {
    switch(pageSelected){
      case 0:
        return <UsersPage/>;
      case 1:
        return <CoursesPage/>;
      case 2:
        return <CoursesTakingPage/>;
    }
  }

  return (
    <Main>
      {isSyncing && <SyncIndicator />}
      <Header
        primary="Courses Network"
        secondary={
          <span
            css={`
              ${textStyle('title2')}
            `}
          >
            TFG
          </span>
        }
      />

      <Tabs
        //podemos usar estas tabs para cambiar de users a courses
        items={['Users', 'All Courses', 'Courses Taking']}
        selected={pageSelected}
        onChange={setPageSelected}
      />

      {renderSelectedPage()}
    </Main>
  )
}

const Buttons = styled.div`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 40px;
  margin-top: 20px;
`

export default App