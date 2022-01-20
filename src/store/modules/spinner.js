import {SET_START} from '../mutation-types'
const spinnerModule = {
    namespaced: true,
    state: {
        start: false
    },
    mutations: {
        [SET_START](state, bool){
            this.start = bool;
        }
    },
    actions: {
        setStart({commit}, bool){
            commit(SET_START, bool)
        }
    }
}
export default spinnerModule;