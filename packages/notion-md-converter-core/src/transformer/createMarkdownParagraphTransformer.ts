import { MarkdownUtils } from "../utils";
import { createBasicParagraphTransformer } from "./createBasicTransformer";

export const createMarkdownParagraphTransformer = () => {
  return createBasicParagraphTransformer(({ block, children }) => {
    const text = MarkdownUtils.richTextsToMarkdown(block.paragraph.rich_text);
    if (children !== "") {
      return `${text}\n${children}`;
    }
    return text;
  });
};
