<template>
    <div class="main__wrapper">
        <div class="main__inner">
            <p class="error_code">404</p>
            <p class="error_message big">Страница не найдена</p>
            <p class="error_message">Вернитесь на главную страницу: <a @click="goToMain()">Перейти</a></p>
        </div>
    </div>
</template>
<script>
export default {
    mounted(){
        window.scrollTo(0,0)
    },
    methods: {
        goToMain(){
            this.$router.push({path: '/'})
        }
    }
}
</script>
<style lang="scss" scoped>
.main__inner{
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 1.4;
    color: #03a9f4;
    .error_code{
        font-weight: 700;
        font-size: 76px;
        color: #263238;
        margin: 50px 0px;
    }
    .big{
        font-size: 20px;
        margin-bottom: 10px;
    }
    .error_message{
        a{
            text-decoration: underline;
        }
    }

}
</style>