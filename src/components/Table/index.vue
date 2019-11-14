<template>
  <div>
    <app-big-image
      v-if="bigImageVisible"
      :img-src="bigImageSrc"
      @clickit="handelClickToDisableBigImage()"
    />
    <div v-if="label" class="margin-bottom-20 font-size-18">{{ label }}</div>
    <el-table
      class="width-percentage-100"
      :ref="ref"
      :data="tableData"
      :border="isBorder"
      :row-key="String(~~Math.random()*1000)"
      stripe
      highlight-current-row
      v-loading="listLoading"
      size="small"
      empty-text="暂无数据"
      :element-loading-text="loadingText"
      :header-cell-style="handleHeaderStyle"
      @selection-change="handleSelectionChange"
    >
      <el-table-column v-if="isSelection" type="selection" width="55" />
      <el-table-column fixed="left" type="index" />

      <!-- <el-table-column type="expand" v-if="hasExpand">
        <template slot-scope="props">
          <slot name="expand" :data="props.row"></slot>
        </template>
      </el-table-column>-->

      <el-table-column
        v-for="(item, index) in config"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :show-overflow-tooltip="item.showOverflowTooltip?true:false"
      >
        <template slot-scope="scope">
          <!-- format = icon, 显示图片 -->
          <span v-if="item.format == 'icon'">
            <img
              title="点击查看大图"
              alt="图片"
              class="image-size"
              :src="scope.row[item.prop]|http2Https"
              @click="handelClickToEnlargeImage($event)"
            />
          </span>
          <!-- format = time, 将时间格式化为去掉秒的数据 -->
          <span
            v-else-if="item.format == 'time'"
          >{{ scope.row[item.prop] | removeTheSecondsOfTime }}</span>
          <span
            v-else-if="item.format == 'timestamp'&&scope.row[item.prop]"
          >{{ scope.row[item.prop] | parseTime }}</span>
          <!-- format = currency, 显示金额 -->
          <span v-else-if="item.format == 'currency'">{{ scope.row[item.prop]| formatToCurrency }}</span>
          <span
            v-else-if="item.format == 'money'"
          >{{ scope.row[item.prop]?'￥'+scope.row[item.prop]:'' }}</span>

          <span v-else-if="item.format == 'rate'">{{ scope.row[item.prop]+"%" }}</span>
          <span v-else-if="item.format == 'boolean'">{{ scope.row[item.prop]?'是':'否' }}</span>
          <span v-else-if="item.format == 'switch'">
            <el-switch
              v-model="scope.row[item.prop]"
              @change="switchChange(scope.row,scope.row[item.prop])"
            />
          </span>
          <span v-else-if="item.format == 'QRcode'&&scope.row[item.prop]">
            <!-- <img class="image-size" :src="scope.row[item.prop]|http2Https" @click="handelClickToEnlargeImage($event)"> -->
            <el-button size="small" @click="isShowQRcodeDialog(scope.row[item.prop])">
              <i class="fa fa-arrow-circle-down" />下载
            </el-button>
          </span>
          <!-- format = move, 上移, 下移事件 -->
          <span v-else-if="item.format == 'move'">
            <el-button v-if="scope.$index !== 0" size="small" @click="handleMoveUp(scope.$index)">
              <i class="fa fa-arrow-circle-up" />上移
            </el-button>
            <el-button
              v-if="scope.$index+1 !== tableData.length"
              size="small"
              @click="handleMoveDown(scope.$index)"
            >
              <i class="fa fa-arrow-circle-down" />下移
            </el-button>
          </span>
          <!-- format = link, 可跳转到另一个界面 -->
          <span v-else-if="item.format == 'link'">
            <u
              class="link"
              @click="handleClickLink(scope.row, item.label)"
            >{{ scope.row[item.prop] }}</u>
          </span>
          <!-- format = a, 网页跳转 -->
          <span v-else-if="item.format == 'a'">
            <u class="link">
              <a :href="scope.row[item.prop]" target="_blank">{{ scope.row[item.prop] }}</a>
            </u>
          </span>
          <!-- 单行添加操作 -->
          <span v-else-if="item.format === 'operation'">
            <el-button
              size="small"
              @click="item.callback(scope.row[item.prop],scope.row,item)"
            >{{ scope.row[item.prop] }}</el-button>
          </span>
          <!-- 没有format -->
          <span v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="isHasButtons" :width="optionColumnWidth+'px'" fixed="right" label="操作">
        <template slot-scope="scope">
          <span
            v-for="(option, index) in getOptionsName(scope.row.buttonKey)"
            :key="index"
            class="button-margin-left"
          >
            <el-button
              :style="getOptionsName(scope.row.buttonKey).length>2?'margin-top:10px;':''"
              size="small"
              :type="index == 0 ? 'primary' : ''"
              @click="handleClickOption(scope.$index, scope.row, option)"
            >
              <span v-html="getButtonHtml(option)" />
            </el-button>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="isShowPagination && total > 0" class="pagination-container">
      <el-pagination
        background
        :current-page="page"
        @size-change="handleSizeChange"
        :page-sizes="pageSizeList"
        @current-change="handleCurrentChange"
        :page-size="limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      />
    </div>
  </div>
</template>

<script>
// 表格组件
import AppBigImage from '@/components/BigImage'

// 默认显示的按钮组名称
const defaultButtonsName = {
  全部: ['查看', '审核'],
  待审核: ['查看', '审核'],
  已审核: ['查看', '置顶'],
  已拒绝: ['查看'],
  已申请: ['查看', '审核'],
  '已审核-未置顶': ['查看', '置顶'],
  '已审核-已置顶': ['查看', '取消置顶'],
  已禁止: ['查看'],
  已下线: ['查看'],
  草稿: ['查看']
}

