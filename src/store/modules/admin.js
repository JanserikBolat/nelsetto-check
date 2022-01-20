import axios from 'axios'
const adminModule = {
    namespaced: true,
    state: {
        user: {
            id: null,
            access_token: '',
            isAuthenticated: false
        }
    },
    mutations: {
        setIsAuthenticated(state, value){
            state.user.isAuthenticated = value;
        }
    },
    actions: {
        // eslint-disable-next-line no-empty-pattern
        async loginUser({} , user){
            //const url = window.location.origin.replace('playfields.', '')
            await axios.post(`https://almvtst.ml/crm/user/login`, {
                username: user.tel,
                password: user.password
            }).then(res=>{
                if(res.status===200){
                    window.$cookies.set('access_token', res.data.token.access_token, '1d');
                    window.$cookies.set('id', res.data.user.id, '1d');
                    window.$cookies.set('phone', res.data.user.phone, '1d');
                }
            }).catch(()=>{
                window.$cookies.remove('id');
                window.$cookies.remove('access_token');
                sessionStorage.removeItem('facilities');
                sessionStorage.removeItem('active_facility');
            })
        }
    }
}
export default adminModule;