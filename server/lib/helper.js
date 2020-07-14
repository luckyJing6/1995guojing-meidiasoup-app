/**
 * socket 操作成功返回
 */
function SuccessEmit({ data = {}, msg = '' }) {
  return { code: 0, data, msg }
}

/**
 * socket 操作失败返回
 */
function FailEmit({ data = '', msg = '' }) {
  return { code: -1, data, msg }
}

module.exports = {
  SuccessEmit,
  FailEmit
}