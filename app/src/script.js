import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Aragon, { events } from '@aragon/api'
import { getPrototypeOf } from '@aragon/ui/dist/getPrototypeOf-55c9e80c'

const app = new Aragon()
//prueba
app.store(
  async (state, { event }) => {
    const nextState = {
      ...state,
    }
  
    try {
      switch (event) {
        case 'CreateUser':
          return { ...nextState, usersLength: await getValue(), users: await getNames()/*, priorities: await getP(), isDone: await getisDone()*/}
        case 'DeleteUser':
          return { ...nextState, usersLength: await getValue(), users: await getNames()/*, priorities: await getP(), isDone: await getisDone()*/}
        case 'UpdateUser':
          return { ...nextState, usersLength: await getValue(), users: await getNames()/*, priorities: await getP(), isDone: await getisDone()*/}
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
      usersLength: await getValue(),
      users: await getNames(),
      //priorities: await getP(),
      //isDone: await getisDone()
    }
  }
}

 
async function getValue() {
  return parseInt(await app.call('usersLength').toPromise(), 10)
}

async function getTasks(id) {
  return await app.call('users', id).toPromise()
}

async function getNames() {
  let names = [];
  for(let i = 0; i < await getValue(); i++) {
    let n = await getTasks(i);
    names[i] = n[0];
  }
  return names;
}
async function getP() {
  let names = [];
  for(let i = 0; i < await getValue(); i++) {
    let n = await getTasks(i);
    if(n[1] == 0) {
       names[i] = "HIGH";
    }
    if(n[1] == 1) {
      names[i] = "MEDIUM";
    }
    if(n[1] == 2) {
      names[i] = "LOW";
    }
   
  }
  return names;
}
async function getisDone() {
  let names = [];
  for(let i = 0; i < await getValue(); i++) {
    let n = await getTasks(i);
    if(n[2]){
      names[i] = "Done";
    }
    else {
      names[i] = "In progress";
    }
  }
  return names;
}




