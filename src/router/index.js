import Vue from 'vue'
import Router from 'vue-router'
import '../assets/css/main.css'
import welcome from "../view/welcome";
import Main from '../view/Main'
import Category from "../view/Categroy";
import Book from "../view/Book";
import Borrow from "../view/Borrow";
import User from "../view/User";
import Logs from "../view/Logs";
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main,
      redirect: '/welcome',
      children:[
        {
          path: '/welcome',
          name: welcome,
          component: welcome
        },
        {
          path: '/category',
          name: Category,
          component: Category,
        },
        {
          path: '/book',
          name: Book,
          component: Book,
        },
        {
          path: '/borrow',
          name: 'Borrow',
          component: Borrow,
        },{
          path: '/user',
          name: 'User',
          component: User,
        },{
          path: '/logs',
          name: 'Logs',
          component: Logs,
        }
      ]
    }
  ]
})
