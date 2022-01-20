import { SET_PNAME, SET_SPECIFICATIONS, SET_PLAYFIELD, SET_INDEX} from '../mutation-types.js'
const getDefaultState = ()=>{
    return {
        playfield: {
        }
    }
}

const playfieldModule = {
    namespaced: true,
    state: ()=> getDefaultState(),
    getters:{
        getSurface(state){
            let surface = '';
            switch(state.playfield.surf_type){
                case 0:
                    surface='Трава.';
                    break;
                case 1:
                    surface='Искусственная трава.';
                    break;
                case 2:
                    surface='Паркет.';
                    break;
                case 3:
                    surface='Грунт.';
                    break;
                case 4:
                    surface='Песок.';
                    break;
                case 5: 
                    surface='Бетон.';
                    break
                case 6:
                    surface='Резина.';
                    break;
                default:
                    surface = 'Не указан.'
            }
            return surface;
        },
        getIndoor(state){
            return state.playfield.indoor?'Крытая.':'Открытая.';
        },
        getFormat(state){
            return state.playfield.format?`${state.playfield.format}x${state.playfield.format}.`:'Не указан.'
        },
        getLengthWidth(state){
            return `${state.playfield.length}м x ${state.playfield.width}м.`
        }
    },
    mutations: {
        [SET_PNAME](state, name){
            state.playfield.pf_name = name;
        },
        [SET_SPECIFICATIONS](state, specifications){
            state.playfield.indoor = specifications.indoor;
            state.playfield.surf_type = specifications.surf_type;
            state.playfield.format = specifications.format;
            state.playfield.length = specifications.length;
            state.playfield.width = specifications.width;
        },
        [SET_PLAYFIELD](state, p){
            state.playfield = {...state.playfield, ...p};
        },
        [SET_INDEX](state, i){
            state.playfield.local_sort = i;
        }
    },
    actions: {
        setPlayfield({commit}, value){
            commit(SET_PLAYFIELD, value);
        },
        setPlayfieldName({commit}, value){
            commit(SET_PNAME, value);
        },
        setSpecifications({commit}, value){
            commit(SET_SPECIFICATIONS, value);
        },
        setPlayfieldIndex({commit}, value){
            commit(SET_INDEX, value);
        }
    }
}


export default playfieldModule;