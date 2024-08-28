
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
        icon: "bx-home",
        roles: ['Admin', 'Chef Comptable', 'Comptable'],
        subItems: [
            {
                id: 3,
                label: "menuitems.dashboards.list.default",
                link: "/default",
                roles: ['Admin', 'Chef Comptable', 'Comptable'],
                parentId: 2
            }
        ]
    },
    {
        id: 3,  // Changed id to avoid duplicate
        label: "Utilisateurs",
        icon: "bx-user",
        link: "/dossier/Utilisateur",
        roles: ['Admin']
    },
    {
        id: 4,  // Changed id to avoid duplicate
        label: "Clients",
        icon: "bx-user-circle",
        link: "/dossier/client",
        roles: ['Admin']
    },
    {
        id: 5,
        label: "Factures",
        icon: "bx-receipt",
        roles: ['Admin', 'Chef Comptable', 'Comptable'],
        subItems: [
            {
                id: 6,  // Changed id to avoid duplicate
                label: "Creer une Facture",
                link: "/dossier/facturelist",
                parentId: 5,
                roles: ['Comptable', 'Admin']
            },
            {
                id: 7,  // Changed id to avoid duplicate
                label: "Liste des factures",
                link: "/dossier/facturedetail",
                parentId: 5,
                roles: ['Chef Comptable', 'Admin']
            }
        ]
    },
    {
        id: 8,
        label: "Produits",
        icon: "bx-store-alt",
        link: "/dossier/produit",
        roles: ['Admin', 'Comptable']
    },

    
    
    {
        id: 12,
        isLayout: true
    }
];
