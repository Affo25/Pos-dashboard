import React from 'react';

import * as Icon from 'react-feather';

export const SidebarData = [
    {
        label: "Main",
        submenuOpen: true,
        showSubRoute: false,
        submenuHdr: "Main",
        submenuItems: [
        {
            label: "Dashboard",
            icon: <Icon.Grid  />,
            submenu: true,
            showSubRoute: false,
            submenuItems: [
              { label: "Admin Dashboard", link: "/" },
            ]
          },
        ]
      },
      {
        label: "Inventory",
        submenuOpen: true,
        showSubRoute: false,
        submenuHdr: "Inventory",
        submenuItems: [
          { label: "Products", link: "/product-list", icon:<Icon.Box />,showSubRoute: false,submenu: false },
          { label: "Create Product", link: "/add-product", icon:  <Icon.PlusSquare />,showSubRoute: false, submenu: false },
          { label: "Expired Products", link: "/expired-products", icon:  <Icon.Codesandbox  />,showSubRoute: false,submenu: false },
          { label: "Low Stocks", link: "/low-stocks", icon: <Icon.TrendingDown  />,showSubRoute: false,submenu: false },
          { label: "Category", link: "/category-list", icon:  <Icon.Codepen />,showSubRoute: false,submenu: false },
          { label: "Sub Category", link: "/sub-categories", icon:  <Icon.Speaker  />,showSubRoute: false,submenu: false },
        ]
      },
      {
        label: "Stock",
        submenuOpen: true,
        submenuHdr: "Stock",
        submenu: true,
        showSubRoute: false,
        submenuItems: [
          { label: "Manage Stock", link: "/manage-stocks", icon:  <Icon.Package />,showSubRoute: false,submenu: false },
          { label: "Stock Adjustment", link: "/stock-adjustment", icon:  <Icon.Clipboard />,showSubRoute: false,submenu: false },
          { label: "Stock Transfer", link: "/stock-transfer", icon:  <Icon.Truck />,showSubRoute: false,submenu: false }
        ]
      },
      {
        label: "Sales",
        submenuOpen: true,
        submenuHdr: "Sales",
        submenu: false,
        showSubRoute: false,
        submenuItems: [
          { label: "Sales", link: "/sales-list", icon:  <Icon.ShoppingCart />,showSubRoute: false,submenu: false },
          { label: "Invoices", link: "/invoice-report", icon:  <Icon.FileText />,showSubRoute: false,submenu: false },
          { label: "Sales Return", link: "/sales-returns", icon:  <Icon.Copy />,showSubRoute: false,submenu: false },
          { label: "POS", link: "/pos", icon:  <Icon.HardDrive />,showSubRoute: false,submenu: false },
        ]
      },
      {
        label: "Purchases",
        submenuOpen: true,
        submenuHdr: "Purchases",
        showSubRoute: false,
        submenuItems: [
          { label: "Purchases", link: "/purchase-list", icon:  <Icon.ShoppingBag />,showSubRoute: false,submenu: false },
          { label: "Purchase Return", link: "/purchase-returns", icon:  <Icon.RefreshCw />,showSubRoute: false,submenu: false }
        ]
      },
      {
        label: "People",
        submenuOpen: true,
        showSubRoute: false,
        submenuHdr: "People",
        submenuItems: [
          { label: "Suppliers", link: "/suppliers", icon:  <Icon.Users />,showSubRoute: false, submenu: false },
        ]
      },
      {
        label: "User Management",
        superAdminOnly: true,
        submenuOpen: true,
        showSubRoute: false,
        submenuHdr: "User Management",
        submenuItems: [
          { label: "Users", link: "/users", icon:  <Icon.UserCheck />,showSubRoute: false, superAdminOnly: true },
        ]
      },
      {
        label: "Settings",
        submenu: true,
        showSubRoute: false,
        submenuHdr: "Settings",
        submenuItems: [
          { label: "App Settings", submenu: true, 
          showSubRoute: false,
          icon: <Icon.Smartphone/>,
        submenuItems: [
            { label: "Invoice", link: "/invoice-settings",showSubRoute: false },
            { label: "Printer", link: "/printer-settings",showSubRoute: false },
          ]},
          { label: "Logout", link: "/signin", icon:  <Icon.LogOut />,showSubRoute: false }
        ]
      },
]
