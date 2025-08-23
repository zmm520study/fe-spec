module.exports = {
  // 指定提交信息解析器，使用符合Conventional Commits规范的解析规则
  parserPreset: "conventional-changelog-conventionalcommits",
  
  // 提交信息校验规则配置
  rules: {
    // 提交正文前必须有一个空行（1:警告级别，always:必须满足）
    "body-leading-blank": [1, "always"],
    
    // 提交正文每行最大长度100字符（2:错误级别，超出将拒绝提交）
    "body-max-line-length": [2, "always", 100],
    
    // 提交脚注前必须有一个空行（1:警告级别）
    "footer-leading-blank": [1, "always"],
    
    // 提交脚注每行最大长度100字符（2:错误级别）
    "footer-max-line-length": [2, "always", 100],
    
    // 提交标题行（首行）最大长度100字符（2:错误级别）
    "header-max-length": [2, "always", 100],
    
    // 提交范围(scope)必须使用小写字母（2:错误级别）
    "scope-case": [2, "always", "lower-case"],
    
    // 禁用主题(subject)大小写校验（0:禁用规则）
    "subject-case": [0],
    
    // 提交主题(subject)不能为空（2:错误级别，必须提供简短描述）
    "subject-empty": [2, "never"],
    
    // 提交主题末尾禁止使用句号（2:错误级别）
    "subject-full-stop": [2, "never", "."],
    
    // 提交类型(type)必须使用小写字母（2:错误级别）
    "type-case": [2, "always", "lower-case"],
    
    // 提交类型(type)不能为空（2:错误级别，必须指定提交类型）
    "type-empty": [2, "never"],
    
    // 提交类型必须是指定列表中的值（2:错误级别）
    "type-enum": [
      2,
      "always",
      [
        "feat",    // 新功能
        "fix",     // 错误修复
        "docs",    // 文档变更
        "style",   // 代码格式调整（不影响代码逻辑）
        "test",    // 测试相关代码
        "refactor",// 代码重构（既不是新功能也不是修复bug）
        "chore",   // 构建过程或辅助工具变动
        "revert"   // 回滚先前的提交
      ],
    ],
  },
};
