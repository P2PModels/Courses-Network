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
          return { ...nextState, usersLength: await getValue(), users: await getNames()}
        case 'DeleteUser':
          return { ...nextState, usersLength: await getValue(), users: await getNames()}
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
  for(let i = 1; i < await getValue(); i++) {
    let n = await getTasks(i);
    names[i] = n[2];
  }
  return names;
}