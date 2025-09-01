import { ESLint } from 'eslint';
import fs from 'fs-extra';
import glob from 'glob';
import path from 'path';
import type { Config, PKG, ScanOptions } from '../../types';
import { ESLINT_FILE_EXT } from '../../utils/constants';
import { getESLintConfigType } from './getESLintConfigType';

/**
 * 获取 ESLint 配置
 */
export async function getESLintConfig(opts: ScanOptions, pkg: PKG, config: Config): Promise<ESLint.Options> {
  const { cwd, fix, ignore } = opts;
  const lintConfig: ESLint.Options = {
    cwd,
    fix,
    ignorePatterns: ignore, // 注意：ESLint v8+ 使用 ignorePatterns 而不是 ignore
    extensions: ESLINT_FILE_EXT,
    errorOnUnmatchedPattern: false,
  };

  if (config.eslintOptions) {
    // 若用户传入了 eslintOptions，则用用户的
    Object.assign(lintConfig, config.eslintOptions);
  } else {
    // 根据扫描目录下有无lintrc文件，若无则使用默认的 lint 配置
    const lintConfigFiles = glob.sync('.eslintrc?(.@(js|yaml|yml|json))', { cwd });
    const hasEslintConfig = lintConfigFiles.length > 0 || pkg.eslintConfig;
    
    if (!hasEslintConfig) {
      // ESLint v8+ 中 resolvePluginsRelativeTo 和 useEslintrc 仍然可用
      lintConfig.resolvePluginsRelativeTo = path.resolve(__dirname, '../../');
      lintConfig.useEslintrc = false;
      
      // 获取配置类型
      const configType = getESLintConfigType(cwd, pkg);
      const extendsConfig = [configType];
      
      // 如果启用 Prettier，添加 prettier
      if (config.enablePrettier) {
        extendsConfig.push('prettier');
      }
      
      lintConfig.baseConfig = {
        extends: extendsConfig,
      };
    }

    // 根据扫描目录下有无lintignore文件，若无则使用默认的 ignore 配置
    const lintIgnoreFile = path.resolve(cwd, '.eslintignore');
    if (!fs.existsSync(lintIgnoreFile) && !pkg.eslintIgnore) {
      // ESLint v8+ 中 ignorePath 仍然可用
      lintConfig.ignorePath = path.resolve(__dirname, '../config/_eslintignore.ejs');
    }
  }

  return lintConfig;
}

/**
 * 创建 ESLint 实例的辅助函数
 */
export async function createESLintInstance(opts: ScanOptions, pkg: PKG, config: Config): Promise<ESLint> {
  const eslintConfig = await getESLintConfig(opts, pkg, config);
  return new ESLint(eslintConfig);
}