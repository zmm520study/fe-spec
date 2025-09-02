import fg from 'fast-glob';
import { readFile, writeFile } from 'fs-extra';
// 使用默认导入方式
import * as markdownlintModule from 'markdownlint';
import markdownlintRuleHelpers from 'markdownlint-rule-helpers';
import { extname, join } from 'path';
import { Config, PKG, ScanOptions } from '../../types';
import { MARKDOWN_LINT_FILE_EXT, MARKDOWN_LINT_IGNORE_PATTERN } from '../../utils/constants';
import { formatMarkdownlintResults } from './formatMarkdownlintResults';
import { getMarkdownlintConfig } from './getMarkdownlintConfig';

export interface DoMarkdownlintOptions extends ScanOptions {
  pkg: PKG;
  config?: Config;
}

export async function doMarkdownlint(options: DoMarkdownlintOptions) {
  let files: string[];
  if (options.files) {
    files = options.files.filter((name) => MARKDOWN_LINT_FILE_EXT.includes(extname(name)));
  } else {
    const pattern = join(
      options.include,
      `**/*.{${MARKDOWN_LINT_FILE_EXT.map((t) => t.replace(/^\./, '')).join(',')}}`,
    );
    files = await fg(pattern, {
      cwd: options.cwd,
      ignore: MARKDOWN_LINT_IGNORE_PATTERN,
    });
  }
  // 如果上面的方式不行，尝试这样
const markdownlint = (markdownlintModule as any).default;
  // 使用正确的异步调用方式
  const results = await markdownlint.markdownlint({
    ...getMarkdownlintConfig(options, options.pkg, options.config),
    files,
  });
  
  if (options.fix) {
    await Promise.all(
      Object.keys(results).map((filename) => formatMarkdownFile(filename, results[filename])),
    );
    for (const file in results) {
      if (!Object.prototype.hasOwnProperty.call(results, file)) continue;
    }
  }
  return formatMarkdownlintResults(results, options.quiet);
}

async function formatMarkdownFile(filename: string, errors: any[]) {
  const fixes = errors?.filter((error: any) => error.fixInfo);

  if (fixes?.length > 0) {
    const originalText = await readFile(filename, 'utf8');
    const fixedText = markdownlintRuleHelpers.applyFixes(originalText, fixes);
    if (originalText !== fixedText) {
      await writeFile(filename, fixedText, 'utf8');
      return errors.filter((error: any) => !error.fixInfo);
    }
  }
  return errors;
}