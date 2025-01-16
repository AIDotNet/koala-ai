import { ARTIFACT_TAG_REGEX, ARTIFACT_THINKING_TAG_REGEX } from '@/const/plugin';

/**
 * Replace all line breaks in the matched `lobeArtifact` tag with an empty string
 */
export const processWithArtifact = (input: string = '') => {
  let output = input;
  const thinkMatch = ARTIFACT_THINKING_TAG_REGEX.exec(input);

  // If the input contains the `lobeThinking` tag, replace all line breaks with an empty string
  if (thinkMatch)
    output = input.replace(ARTIFACT_THINKING_TAG_REGEX, (match) =>
      match.replace(/\r?\n|\r/g, ''),
    );

  const match = ARTIFACT_TAG_REGEX.exec(input);
  // 如果输入包含 `lobeArtifact` 标签，使用正则替换所有换行符为空字符串
  if (match)
    return output.replace(ARTIFACT_TAG_REGEX, (match) =>
      match.replace(/\r?\n|\r/g, ''),
    );

  // 如果不匹配，则检查它是否以 <lobeArtifact 开头但未闭合
  const regex = /<lobeArtifact\b(?:(?!\/?>)[\S\s])*$/;
  if (regex.test(output)) {
    return output.replace(regex, '<lobeArtifact>');
  }

  return output;
};
