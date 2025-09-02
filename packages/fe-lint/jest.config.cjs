module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    
    // 告诉 Jest 处理 node_modules 中的 ES modules
    transformIgnorePatterns: [
      'node_modules/(?!(execa)/)',
    ],
    
    // 使用 babel-jest 转换 JS 文件
    transform: {
      '^.+\\.(js|jsx)$': 'babel-jest',
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    
    // 配置模块名称映射
    moduleNameMapping: {
      '^execa$': require.resolve('execa'),
    },
  };