import VueRouter from 'vue-router'
import UserRegister from '../components/UserRegister.vue'
import TimetableWrapper from '../components/TimetableWrapper.vue'
import OrderHeader from '../components/OrderHeader.vue'
const router =  new VueRouter({
    routes: [
        {
            name: 'registerUser',
            path: '/register',
            component: UserRegister,
            props: (route)=>({...route.params})
        },
        {
            path: '/order',
            name: 'order',
            component: OrderHeader,
            props: (route)=>({...route.params})
        },
        {
            path: '/',
            name: 'main',
            component: TimetableWrapper
        }
    ]
})
export default router