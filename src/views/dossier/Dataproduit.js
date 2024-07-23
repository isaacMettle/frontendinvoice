import axios from "axios";
import { onMounted,ref } from "vue";

let produit =ref([])
const getproduit = ()=>{
    axios.get("")
    .then(function (resp){
        produit.value = resp.data
    })
}
onMounted(()=>{})

export {getproduit}