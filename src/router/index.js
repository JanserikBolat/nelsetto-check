import VueRouter from 'vue-router'
import UserRegister from '../pages/UserRegister.vue'
import TimetableWrapper from '../pages/TimetableWrapper.vue'
import Order from '../pages/Order.vue'
import SingleDay from '../pages/SingleDay.vue'
import OrderConfirmation from '../pages//OrderConfirmation.vue'
import OrderView from '../pages/OrderView.vue'
import SingleOrder from '../pages/SingleOrder.vue'
import SingleBooking from '../pages/SingleBooking.vue'
import EditBooking from '../pages/EditBooking.vue'
import ClientView from '../pages/ClientView.vue'
import FieldSettings from '../pages/FieldSettings.vue'
import LongTermOrder from '../pages/LongTermOrder.vue'
import LongTermSearch from '../pages/LongTermSearch.vue'
import Authorization from '../pages/Authorization.vue'
import Facility from '../pages/Facility.vue'
import Playfield from '../pages/Playfield.vue'
import PageNotFound from '../pages/PageNotFound.vue'
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
import Notifications from "../pages/Notifications";
import FacilityPhotos from "../pages/FacilityPhotos.vue";
import SingleClient from "../pages/SingleClient";
//import store from '../store/store'

const router =  new VueRouter({
    //mode: 'history',
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
            component: Order,
            props: (route)=>({...route.params}),
            
        },
        {
            path: '/day/:id',
            name: 'day',
            component: SingleDay,
            props: (route)=>({...route.params})
        },
        {
            path: '/confirmation',
            name: 'confirmation',
            component: OrderConfirmation,
            props: (route)=>({...route.params}),
            
        },
        {
            path: '/allTime',
            name: 'main',
            component: TimetableWrapper,
            
        },
        {
            path: '/orders',
            name: 'orders',
            component: OrderView,
            
        },
        {
            path: '/order/:id',
            name: 'singleOrder',
            component: SingleOrder,
            props: (route)=>({...route.params}),
            
        },
        {
            path: '/notifications',
            name: 'notifications',
            component: Notifications
        },
        {
            path: '/order/:id/booking/:bookingid',
            name:'singleBooking',
            component: SingleBooking,
            props: (route)=>({...route.params})
        },
        {
            path: '/order/:id/booking/:bookingid/edit',
            name: 'edit',
            component: EditBooking,
            props: (route)=>({...route.params})
        },
        {
            path: '/',
            redirect: {name:'day', params: {id: dayjs().format('DD-MM-YYYY')}},
        },
        {
            path: '/auth',
            name: 'authorization',
            component: Authorization,
            meta: {
                public: true,
                disableIfLoggedIn: true
            }
        },
        {
            path: '/myFacilities/:id',
            name: 'myFacility',
            component: Facility,
            props: (route)=>({...route.params})
        },
        {
            path: '/myFacilities/:id/photos',
            name: 'facilityPhotos',
            component: FacilityPhotos,
            props: (route)=>({...route.params})
        },
        {
            path: '/myFacilities/:id/playfields/:p_id',
            name: 'playfield',
            component: Playfield,
            props: (route)=>({...route.params})
        },
        {
            path: '/longTermOrder',
            name: 'longTermOrder',
            component: LongTermOrder,
            
        },
        {
            path: '/availableBookings',
            name: 'availableBookings',
            component: LongTermSearch,
            
        },
        {
            path: '/clients',
            name: 'clients',
            component: ClientView,
            
        },
        {
            path: '/clients/:id',
            name: 'singleClient',
            component: SingleClient,
            props: (route)=>({...route.params})
        },
        {
            path: '/myFacilites/:id/playfields/:p_id/settings',
            name: 'playfieldSettings',
            component: FieldSettings,
            props: (route)=>({...route.params})
        },
        {
            path: '*',
            component: PageNotFound
        }
    ]
});
router.beforeEach((to, from, next) => {
    // if the route is not public
    let isLogged = !!window.$cookies.get('access_token');
    if (!to.meta.public) {
        // if the user authenticated
        if (isLogged) {
            // continue to the route
            next();
        } else {
            // redirect to login
            next({name: 'authorization'});
        }
    }
    // if the user is authenticated and the route is disabled for authenticated window
    if (isLogged && to.meta.disableIfLoggedIn) {
        // redirect to home
        next({name: 'myFacility', params: {id: window.sessionStorage.getItem('active_facility')}});
    }
    next();
});
export default router