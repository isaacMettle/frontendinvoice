export const menuItems = [
    {
        id: 1,
        label: "menuitems.menu.text",
        isTitle: true
    },

    {
        id: 2,
        label: "menuitems.dashboards.text",
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
               label: "List Facture",
               link: "/dossier/facturelist",
               parentId: 3
           },

           {
               id: 5,
               label: "Factue details",
               link: "/dossier/facturedetail",
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
   /* {
        id: 54,
        label: "menuitems.pages.text",
    
    },
    {
        id: 55,
        label: "menuitems.authentication.text",
        icon: "bx-user-circle",
        subItems: [
            {
                id: 56,
                label: "menuitems.authentication.list.login",
                link: "/auth/login-1",
                parentId: 55
            },
            {
                id: 57,
                label: "menuitems.authentication.list.login-2",
                link: "/auth/login-2",
                parentId: 55
            },
            {
                id: 58,
                label: "menuitems.authentication.list.register",
                link: "/auth/register-1",
                parentId: 55
            },
            {
                id: 59,
                label: "menuitems.authentication.list.register-2",
                link: "/auth/register-2",
                parentId: 55
            },
            {
                id: 60,
                label: "menuitems.authentication.list.recoverpwd",
                link: "/auth/recoverpwd",
                parentId: 55
            },
            {
                id: 61,
                label: "menuitems.authentication.list.recoverpwd-2",
                link: "/auth/recoverpwd-2",
                parentId: 55
            },
            {
                id: 62,
                label: "menuitems.authentication.list.lockscreen",
                link: "/auth/lock-screen",
                parentId: 55
            },
            {
                id: 63,
                label: "menuitems.authentication.list.lockscreen-2",
                link: "/auth/lock-screen-2",
                parentId: 55
            },
            {
                id: 64,
                label: "menuitems.authentication.list.confirm-mail",
                link: "/auth/confirm-mail",
                parentId: 55
            },
            {
                id: 65,
                label: "menuitems.authentication.list.confirm-mail-2",
                link: "/auth/confirm-mail-2",
                parentId: 55
            },
            {
                id: 66,
                label: "menuitems.authentication.list.verification",
                link: "/auth/email-verification",
                parentId: 55
            },
            {
                id: 67,
                label: "menuitems.authentication.list.verification-2",
                link: "/auth/email-verification-2",
                parentId: 55
            },
            {
                id: 68,
                label: "menuitems.authentication.list.verification-step",
                link: "/auth/two-step-verification",
                parentId: 55
            },
            {
                id: 69,
                label: "menuitems.authentication.list.verification-step-2",
                link: "/auth/two-step-verification-2",
                parentId: 55
            }
        ]
    },

    

    {
        id: 70,
        label: "menuitems.utility.text",
        icon: "bx-file",
        subItems: [
            {
                id: 71,
                label: "menuitems.utility.list.starter",
                link: "/pages/starter",
                parentId: 70
            },
            {
                id: 72,
                label: "menuitems.utility.list.maintenance",
                link: "/pages/maintenance",
                parentId: 70
            },
            {
                id: 72,
                label: "menuitems.utility.list.comingsoon",
                link: "/pages/coming-soon",
                parentId: 70
            },
        ]
    },
    {
        id: 78,
        label: "menuitems.components.text",
        isTitle: true
    },
    {
        id: 124,
        label: "menuitems.multilevel.text",
        icon: "bx-share-alt",
        subItems: [
            {
                id: 125,
                label: "menuitems.multilevel.list.level1.1",
                link: "#",
                parentId: 124
            },
            {
                id: 126,
                label: "menuitems.multilevel.list.level1.2",
                parentId: 124,
                subItems: [
                    {
                        id: 127,
                        label: "menuitems.multilevel.list.level1.level2.1",
                        link: "#",
                        parentId: 124
                    },
                    {
                        id: 128,
                        label: "menuitems.multilevel.list.level1.level2.2",
                        link: "#",
                        parentId: 124
                    }
                ]
            }
        ]
    }*/
];