export const menuItems = [
    {
        id: 1,
        label: "menuitems.menu.text",
        isTitle: true,

        roles: ['Admin', 'Chef Comptable', 'Comptable']
    },



    {
        id: 2,
        label: "Tableau de bord",
        icon: "bx-home-circle",
        roles: ['Admin', 'Chef Comptable', 'Comptable'],
        subItems: [
            {
                id: 3,
                label: "menuitems.dashboards.list.default",
                link: "/default",
                roles: ['Admin', 'Chef Comptable', 'Comptable'],
                parentId: 2
            },           

        ]
    },

   


    {
        id: 5,
        label: "Utilisateurs",
        icon: "bx-user",
        link: "/dossier/Utilisateur",
        roles: ['Admin'],
    
    },

    {
        id: 5,
        label: "Clients",
        icon: "bx-user",
        link: "/dossier/client",
        roles: ['Admin', 'Comptable']
    
    },

    {
        id: 3,
        label: "Factures",
        icon: "bx-receipt",
        roles: ['Admin', 'Chef Comptable', 'Comptable'],
       subItems: [
           {
               id: 4,
               label: "Creer une Facture",
               link: "/dossier/facturelist",//il s'agit du lien ou aura acces au boutton pour creer la facture 
               parentId: 3,
               roles: ['Comptable', 'Admin']
           },

           {
               id: 5,
               label: "Liste des factures",
               link: "/dossier/facturedetail",// il s'agit du lien ou le chef comptable pourra voir la liste des factures creer et une facture specifique
               parentId: 3,
               roles: ['Chef Comptable', 'Admin']
           },
       ]
     
    },


    {
        id: 4,
        label: "Produits",
        icon: "bx-store",
        link: "/dossier/produit",
        roles: ['Admin','Comptable']
      
    },

   

    /*{
        id: 8, // Assurez-vous que cet id est unique
        label: "Déconnexion",
        icon: "bx-log-out",
        roles: ['Admin', 'Chef Comptable', 'Comptable', 'Client'],
        action: 'logout' // Ajoutez une clé action pour identifier cette option comme bouton de déconnexion
    },*/
   

    {
        id: 6,
        label: "Paiement",
        icon: "bx-receipt",
        link: "/",
        roles: ['Admin, Client']
    
    },

    {
        id: 7,
        isLayout: true
    },
  
];

