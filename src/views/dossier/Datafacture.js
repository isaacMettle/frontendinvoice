import axios from "axios";
import { onMounted,ref } from "vue";

let invoices =ref([])
const getinvoices = ()=>{
    axios.get("")
    .then(function (resp){
        invoices.value = resp.data
    })
}
onMounted(()=>{})

export {getinvoices}