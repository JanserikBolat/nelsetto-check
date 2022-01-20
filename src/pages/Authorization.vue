<template>
    <div class="authorization">
      <spinner :start="sending" />
        <div class="authorization__inner">
            <div class="header">
                <img src="/img/logo.svg" alt="Nelsette">
            </div>
            <div class="content">
                <div class="content__inner">
                    <div class="content__title">
                        <p class="signIn">Вход</p>
                    </div>
                    <div class="user__inputs">
                            <div class="telephone__input">
                                <label for="telephone">Номер телефона</label>
                                <div class="flex">
                                    <input type="tel" name="telephone" id="telephone" required v-mask="'+7 ### ### ## ##'" placeholder="+7" v-model="tel">
                                </div>
                            </div>
                            <div class="password__input">
                                <label for="password">Пароль</label>
                                <div class="flex">
                                    <input type="password" name="password" id="password" required v-model="password" ref="password">
                                    <span class="showHide">
                                        <i class="fas fa-eye" v-show="showPassword" @click.stop="togglePassword"></i>
                                        <i class="fas fa-eye-slash" v-show="!showPassword" @click.stop="togglePassword"></i>
                                    </span>
                                </div>
                            </div>
                    </div>
                    <div class="signIn__btn" @click="signIn">
                        Войти
                    </div>
                    <p class="forget__password">Забыли пароль?</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {mapGetters, mapState} from 'vuex'
import Spinner from "../components/Spinner.vue";
export default {
    data(){
        return{
            showPassword: false,
            tel: "",
            password: '',
            sending: false
        }
    },
    components: {
      Spinner
    },
    mounted(){
        window.scrollTo(0,0)
    },
    methods: {
        togglePassword(){
            if(this.showPassword){
                this.$refs['password'].type='password';
            }
            else{
                this.$refs['password'].type='text';
            }
            this.showPassword=!this.showPassword;
        }, 
        async signIn(){
            this.sending = true;
            this.$store.dispatch('spinner/setStart', true);
            const unmaskedTel = this.tel.split(' ').join('');
            await this.$store.dispatch('admin/loginUser', {tel: unmaskedTel, password: this.password}).then(async ()=>{
                await this.$store.dispatch('facility/getAllFacilities');
                this.$router.push({path: '/'})
            }).catch(()=>{
                alert('Пожалуйста, убедитесь, что данные были введены правильно!')
            })
            this.sending = false;
        }
    }, computed: {
        ...mapGetters('facility', ['getFacility']),
        ...mapState('spinner', ['start'])
    }
}
</script>
<style lang="scss" scoped>
.authorization{
    background: #f9f9f9;
    min-height: 100vh;
}
:not(i){
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: normal;
}
.header{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 55px;
    background: #FFFFFF;
    box-shadow: 0px 0.5px 0px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(20px);
    .app__title{
        color: #039BE5;
        font-family: 'Grandstander', cursive;
        font-style: normal;
        font-weight: bold;
        font-size: 23.68px;
        line-height: 36px;
        text-align: center;
        letter-spacing: -0.778px;
        font-feature-settings: 'salt' on;
    }
    
}
.content{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24px 16px;
    &__title{
        font-size: 24px;
        line-height: 32px;
        letter-spacing: 0.18px;
        color: #2B2D38;
        margin-bottom: 24px;
    }
    .signIn__btn{
        display: inline-block;
        padding: 10px 14px;
        background: #03A9F4;
        border-radius: 4px;
        margin-bottom: 26px;
        color: white;
    }
    .signIn__btn, .forget__password{
        font-weight: 500;
        font-size: 14px;
        line-height: 16px;
        letter-spacing: 1.25px;
        text-transform: uppercase;
    }
    .forget__password{
        color: #03A9F4;
    }
}
.telephone__input, .password__input{
    position: relative;
    width: 343px;
    background: rgba(33, 33, 33, 0.08);
    border-radius: 4px 4px 0px 0px;
    padding: 8px 16px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.6);
    margin-bottom: 16px;
    p, input{
        font-weight: 500;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.15px;
        color: rgba(0, 0, 0, 0.87);
    }
    input{
            border: none;
            background: transparent;
            &:focus{
                outline-width: 0;
            }
        }
    .flex{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
label{
    font-size: 12px;
    line-height: 16px;
    letter-spacing: 0.4px;
    color: rgba(0, 0, 0, 0.38);
}
</style>