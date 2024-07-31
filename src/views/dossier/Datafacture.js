import axios from "axios";
import { onMounted, ref } from "vue";
import { avatar2 } from "../../assets/images/users/data"
let invoices = ref([]);
let invoice_item = ref([]);
let Invoice_Invoice_item_ClientInfo = ref([]);

const listData = [
  {
    avatar: "M",
    imgSrc: avatar2,
    avatarClass: "primary",
    textClass: "primary",
    linkTo: "/invoices/detail",
  }
  
]
const getInvoices = () => {
  axios.get("http://127.0.0.1:8000/api/listInvoice/")
    .then(function (resp) {
      invoices.value = resp.data;
    })
    .catch(function (error) {
      console.error("Error fetching invoices:", error);
    });
};

const getInvoiceItems = () => {
  axios.get("http://127.0.0.1:8000/api/listInvoiceItem/")
    .then(function (resp) {
      invoice_item.value = resp.data;
    })
    .catch(function (error) {
      console.error("Error fetching invoice items:", error);
    });
};

const getInvoice_Invoice_item_ClientInfo = () => {
  axios.get("http://127.0.0.1:8000/api/Invoice-Invoice_item-ClientInfo/")
    .then(function (resp) {
      Invoice_Invoice_item_ClientInfo.value = resp.data;
    })
    .catch(function (error) {
      console.error("Error fetching invoice Invoice-Invoice_item-ClientInfo:", error);
    });
};

onMounted(() => {
  getInvoices();
  getInvoiceItems ();
  getInvoice_Invoice_item_ClientInfo();
});

export { invoices, getInvoices, invoice_item, getInvoiceItems, Invoice_Invoice_item_ClientInfo, getInvoice_Invoice_item_ClientInfo , listData };
