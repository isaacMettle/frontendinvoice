import axios from "axios";
import { onMounted,ref } from "vue";

let clients =ref([])
const getclients = ()=>{
    axios.get("")
    .then(function (resp){
        clients.value = resp.data
    })
}
onMounted(()=>{})

export {getclients}