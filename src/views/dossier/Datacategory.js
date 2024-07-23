import axios from "axios";
import { onMounted,ref } from "vue";

let categories =ref([])
const getcategories = ()=>{
    axios.get("")
    .then(function (resp){
        categories.value = resp.data
    })
}
onMounted(()=>{})

export {getcategories}

