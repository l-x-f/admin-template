// 表格查询参数
export const DefaultTableQuery = {
  page: 1,
  limit: 20,
  importance: undefined,
  title: undefined,
  type: undefined,
  sort: '',
  tab: '',
  total: 0
}

export const defaultParams = {
  perPage: 20,
  page: 1
}
// 根据表格设置的查询参数对象，来配置成服务器的查询url
export function formatQueryObjectToUrl(query) {
  var url = ''
  if (query) {
    // 添加tab的参数
    if (query.tab) {
      url += query.tab + (query.tab.length > 0 ? '&' : '')
    }
    // 添加页面的参数
    if (query.page) {
      url += 'page=' + query.page + '&perPage=' + query.limit
    }
  }

  return url
}

// 表格翻页组件需要重定向url, 带查询参数，变成 /event?status=committed&page=1&perPage=20
export function onPaginationGetQueryUrl(query) {
  // tab页状态
  var status
  if (query.tab && query.tab.length > 0) {
    var startPos = query.tab.indexOf('=')
    status = query.tab.substring(startPos + 1, query.tab.length)
  }
  // 返回的参数
  var params = {
    status: status,
    page: query.page,
    perPage: query.limit
  }
  return params
}

// 根据当前页面的网址url来设置当前表格显示的状态
export function getUrlSetTableListQuery(initTableQuery, route) {
  var listQuery = Object.assign({}, initTableQuery)
  if (route.query) {
    // tab状态值
    if (route.query.status) {
      listQuery.tab = 'status=' + route.query.status
    }
    // 当前页面
    if (route.query.page) {
      listQuery.page = Number(route.query.page)
    }
    // 每页数据数
    if (route.query.perPage) {
      listQuery.limit = Number(route.query.perPage)
    }
  }
  return listQuery
}

