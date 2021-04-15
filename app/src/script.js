import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Aragon, { events } from '@aragon/api'
import { _objectWithoutPropertiesLoose } from '@aragon/ui/dist/objectWithoutPropertiesLoose-1af20ad0'

const app = new Aragon()

app.store(
  async (state, { event }) => {
    const nextState = {
      ...state,
    }

    try {
      switch (event) {
        
        /*case 'CreateUser':
          return { ...nextState, usersLength: await getUsersLength(), users: await getUsers(), coursesLength: await getCoursesLength(), courses: await getCourses()}
        case 'UpdateUser':
          return { ...nextState, usersLength: await getUsersLength(), users: await getUsers(), coursesLength: await getCoursesLength(), courses: await getCourses()}
        case 'DeleteUser':
          return { ...nextState, usersLength: await getUsersLength(), users: await getUsers(), coursesLength: await getCoursesLength(), courses: await getCourses()}
        case 'CreateCourse':
          return { ...nextState, usersLength: await getUsersLength(), users: await getUsers(), coursesLength: await getCoursesLength(), courses: await getCourses()}
        case 'UpdateCourse':
          return { ...nextState, usersLength: await getUsersLength(), users: await getUsers(), coursesLength: await getCoursesLength(), courses: await getCourses()}
        case 'CreateAssessment':
          return { ...nextState, usersLength: await getUsersLength(), users: await getUsers(), coursesLength: await getCoursesLength(), courses: await getCourses()}
          */
          case 'CreateUser':
            return { ...nextState, usersLength: await getUsersLength(), users: await getUsers(), coursesLength: await getCoursesLength(), courses: await getCourses()}
          case 'DeleteUser':
            return { ...nextState, usersLength: await getUsersLength(), users: await getUsers(), coursesLength: await getCoursesLength(), courses: await getCourses()}
          case 'CreateCourse':
              return { ...nextState, usersLength: await getUsersLength(), users: await getUsers(), coursesLength: await getCoursesLength(), courses: await getCourses()}
          
        case events.SYNC_STATUS_SYNCING:
          return { ...nextState, isSyncing: true }
        case events.SYNC_STATUS_SYNCED:
          return { ...nextState, isSyncing: false }
        default:
          return state
      }
    } catch (err) {
      console.log(err)
    }
  },
  {
    init: initializeState(),
  }
)

/***********************
 *                     *
 *   Event Handlers    *
 *                     *
 ***********************/

function initializeState() {
  return async cachedState => {
    return {
      ...cachedState,
      usersLength: await getUsersLength(),
      users: await getUsers(),
      coursesLength: await getCoursesLength(),
      courses: await getCourses(),
    }
  }
}

async function getUsersLength() {
  return parseInt(await app.call('usersLength').toPromise(), 10)
}

async function getCoursesLength() {
  return parseInt(await app.call('coursesLength').toPromise(), 10)
} 

async function getUser(id) {
  return await app.call('users', id).toPromise()
}
async function getCourse(id) {
  return await app.call('courses', id).toPromise()
}
/*async function getNames() {
  let names = [];
  for(let i = 1; i < await getValue(); i++) {
    let n = await getUsers(i);
    names[i] = n[2];
  }
  return names;
}*/
async function getUsers() {
  let object = [];
  for(let i = 1; i < await getUsersLength(); i++) {
    let user = {};
    let u = await getUser(i);
    user["id"] = u[0];
    user["_address"] = u[1];
    user["name"] = u[2];
    user["email"] = u[3];
    user["reputation"] = u[4];
    user["coursesOfferedLength"] = u[5];
    user["coursesCompletedLength"] = u[6];
    user["coursesOffered"] = u[7];
    user["coursesCompleted"] = u[8];
    object.push(user);
  }
  return object;
}

async function getCourses() {
  let object = [];
  for(let i = 0; i < await getCoursesLength(); i++) {
    let course = {};
    let c = await getCourse(i);
    course["id"] = c[0];
    course["name"] = c[1];
    course["desc"] = c[2];
    course["idSpeaker"] = c[3];
    course["isActive"] = c[4];
    course["reputation"] = c[5];
    course["price"] = c[6];
    course["assessmentsLength"] = c[7];

  
    object.push(course);
  }
  return object;
}