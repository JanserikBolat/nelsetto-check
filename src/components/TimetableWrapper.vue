<template>
<div class="timetable__wrapper">
    <Timetable :id="index"  v-for="day, index in dates" :key="index" :date="day" :infoAboutDay="infoAboutDay[index]" :facility="facility">
        <template v-slot:timeline>
                <div class="timetable__date">
                    <p :class="day===today?'today':''">{{day}}</p>
                </div>
        </template>
    </Timetable>
</div>
</template>
<script>
import Timetable from './Timetable.vue'
import * as dayjs from 'dayjs'
import 'dayjs/locale/ru'
export default {
    components: {
        Timetable
    },
    data(){
        return{
            dates: [], 
            today: dayjs().locale('ru').format('DD MMMM, dd'),
            infoAboutDay: [],
            facility: {
                field1: {
                    id: 1,
                    name: "Spartak Arena",
                    weekdays: {
                        0: { //Воскресенье
                            start_time: '06:00', 
                            end_time: '05:00',
                            price: {
                                //за 30мин
                                '06:00': 4000,
                                '18:00': 6000,
                                '01:00': 3500,
                            }
                        },
                        1: {//Понедельник
                            start_time: '08:00', 
                            end_time: '01:00',
                            price: {
                                //за 30мин
                                '08:00': 3500,
                                '18:00': 6000,
                                '19:00': 7500,
                                '22:30': 6000,
                            }
                            },
                        2: {//Вторник
                            start_time: '08:00', 
                            end_time: '23:00',
                            price: {
                                //за 30мин
                                '08:00': 3500,
                                '18:00': 6000,
                                '19:00': 7500,
                                '22:30': 6000,
                            }
                            },
                        3: {//Среда
                            start_time: '08:00', 
                            end_time: '00:00',
                            price: {
                                //за 30мин
                                '08:00': 3500,
                                '18:00': 6000,
                                '19:00': 7500,
                                '22:30': 6000,
                            }
                            },
                        4: {//Четверг
                            start_time: '08:00', 
                            end_time: '02:00',
                            price: {
                                //за 30мин
                                '08:00': 3500,
                                '18:00': 6000,
                                '19:00': 7500,
                                '22:30': 6000,
                            }
                            },
                        5: {//Пятница
                            start_time: '08:00', 
                            end_time: '02:00',
                            price: {
                                //за 30мин
                                '08:00': 3500,
                                '18:00': 6000,
                                '19:00': 7500,
                                '22:30': 6000,
                            }
                            },
                        6: {//Суббота
                            start_time: '06:00', 
                            end_time: '03:00',
                            price: {
                                //за 30мин
                                '06:00': 4000,
                                '18:00': 6000,
                                '01:00': 3500,
                                }
                            }
                    }
                },
                field2: {
                    id: 2,
                    name: "Lokomotiv Arena",
                     weekdays: {
                        0: { //Воскресенье
                            start_time: '06:00', 
                            end_time: '06:00',
                            price: {
                                //за 30мин
                                '06:00': 4000,
                                '18:00': 6000,
                                '01:00': 3500,
                            }
                        },
                        1: {//Понедельник
                            start_time: '08:00', 
                            end_time: '02:00',
                            price: {
                                //за 30мин
                                '08:00': 3500,
                                '18:00': 6000,
                                '19:00': 7500,
                                '22:30': 6000,
                            }
                            },
                        2: {//Вторник
                            start_time: '08:00', 
                            end_time: '02:00',
                            price: {
                                //за 30мин
                                '08:00': 3500,
                                '18:00': 6000,
                                '19:00': 7500,
                                '22:30': 6000,
                            }
                            },
                        3: {//Среда
                            start_time: '08:00', 
                            end_time: '02:00',
                            price: {
                                //за 30мин
                                '08:00': 3500,
                                '18:00': 6000,
                                '19:00': 7500,
                                '22:30': 6000,
                            }
                            },
                        4: {//Четверг
                            start_time: '08:00', 
                            end_time: '02:00',
                            price: {
                                //за 30мин
                                '08:00': 3500,
                                '18:00': 6000,
                                '19:00': 7500,
                                '22:30': 6000,
                            }
                            },
                        5: {//Пятница
                            start_time: '08:00', 
                            end_time: '02:00',
                            price: {
                                //за 30мин
                                '08:00': 3500,
                                '18:00': 6000,
                                '19:00': 7500,
                                '22:30': 6000,
                            }
                            },
                        6: {//Суббота
                            start_time: '06:00', 
                            end_time: '03:00',
                            price: {
                                //за 30мин
                                '06:00': 4000,
                                '18:00': 6000,
                                '01:00': 3500,
                                }
                            }
                    }
                },
                field3: {
                    id: 3,
                    name: "Dinamo Arena",
                     weekdays: {
                        0: { //Воскресенье
                            start_time: '06:00', 
                            end_time: '03:00',
                            price: {
                                //за 30мин
                                '06:00': 4000,
                                '18:00': 6000,
                                '01:00': 3500,
                            }
                        },
                        1: {//Понедельник
                            start_time: '08:00', 
                            end_time: '02:00',
                            price: {
                                //за 30мин
                                '08:00': 3500,
                                '18:00': 6000,
                                '19:00': 7500,
                                '22:30': 6000,
                            }
                            },
                        2: {//Вторник
                            start_time: '08:00', 
                            end_time: '02:00',
                            price: {
                                //за 30мин
                                '08:00': 3500,
                                '18:00': 6000,
                                '19:00': 7500,
                                '22:30': 6000,
                            }
                            },
                        3: {//Среда
                            start_time: '08:00', 
                            end_time: '02:00',
                            price: {
                                //за 30мин
                                '08:00': 3500,
                                '18:00': 6000,
                                '19:00': 7500,
                                '22:30': 6000,
                            }
                            },
                        4: {//Четверг
                            start_time: '08:00', 
                            end_time: '02:00',
                            price: {
                                //за 30мин
                                '08:00': 3500,
                                '18:00': 6000,
                                '19:00': 7500,
                                '22:30': 6000,
                            }
                            },
                        5: {//Пятница
                            start_time: '08:00', 
                            end_time: '02:00',
                            price: {
                                //за 30мин
                                '08:00': 3500,
                                '18:00': 6000,
                                '19:00': 7500,
                                '22:30': 6000,
                            }
                            },
                        6: {//Суббота
                            start_time: '06:00', 
                            end_time: '03:00',
                            price: {
                                //за 30мин
                                '06:00': 4000,
                                '18:00': 6000,
                                '01:00': 3500,
                                }
                            },
                    }
                },
            }
        }
    },
    created(){
        this.setDate()
    },
    methods:{
        setDate(){
            dayjs.locale('ru')
            var day = dayjs()
            day = day.subtract(7, 'day')
            for(let i = 0;i<30;i++){
                this.infoAboutDay.push(this.setInfo(day.day()))
                this.dates.push(day.format('DD MMMM, dd'))
                day = day.add(1, 'day')
            }
        },
        setInfo(dayOfWeek){
            let infoFieldsDaily = {}
            for(const field in this.facility){
                infoFieldsDaily = {...infoFieldsDaily, [field]:this.facility[field].weekdays[dayOfWeek]}
            }
            return infoFieldsDaily
        }
    }

}
const TIMETABLE__HEIGHT = 195
const TIMETABLE__BEFORE = 7
window.onload = function () {
  window.scrollTo(0, TIMETABLE__HEIGHT*TIMETABLE__BEFORE)
}
window.onbeforeunload = function () {
  window.scrollTo(0, TIMETABLE__HEIGHT*TIMETABLE__BEFORE)
}
</script>
<style scoped lang = "sass">
.timetable__wrapper
    overflow: auto
</style>