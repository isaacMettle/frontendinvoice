import axios from "axios";
import { onMounted,ref } from "vue";

let produit =ref([]);
let categories=ref([]);
const getproduit = ()=>{
    axios.get("http://127.0.0.1:8000/api/listProduct")
    .then(function (resp){
        produit.value = resp.data
    })
};
const getcategories = ()=>{
    axios.get("http://127.0.0.1:8000/api/listCategories")
    .then(function (resp){
        categories.value = resp.data
    })
}
onMounted(()=>{
    getproduit();
    getcategories();
})

export {getproduit, getcategories, produit , categories}