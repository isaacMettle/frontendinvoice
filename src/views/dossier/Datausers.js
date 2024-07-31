import axios from "axios";
import { onMounted, ref } from "vue";
import avatar2 from "@/assets/images/users/avatar-2.jpg"
let Users = ref([]);
let Roles = ref([]);

const candidatesData=[
  {
    image: avatar2,
   
  }
  
];

const getUsers = () => {
  axios.get("http://127.0.0.1:8000/api/listUser")
    .then(function (resp) {
      Users.value = resp.data;
    })
    .catch(function (error) {
      console.error("Error fetching Users:", error);
    });
};

const getRoles = () => {
    axios.get("http://127.0.0.1:8000/api/listRole")
      .then(function (resp) {
        Roles.value = resp.data;
      })
      .catch(function (error) {
        console.error("Error fetching Roles:", error);
      });
  };

onMounted(() => {
  getUsers();
  getRoles();
});

export { Users, getUsers , Roles, getRoles, candidatesData };