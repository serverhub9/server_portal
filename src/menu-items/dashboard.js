// assets
import { DashboardOutlined,MessageOutlined ,InboxOutlined,AppstoreOutlined,AppstoreAddOutlined } from '@ant-design/icons';

// icons
const icons = {
  DashboardOutlined,
  InboxOutlined,
  AppstoreAddOutlined ,
  AppstoreOutlined ,
  MessageOutlined 
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  // title: 'Navigation',
  type: 'group',
  children: [
    // {
    //   id: 'dashboard',
    //   title: 'Dashboard',
    //   type: 'item',
    //   url: '/dashboard/default',
    //   icon: icons.DashboardOutlined,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'products',
    //   title: 'Products',
    //   type: 'item',
    //   url: '/products',
    //   icon: icons.InboxOutlined,
    //   breadcrumbs: false
    // },
    {
      id: 'dashboard',
      title: 'My Subscriptions',
      type: 'item',
      url: '/dashboard',
      icon: icons.AppstoreOutlined,
      breadcrumbs: false
    },
    // {
    //   id: 'other_products',
    //   title: 'Explore Other Products',
    //   type: 'item',
    //   url: '/other_products',
    //   icon: icons.AppstoreAddOutlined,
    //   breadcrumbs: false
    // },
    // {
    //   id: 'help_and_support',
    //   title: 'Help And Support',
    //   type: 'item',
    //   url: '/help_and_support',
    //   icon: icons.MessageOutlined,
    //   breadcrumbs: false
    // }
  ]
};

export default dashboard;
