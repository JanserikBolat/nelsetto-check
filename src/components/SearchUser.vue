<template>
    <div class="search__user">
        <div class="searchUser__inner">
            <div class="search__input">
                    <label  class="phone__label" for="phone">Номер телефона</label><br>
                    <div class="search__wrapper">
                        <p class="tel__code">+7</p>
                        <input v-model="search" type="tel" id = "phone" name="phone"  title="Ваш телефонный номер"
                        :class="$v.search.$error?'invalid':''"
                        >
                    </div>
            </div>
            <button @click="searchNumber()">Продолжить</button>
        </div>
        <UserInfo v-if="filteredResult.length" :info = filteredResult />
    </div>
</template>
<script>
import axios from 'axios'
import UserInfo from '@/components/UserInfo'
import { required, minLength, maxLength } from 'vuelidate/lib/validators'
export default{
    data(){
        return{
            data: [],
            filteredResult: [],
            search:''
        }
    },
    validations:{
        search: {
          required,
          minLength: minLength(10),
          maxLength: maxLength(10)
        }
    },
    components: {
        UserInfo
    },
    async created(){
        const {data} = await axios.get("https://random-data-api.com//api/users/random_user?size=15")
        this.data = data
        console.log(this.data)
    },
    methods: {
        searchNumber(){
            if(this.$v.$invalid){
                this.$v.$touch()
                return
            }
            else{
                this.filteredResult = this.data.filter((user)=>user.phone_number===this.search)
                if(this.filteredResult.length===0){
                    console.log(this.search)
                    this.$router.push({name: 'registerUser', params: {telephoneNumber: this.search}})
                }
            }
        }
    }

}
</script>
<style lang="sass" scoped>
$font-stack: 'Roboto', sans-serif
body
    margin: 0
    padding: 0
    box-sizing: border-box
.searchUser__inner
    width: 351px
    height: 166px
    margin: 23px 12px 0 12px
    label
        font-family: $font-stack
        font-size: 14px
    .search__wrapper
        position: relative
        p
            position: absolute
            top: -10px
            height: 100%
            left: 2px
            width: 20px
            font-family: $font-stack
            font-size: 14px
        input 
            border-top-style: hidden
            border-right-style: hidden
            border-left-style: hidden
            border-bottom-style: groove
            border-color: #E5E5E5
            width: 100%
            padding-left: 20px
            font-family: $font-stack
            font-size: 14px
        .invalid
            border-color: red
</style>