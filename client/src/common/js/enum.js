/**
 * 项目枚举
 */
import { Options2Object } from 'base/js/util'

/**
 * ERP数据库类型
 */
export const ErpSqlTypeOptions = [
  { text: 'sqlserver', value: 1 },
  { text: 'mysql', value: 2 },
]
export const ErpSqlTypeOptionsData = Options2Object(ErpSqlTypeOptions)


/**
 * 供应商上传文件类型
 */
export const SupplierFileTypeOptions = [
  { text: '供应商调查表', value: 0 },
  { text: '供应商联络函', value: 1 },
  { text: '供货质保协议', value: 2 },
  { text: '保密协议', value: 3 },
  { text: '廉洁协议', value: 4 },
  { text: '知识产权声明', value: 5 },
  { text: '采购产品知识产权信息表', value: 6 },
  { text: '订单查收补充协议', value: 7 },
  { text: '环境要求告知书', value: 8 },
  { text: '环保协议', value: 9 },
  { text: '营业执照', value: 10 },
  { text: '代理证', value: 11 },
  { text: 'ISO认证证书', value: 12 },
  { text: 'ROHS报告', value: 13 },
  { text: '卤素报告', value: 14 },
  { text: '其他证件', value: 15 }
]
export const SupplierFileTypeOptionsData = Options2Object(SupplierFileTypeOptions)

/**
 * 供应商联系人类型
 */
export const SupplierContactTypeOptions = [
  { text: '主负责人', value: 1 },
  { text: '业务负责', value: 2 },
  { text: '品质负责', value: 3 },
  { text: '技术支持', value: 4 },
  { text: '售后服务', value: 5 }
]
export const SupplierContactTypeOptionsData = Options2Object(SupplierContactTypeOptions)


/**
 * 打样供货风险类型
 */
export const SampleRiskOptions = [
  { text: '停产', value: 1 },
  { text: '供货周期长', value: 2 },
  { text: '可代替性', value: 3 },
  { text: '市场少用', value: 4 },
  { text: '其他风险', value: 5 }
]
export const SampleRiskOptionsData = Options2Object(SampleRiskOptions)

/**
 * 物流公司
 */
export const ShipCompanyOptions = [
  { text: '顺丰快递', value: '顺丰快递' },
  { text: '中通快递', value: '中通快递' },
  { text: '圆通快递', value: '圆通快递' },
  { text: '韵达快递', value: '韵达快递' },
  { text: '优速快递', value: '优速快递' },
  { text: '德邦快递', value: '德邦快递' },
  { text: '跨越速运', value: '跨越速运' },
  { text: '速尔快递', value: '速尔快递' },
  { text: '优速快递', value: '优速快递' },
  { text: '宅急送', value: '宅急送' },
  { text: 'EMS', value: 'EMS' },
  { text: 'Fedex', value: 'Fedex' },
  { text: '其他物流', value: '其他物流' }
]