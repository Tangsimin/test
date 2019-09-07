// 导入组件
import Vue from 'vue'
import { Button,Form, FormItem,Input,Message,Container,Header,Aside,
Main,Menu,Submenu,MenuItemGroup,MenuItem,Breadcrumb,Card,BreadcrumbItem,Table,
TableColumn,Switch,Tooltip,Pagination,MessageBox,Dialog,Tag,Row,Col,
Tree,Select,Option,Cascader,Alert,Tabs,tabPane} from 'element-ui'




// 注册为全局可用组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(Card)
Vue.use(BreadcrumbItem)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Row)
Vue.use(Col)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(tabPane)



// Message因为不是一个标签组件,不要使用use的方式进行注册
// 为了方便的能使用Message组件进行信息提示
// 建议将Message组件添加到Vue的原型中
// 添加到原型中的成员,实例对象可以直接访问
Vue.prototype.$message = Message
Vue.prototype.$confirm=MessageBox.confirm
