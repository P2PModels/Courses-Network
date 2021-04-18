import React, { useState } from 'react'
import { useAragonApi } from '@aragon/api-react'
import {
  Header, 
  Main, SyncIndicator, Tabs, textStyle,
} from '@aragon/ui'
import styled from 'styled-components'
import UsersPage from './components/UsersPage'
import CoursesPage from './components/CoursesPage'

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
        items={['Users', 'Courses']}
        selected={pageSelected}
        onChange={setPageSelected}
      />

      {/*pageSelected Users */}
      {pageSelected == 0 ?  <UsersPage /> : <CoursesPage/>}
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