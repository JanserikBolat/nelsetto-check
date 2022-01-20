import { SET_FID, SET_FACILITY,SET_CONTACTS, SET_NAME, SET_INFR, SET_PAYMENTCONDITION, SET_COUNTRY, SET_COORDINATES, SET_FDESCRIPTION, SET_AVATAR, SET_PFNUM, SET_PLAYFIELDS, ADD_PLAYFIELD, SET_CRMUSER } from "../mutation-types.js";
import axios from "axios";
const getDefaultState = ()=>{
    return {
        facility: {
            id:null,
            fc_name:'',
            country: null,
            city: null,
            address: '',
            latitude: null,
            longitude: null,
            description: '',
            avatar: '',
            pf_num: null,
            playfields: null,
            crm_user_id: null,
            infrstruct: null,
            cancel_time: null,
            prepaid: null,
            contacts:null

    }
    }
}

//const url = window.location.origin.replace('playfields.', '');

const facilityModule = {
    namespaced: true,
    state: ()=> getDefaultState(),
    getters: {
        getFacility: (state)=>{
            return state.facility;
        },
    },
    mutations: {
        [SET_FID](state, id){
            state.facility.id = id;
        },
        [SET_NAME](state, name){
            state.facility.fc_name = name;
        },
        [SET_COUNTRY](state, country){
            state.facility.country = country;
        },
        [SET_COORDINATES](state, coor){
            state.facility.address = coor.address;
            state.facility.latitude = coor.lat;
            state.facility.longitude = coor.lng;
        },
        [SET_FDESCRIPTION](state, description){
            state.facility.description = description;
        },
        [SET_AVATAR](state, avatar){
            state.facility.avatar = avatar;
        },
        [SET_PFNUM](state, pf_num){
            state.facility.pf_num = pf_num;
        },
        [SET_PLAYFIELDS](state, playfields){
            state.facility.playfields = playfields;
            
            state.facility = { ...state.facility };
        },
        [ADD_PLAYFIELD](state, playfield){
            state.facility.playfields.push(playfield); 
        },
        [SET_CRMUSER](state, id){
            state.facility.crm_user_id = id;
        },
        [SET_INFR](state, infr){
            state.facility.infrastruct = infr;
        },
        [SET_PAYMENTCONDITION](state, pcon){
            state.facility.cancel_time = pcon.cancel_time;
            state.facility.prepaid = pcon.prepaid;
        },
        [SET_FACILITY](state, f){
            state.facility = f;                   
        },
        [SET_CONTACTS](state, contacts){
            state.contacts = contacts;
        },
        resetState(state){
            Object.assign(state, getDefaultState())
        }
    },
    actions: {
        resetState({commit}){
            commit('resetState');
          },
        setFacilityId({commit}, value){
                commit(SET_FID, value)
        },
        setFacilityName({commit}, value){
            commit(SET_NAME, value)
        },
        setFacilityCountry({commit}, value){
            commit(SET_COUNTRY, value)
        },
        setFacilityCoordinates({commit}, value){
            commit(SET_COORDINATES, value)
        },
        setFacilityDescription({commit}, value){
            commit(SET_FDESCRIPTION, value)
        },
        setFacilityAvatar({commit}, value){
            commit(SET_AVATAR, value)
        },
        setFacilityNumber({commit}, value){
            commit(SET_PFNUM, value)
        },
        setFacilityPlayfields({commit}, value){
            commit(SET_PLAYFIELDS, value)
        },
        addFacilityPlayfield({commit}, value){
            commit(ADD_PLAYFIELD, value)
        },
        setFacilityAdmin({commit}, value){
            commit(SET_CRMUSER, value)
        },
        setFacilityInfr({commit}, value){
            commit(SET_INFR, value);
        },
        setFacilityContacts({commit}, value){
            commit(SET_CONTACTS, value);
        },
        setFacilityPaymentCondition({commit}, value){
            commit(SET_PAYMENTCONDITION, value);
        },
        setFacility({commit}, value){
            commit(SET_FACILITY, value);
        },
        async setPlayfields({commit, state}){
            await axios.get(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/facility/${state.facility.id}/playfields`, {
                headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
            }).then(res=>commit(SET_PLAYFIELDS, res.data.playfields)).catch(e=>console.log(e));
        },
        async resetFacility({commit}, id){
            await axios.get(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/facility/${id}`, {
            headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}
            }).then(res=>{
                commit(SET_FACILITY, res.data.facility);
                commit(SET_PLAYFIELDS, res.data.facility.playfields)
            }).catch(e=>console.log(e));
        },
        async getAllFacilities({dispatch}){
            return await axios.get(`https://almvtst.ml/crm/user/${window.$cookies.get('id')}/facilities`, {
                headers: {'Authorization': `Bearer ${window.$cookies.get('access_token')}`}}).then(async (res)=>{
                    const result = res.data.user.facilities;
                    const options = [...result.map(e=>{return {value: e.id, text: e.fc_name}})];
                    sessionStorage.setItem('facilities', JSON.stringify(options));
                    sessionStorage.setItem('active_facility', result[0].id);
                    await dispatch('setFacility', result.find(e=>e.id===sessionStorage.getItem('active_facility'))||result[0])
                    await dispatch('setPlayfields');
                });
            }
    }
}

export default facilityModule;