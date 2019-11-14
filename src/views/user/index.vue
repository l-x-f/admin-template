<template>
  <div>
    <!-- 检索 -->
    <el-card class="margin-top-20">
      <el-row :gutter="20">
        <el-col :span="8" :xs="24" class="custom-col">
          <label class="custom-col-label">微信昵称：</label>
          <div class="custom-col-item">
            <el-input
              v-model="search.nickname"
              placeholder="请输入微信昵称"
              size="small"
              clearable
              @keyup.enter.native="handleSearch"
            />
          </div>
        </el-col>
        <el-col :span="8" :xs="24" class="custom-col">
          <label class="custom-col-label">用户身份：</label>
          <div class="custom-col-item">
            <el-select v-model="search.type" placeholder="请选择" @change="handleSearch">
              <el-option
                v-for="(item,index) in options"
                :key="index"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12" :xs="24" class="custom-col">
          <label class="custom-col-label">首次登陆时间：</label>
          <div class="custom-col-item">
            <el-date-picker
              v-model="search.time"
              v-bind="{...pickerAttribute}"
              @change="handleSearch"
            />
          </div>
        </el-col>
      </el-row>

      <!-- 检索按钮 -->
      <el-row class="margin-top-20">
        <search-buttons @subSearch="handleSearch" @subClear="searchClear" />
      </el-row>
    </el-card>

    <!-- 数据展示 -->
    <el-card class="margin-top-20">
      <div class="margin-top-10">
        <app-table
          :list-query-params.sync="listQueryParams"
          :config="tableConfig"
          :table-data="tableData"
          :loading-status="loadingStatus"
          :is-has-buttons="false"
          @subClickPagination="handleRefreshList"
        />
      </div>
    </el-card>
  </div>
</template>

<script>
// 用户
import { formatDate, objectIsEmpty, pickerAttribute } from '@/utils'
import tableMixin from '@/utils/tableMixin'
import UserServe from '@/api/user'
export default {
  name: 'UserList',
  mixins: [tableMixin],
  data() {
    return {
      pickerAttribute,
      tableConfig: [
        {
          label: '微信昵称',
          width: '120px',
          prop: 'nickname'
        },
        {
          label: '头像',
          width: '80px',
          prop: 'avatarUrl',
          format: 'icon'
        },
        {
          label: '性别',
          width: '80px',
          prop: 'customSex'
        },
        {
          label: '首次登陆时间',
          width: '140px',
          prop: 'firstJoin'
        },
        {
          label: '用户身份',
          width: '120px',
          prop: 'customMemberType'
        },
        {
          label: '被收藏数',
          width: '120px',
          prop: 'collected'
        },
        {
          label: '收藏会员数',
          width: '120px',
          prop: 'collector'
        },
        {
          label: '人脉',
          width: '120px',
          prop: 'fans'
        },
        {
          label: '积分',
          prop: 'unconsumed'
        }
      ],
      search: {
        nickname: '',
        type: '',
        time: []
      },
      // 用户身份
      options: [
        {
          value: '1',
          label: '会员'
        },
        {
          value: '0',
          label: '非会员'
        }
      ]
    }
  },
  created() {
    // 获取内容列表
    // this.getList();
  },

  methods: {
    // 获取列表
    async getList() {
      try {
        this.loadingStatus = true
        const { limit, page } = this.listQueryParams
        this.params.perPage = limit
        this.params.page = page
        const {
          items,
          page: { total }
        } = await UserServe.getUserList(this.params)
        this.tableData = items
        this.listQueryParams.total = total
        this.tableData.forEach(val => {
          val.buttonKey = 'normal'
          val.customMemberType = val.isMember ? '会员' : '普通'
          val.customSex = val.sex === 1 ? '男' : '女'
        })
      } catch (error) {
        console.log(error)
      }
      this.loadingStatus = false
    },

    // 搜索
    handleSearch() {
      console.log(this.search, 'this.search')
      if (objectIsEmpty(this.search)) {
        this.$message.close()
        this.$message({
          message: '未添加筛选条件',
          type: 'warning'
        })
        return
      }
      this.listQueryParams.page = 1
      this.search.nickname && (this.params.name = this.search.nickname)
      this.search.type && (this.params.isMember = this.search.type)
      if (this.search.time && this.search.time.length) {
        this.params.startAt = this.search.time[0]
        this.params.endAt = this.search.time[1]
      }
      this.getList()
    }
  }
}
</script>

<style lang='scss' scoped>
.custom-col-label {
  flex-basis: 120px;
}
</style>
