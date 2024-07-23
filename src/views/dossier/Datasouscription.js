import axios from "axios";
import { onMounted,ref } from "vue";

let souscription =ref([])
const getsouscription = ()=>{
    axios.get("")
    .then(function (resp){
        souscription.value = resp.data
    })
}
onMounted(()=>{})

export {getsouscription}