export const data = [
  {
    id: 0,
    title: '2016-05-02',
    submitor: '王小虎',
    address: '上海市普陀区金沙江路 1518 弄',
    contacts: '王大锤',
    phone: '13109898789',
    type: '活动',
    status: '待审核',
    time: '2018-12-12 12:12',
    startTime: '2018-01-01 01:01',
    endTime: '2019-12-12 12:12',
    updateTime: '2018-08-08 08:08',
    belong: '打锤社群',
    logo: 'logo',
    creator: '张小凉',
    nickname: '凉凉',
    mail: 'lixing@163.com',
    gender: '男',
    serial: '12312131212',
    trade: '陕西科技有限公司',
    total: '201121212',
    name: '小明',
    permission: '活动管理，用户管理',
    ticket: '社群票',
    count: '50',
    content: '内容1',
    description: '描述1',
    disabled: false,
    orderNo: 'OR180803144331VQ60',
    avatarUrl:
      'https://yooqun-1255313385.cos.ap-beijing.myqcloud.com/m/g/D66F5DBC36FC11E8B43B525400133CB7/l/1527601511.png',
    img:
      'https://yooqun-1255313385.cos.ap-beijing.myqcloud.com/m/g/D66F5DBC36FC11E8B43B525400133CB7/l/1527601511.png'
  },
  {
    id: 1,
    title: '2017-07-07',
    submitor: '刘一刀',
    address: '西安市长安路 12 号',
    contacts: '张一手',
    phone: '13987878789',
    type: '社群',
    status: '已审核',
    time: '2018-10-10 10:10',
    startTime: '2018-09-09 00:09',
    endTime: '2019-11-11 11:11',
    updateTime: '2018-02-02 02:02',
    belong: '跑单活动',
    logo: 'LOGO',
    creator: '王力宏',
    nickname: '长城',
    mail: 'xingxing@163.com',
    gender: '女',
    serial: '98987778',
    trade: "xi'an LTD",
    total: '768129',
    name: '小白',
    permission: '用户管理',
    ticket: '活动票',
    count: '30',
    content: '内容2',
    description: '描述2',
    orderNo: 'OR180803144331VQ60',
    disabled: true,
    avatarUrl:
      'https://yooqun-1255313385.cos.ap-beijing.myqcloud.com/m/g/D66F5DBC36FC11E8B43B525400133CB7/l/1527601511.png',
    img:
      'https://yooqun-1255313385.cos.ap-beijing.myqcloud.com/m/g/D66F5DBC36FC11E8B43B525400133CB7/l/1527601511.png'
  },
  {
    id: 2,
    title: '2017-08-08',
    submitor: '李晓西',
    address: '12 号',
    contacts: '刘二毛',
    phone: '13981212129',
    type: '社群',
    status: '已审核',
    time: '2018-10-10 10:10',
    startTime: '2018-09-09 00:09',
    endTime: '2019-11-11 11:11',
    updateTime: '2018-02-02 02:02',
    belong: '跑单活动',
    logo: 'LOGO',
    creator: '王力宏',
    nickname: '长城',
    mail: 'xingxing@163.com',
    gender: '女',
    serial: '98987778',
    trade: "xi'an LTD",
    total: '768129',
    name: '小白',
    permission: '用户管理',
    ticket: '活动票',
    count: '30',
    content: '内容2',
    description: '描述2',
    orderNo: 'OR180803144331VQ60',
    disabled: false,
    avatarUrl:
      'https://yooqun-1255313385.cos.ap-beijing.myqcloud.com/m/g/D66F5DBC36FC11E8B43B525400133CB7/l/1527601511.png',
    img:
      'https://yooqun-1255313385.cos.ap-beijing.myqcloud.com/m/g/D66F5DBC36FC11E8B43B525400133CB7/l/1527601511.png'
  },
  {
    id: 3,
    title: '2017-07-07',
    submitor: '刘一刀',
    address: '西安市长安路 12 号',
    contacts: '张一手',
    phone: '13987878789',
    type: '社群',
    status: '已审核',
    time: '2018-10-10 10:10',
    startTime: '2018-09-09 00:09',
    endTime: '2019-11-11 11:11',
    updateTime: '2018-02-02 02:02',
    belong: '跑单活动',
    logo: 'LOGO',
    creator: '王力宏',
    nickname: '长城',
    mail: 'xingxing@163.com',
    gender: '女',
    serial: '98987778',
    trade: "xi'an LTD",
    total: '768129',
    name: '小白',
    permission: '用户管理',
    ticket: '活动票',
    count: '30',
    content: '内容2',
    description: '描述2',
    orderNo: 'OR180803144331VQ60',
    disabled: true,
    avatarUrl:
      'https://yooqun-1255313385.cos.ap-beijing.myqcloud.com/m/g/D66F5DBC36FC11E8B43B525400133CB7/l/1527601511.png',
    img:
      'https://yooqun-1255313385.cos.ap-beijing.myqcloud.com/m/g/D66F5DBC36FC11E8B43B525400133CB7/l/1527601511.png'
  },
  {
    id: 4,
    title: '2017-07-07',
    submitor: '刘一刀',
    address: '西安市长安路 12 号',
    contacts: '张一手',
    phone: '13987878789',
    type: '社群',
    status: '已审核',
    time: '2018-10-10 10:10',
    startTime: '2018-09-09 00:09',
    endTime: '2019-11-11 11:11',
    updateTime: '2018-02-02 02:02',
    belong: '跑单活动',
    logo: 'LOGO',
    creator: '王力宏',
    nickname: '长城',
    mail: 'xingxing@163.com',
    gender: '女',
    serial: '98987778',
    trade: "xi'an LTD",
    total: '768129',
    name: '小白',
    permission: '用户管理',
    ticket: '活动票',
    count: '30',
    content: '内容2',
    description: '描述2',
    orderNo: 'OR180803144331VQ60',
    disabled: true,
    avatarUrl:
      'https://yooqun-1255313385.cos.ap-beijing.myqcloud.com/m/g/D66F5DBC36FC11E8B43B525400133CB7/l/1527601511.png',
    img:
      'https://yooqun-1255313385.cos.ap-beijing.myqcloud.com/m/g/D66F5DBC36FC11E8B43B525400133CB7/l/1527601511.png'
  }
]
