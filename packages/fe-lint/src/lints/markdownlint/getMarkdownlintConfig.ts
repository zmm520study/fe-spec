import path from 'path';
import glob from 'glob';
import markdownLintConfig from 'web-markdownlint-config';
import type { ScanOptions, PKG, Config } from '../../types';

// markdownlint@0.38.0 的配置选项接口
interface MarkdownlintOptions {
  config?: any;
  files?: string[];
  strings?: Record<string, string>;
  resultVersion?: number;
  handleRuleFailures?: boolean;
  noInlineConfig?: boolean;
  customRules?: any[];
  frontMatter?: RegExp;
}

type LintOptions = MarkdownlintOptions & { fix?: boolean };

/**
 * 获取 Markdownlint 配置
 */
export function getMarkdownlintConfig(opts: ScanOptions, pkg: PKG, config: Config): LintOptions {
  const { cwd } = opts;
  
  const lintConfig: LintOptions = {
    fix: Boolean(opts.fix),
    resultVersion: 3,
  };

  if (config.markdownlintOptions) {
    // 若用户传入了 markdownlintOptions，则用用户的
    Object.assign(lintConfig, config.markdownlintOptions);
  } else {
    const lintConfigFiles = glob.sync('.markdownlint(.@(yaml|yml|json))', { cwd });
    if (lintConfigFiles.length === 0) {
      lintConfig.config = markdownLintConfig;
    } else {
      const configPath = path.resolve(cwd, lintConfigFiles[0]);
      lintConfig.config = require(configPath);
    }
  }

  return lintConfig;
}