export const menuItems = [
    {
        id: 1,
        label: "menuitems.menu.text",
        isTitle: false,
    },


    {
        id: 2,
        label: "Tableau de bord",
        icon: "bx-home-circle",
        subItems: [
            {
                id: 3,
                label: "menuitems.dashboards.list.default",
                link: "/",
                parentId: 2
            },           

        ]
    },

   


    {
        id: 5,
        label: "Utilisateurs",
        icon: "bx-user",
        link: "/dossier/Utilisateur",
    
    },

    {
        id: 5,
        label: "Clients",
        icon: "bx-user",
        link: "/dossier/client",
    
    },

    {
        id: 3,
        label: "Factures",
        icon: "bx-receipt",
       subItems: [
           {
               id: 4,
               label: "Creer une Facture",
               link: "/dossier/facturelist",//il s'agit du lien ou aura acces au boutton pour creer la facture 
               parentId: 3
           },

           {
               id: 5,
               label: "Liste des factures",
               link: "/dossier/facturedetail",// il s'agit du lien ou le chef comptable pourra voir la liste des factures creer et une facture specifique
               parentId: 3
           },
       ]
     
    },


    {
        id: 4,
        label: "Produits",
        icon: "bx-store",
        link: "/dossier/produit",
      
    },

   

    {
        id: 6,
        label: "Paiement",
        icon: "bx-receipt",
        link: "/",
    
    },

    {
        id: 7,
        isLayout: true
    },
  
];

