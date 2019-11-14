import AppTable from '@/components/Table'
import { DefaultTableQuery, data, defaultParams } from '@/utils/table.js'
import { objectIsEmpty } from '@/utils'
export default {
  components: {
    AppTable
  },
  data() {
    return {
      params: Object.assign({}, defaultParams),
      // 表格加载laoding
      loadingStatus: false,
      // 表格数据
      tableData: [...data],
      // 表格的查询属性
      listQueryParams: { ...DefaultTableQuery }
    }
  },
  mounted() {
    this.listQueryParams.total = 5
    this.tableData.forEach(val => {
      val.buttonKey = 'normal'
    })
  },
  methods: {
    // 重新刷新列表
    handleRefreshList() {
      this.getList()
    },
    // 清除搜索
    searchClear() {
      if (objectIsEmpty(this.search)) return
      this.listQueryParams.page = 1
      this.search = {}
      this.params = Object.assign({}, defaultParams)
      this.getList()
    }
  }
}
