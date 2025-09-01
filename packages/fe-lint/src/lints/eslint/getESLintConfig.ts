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
  
  // ESLint v9.34.0 中移除了 extensions 属性
  const lintConfig: ESLint.Options = {
    cwd,
    fix,
    ignorePatterns:Array.isArray(ignore) ? ignore : ignore ? [] : undefined,
    errorOnUnmatchedPattern: false,
  };

  if (config.eslintOptions) {
    // 若用户传入了 eslintOptions，则用用户的
    // 但需要确保不包含已移除的 extensions 属性
    const userOptions = { ...config.eslintOptions };
    if ('extensions' in userOptions) {
      delete userOptions.extensions;
    }
    Object.assign(lintConfig, userOptions);
  } else {
    // 根据扫描目录下有无lintrc文件，若无则使用默认的 lint 配置
    const lintConfigFiles = glob.sync('.eslintrc?(.@(js|yaml|yml|json))', { cwd });
    const hasEslintConfig = lintConfigFiles.length > 0 || pkg.eslintConfig;
    
    if (!hasEslintConfig) {
      const configType = getESLintConfigType(cwd, pkg);
      
      // 在 ESLint v9 中，extends 应该在 baseConfig 中
      lintConfig.overrideConfig = {
        // 使用类型断言来绕过类型检查
        extends: [configType],
      } as any; // 在这里使用 as any;
     
      // 如果启用 Prettier，添加 prettier
      if (config.enablePrettier) {
        if ((lintConfig.baseConfig as any).extends) {
          ((lintConfig.baseConfig as any).extends as string[]).push('prettier');
        } else {
          (lintConfig.baseConfig as any).extends = ['prettier'];
        }
      }
    }

    // 根据扫描目录下有无lintignore文件，若无则使用默认的 ignore 配置
    const lintIgnoreFile = path.resolve(cwd, '.eslintignore');
    if (!fs.existsSync(lintIgnoreFile) && !pkg.eslintIgnore) {
      (lintConfig as any).ignorePath = path.resolve(__dirname, '../config/_eslintignore.ejs');
    }
  }

  return lintConfig;
}

/**
 * 创建 ESLint 实例的辅助函数
 */
export async function createESLintInstance(opts: ScanOptions, pkg: PKG, config: Config): Promise<ESLint> {
  try {
    const eslintConfig = await getESLintConfig(opts, pkg, config);
    return new ESLint(eslintConfig);
  } catch (error) {
    console.warn('ESLint 配置创建失败，使用最小配置:', error);
      
    // 最终回退：最小配置
    const minimalConfig: ESLint.Options = {
      cwd: opts.cwd,
      fix: opts.fix,
      ignorePatterns: Array.isArray( opts.ignore) ?  opts.ignore :  opts.ignore ? [] : undefined,
      errorOnUnmatchedPattern: false,
    };
    
    return new ESLint(minimalConfig);
  }
}

/**
 * 处理文件扩展名的辅助函数
 * 替代已移除的 extensions 选项
 */
export function getFilesToLint(cwd: string, patterns: string[] = ['**/*.{js,jsx,ts,tsx,vue}']): string[] {
  const files: string[] = [];
  
  patterns.forEach(pattern => {
    const matchedFiles = glob.sync(pattern, { 
      cwd, 
      nodir: true,
      ignore: ['**/node_modules/**', '**/dist/**', '**/build/**']
    });
    
    files.push(...matchedFiles);
  });
  
  // 过滤出支持的 ESLint 文件扩展名
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ESLINT_FILE_EXT.includes(ext);
  });
}

/**
 * 执行 ESLint 检查的封装函数
 */
export async function runESLint(eslint: ESLint, files: string[]): Promise<ESLint.LintResult[]> {
  return await eslint.lintFiles(files);
}

/**
 * 获取支持的文件扩展名模式
 * 用于替代已移除的 extensions 选项
 */
export function getFilePatterns(): string[] {
  return ESLINT_FILE_EXT.map(ext => `**/*${ext}`);
}