import axios from "axios";
import { onMounted, ref } from "vue";

let clients = ref([]);

const login = () => {
  axios.get("http://127.0.0.1:8000/api/listClient/")
    .then(function (resp) {
      clients.value = resp.data;
    })
    .catch(function (error) {
      console.error("Error fetching clients:", error);
    });
};

onMounted(() => {
  login();
});

export { clients, login };