export default {
  name: 'AppTable',
  components: {
    AppBigImage
    // VueQr
  },
  props: {
    // 是否需要序号
    isShowNumber: {
      type: Boolean,
      default: true
    },
    // 是否需要翻页组件
    isShowPagination: {
      type: Boolean,
      default: true
    },
    // 是否需要栅格
    isBorder: {
      type: Boolean,
      default: true
    },
    // 是否是多选表格，默认非多选 :ref="'multipleTable'"
    isSelection: {
      type: Boolean,
      default: false
    },
    // 是否有操作按钮
    isHasButtons: {
      type: Boolean,
      default: true
    },
    // 表头名称
    label: String,
    // 表格数据
    tableData: Array,
    // 表格配置信息
    config: Array,
    // 扩展信息
    hasExpand: {
      type: Boolean,
      default: false
    },
    // 树形结构
    rowKey: {
      type: String,
      default: 'id'
    },
    load: String,
    // 表格操作列
    options: Array,
    // loading提示框
    loadingText: {
      type: String,
      default: '加载中...'
    },
    // loading状态
    loadingStatus: {
      type: Boolean,
      default: false
    },
    // 表格查询列表参数
    listQueryParams: Object,
    // 根据当前行的状态显示按钮的名称
    buttonsName: {
      type: Object
    },
    // 操作列表宽度，如果设置了，就证明有操作列表
    optionColumnWidth: {
      type: Number,
      default: 100
    },
    // 分页数据
    pageSizeList: {
      type: Array,
      default: function() {
        return [20, 30, 50, 100]
      }
    }
  },

  data() {
    return { bigImageVisible: false, switchValue: false }
  },
  computed: {
    // 看是否是多选表格
    ref() {
      return this.isSelection ? 'multipleTable' : undefined
    },
    // 第几页
    page() {
      return this.listQueryParams.page
    },
    // 每页数据数
    limit() {
      return this.listQueryParams.limit
    },
    // 数据总数
    total() {
      return this.listQueryParams.total
    },
    // 获取当前loading的状态
    listLoading: function() {
      return this.loadingStatus
    }
  },
  methods: {
    // 根据按钮的名称，获取按钮的html样式
    getButtonHtml(name) {
      let className
      switch (name) {
        case '查看':
          className = 'eye'
          break
        case '查看下级':
          className = 'eye'
          break
        case '编辑':
          className = 'pencil'
          break
        case '审核':
          className = 'check-circle'
          break
        case '置顶':
          className = 'arrow-circle-o-up'
          break
        case '取消置顶':
          className = 'times-circle'
          break
        case '推荐':
          className = 'thumbs-o-up'
          break
        case '上线':
          className = 'space-shuttle'
          break
        case '下线':
          className = 'space-shuttle'
          break
        case '删除':
          className = 'times-circle-o'
          break
        case '分析':
          className = 'bar-chart'
          break
        case '排序':
          className = 'sort'
          break
      }
      if (className) {
        return `<span><i class="fa fa-${className}"></i> ${name}</span>`
      } else {
        return name
      }
    },
    // 选中哪一个
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.$emit('subSelected', val)
    },
    // 点击按钮传递给父组件
    handleClickOption(index, row, option) {
      this.$emit('subOpitonButton', index, row, option)
    },
    // 改变翻页组件中每页数据总数
    handleSizeChange(val) {
      this.listQueryParams.limit = val
      // 改变翻页数目，必须将页面=1
      this.listQueryParams.page = 1
      this.$emit('update:listQueryParams', this.listQueryParams)
      this.$emit('toPage')
      this.$emit('subClickPagination')
    },
    // 跳到当前是第几页
    handleCurrentChange(val) {
      this.listQueryParams.page = val
      this.$emit('update:listQueryParams', this.listQueryParams)
      this.$emit('toPage')
      this.$emit('subClickPagination')
    },
    // 设置表头样式
    handleHeaderStyle({ row, column, rowIndex, columnIndex }) {
      return { backgroundColor: '#e5e9f2', color: '#333' }
    },
    // 获取当前操作的按钮组
    getOptionsName(key) {
      // 如果父组件定义了按钮的状态
      if (this.buttonsName) {
        return this.buttonsName[key]
      } else {
        return defaultButtonsName[key]
      }
    },
    // 上移
    handleMoveUp(index) {
      this.tableData[index] = this.tableData.splice(
        index - 1,
        1,
        this.tableData[index]
      )[0]
    },
    // 下移
    handleMoveDown(index) {
      this.tableData[index] = this.tableData.splice(
        index + 1,
        1,
        this.tableData[index]
      )[0]
    },
    // 点击链接
    handleClickLink(row, title) {
      this.$emit('subClickLink', { row: row, title: title })
    },
    // 点击放大图片
    handelClickToEnlargeImage(e) {
      this.bigImageVisible = true
      this.bigImageSrc = e.currentTarget.src
    },
    // 隐藏放大图
    handelClickToDisableBigImage() {
      this.bigImageVisible = false
    },
    // swith  变化的分发事件
    switchChange(row, value) {
      this.$emit('subSwitchChange', { row, value })
    }
  }
}
</script>

<style lang="scss" scoped>
.image-size {
  width: 30px;
  height: 30px;
  cursor: pointer;
}

.button-margin-left {
  margin-left: 8px;
}

.link {
  cursor: pointer;
  color: #4876ff;
}
</style>
 <style lang="scss" >
.el-table__expanded-cell[class*='cell'] {
  padding: 0;
}
</style>
