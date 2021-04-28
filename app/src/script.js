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
//Asi se accede a los mappings de mappings 
async function getCoursesOffered(idUser, pos){
  return await app.call('coursesOffered',idUser,pos).toPromise()
}//[  [user0[  [pos0, idcurso0][pos1, idcurso1]  ]]  [user1[  ...  ]]  ]

async function getCoursesTaking(idUser, pos){
  return await app.call('coursesTaking',idUser,pos).toPromise()
}

async function getAssessments(idCourse, pos){
  return await app.call('assessments',idCourse,pos).toPromise()
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
    user["coursesTakingLength"] = u[7];
    //Para acceder a los mappings de mappings: prueba contiene los id de 
    //los cursos que ofrece el usuario
    //Esto hay que pensarlo bien porque creo que es mejor pasarle los cursos enteros
    //para poder mostrarlos bien de forma guay
    //por ejemplo pinchando en un usuario te salgan los cursos que ofrece

    let coursesO = []; 
    for(let j = 0; j < u[5]; j++) {
      let c = await getCoursesOffered(i, j);
      coursesO.push(c);
    }
    user["coursesOffered"] = coursesO;

    let coursesTaking = []; 
    for(let j = 0; j < u[7]; j++) {
      let c = await getCoursesTaking(i, j);
      coursesTaking.push(c);
    }
    user["coursesTaking"] = coursesTaking;

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

    let assessments = []; 
    
    for(let j = 0; j < c[7]; j++) {
      let assessment = {};
      let a = await getAssessments(i, j);
      assessment["id"] = a[0];
      assessment["idUser"] = a[1];
      assessment["title"] = a[2];
      assessment["commentary"] = a[3];
      assessment["assessment"] = a[4];
      assessments.push(assessment);
    }
    course["assessments"] = assessments;
    object.push(course);
  }
  return object;
}