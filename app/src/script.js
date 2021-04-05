import 'core-js/stable'
import 'regenerator-runtime/runtime'
import Aragon, { events } from '@aragon/api'

const app = new Aragon()

app.store(
  async (state, { event }) => {
    const nextState = {
      ...state,
    }

    try {
      switch (event) {
        
        case 'CreateUser':
          return { ...nextState, usersLength: await getValue(), users: await getUsers()}
        case 'DeleteUser':
          return { ...nextState, usersLength: await getValue(), users: await getUsers()}
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
      users: await getUsers(),
    }
  }
}

async function getValue() {
  return parseInt(await app.call('usersLength').toPromise(), 10)
} 

async function getUser(id) {
  return await app.call('users', id).toPromise()
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
  for(let i = 1; i < await getValue(); i++) {
    let user = {};
    let u = await getUser(i);
    user["id"] = u[0];
    user["_address"] = u[1];
    user["name"] = u[2];
    user["email"] = u[3];
    user["reputation"] = u[4];
    user["coursesOffered"] = u[5]== null ? [] : u[5] ;
    user["coursesCompleted"] = u[6]== null ? [] : u[6] ;
    object.push(user);
  }
  return object;
}