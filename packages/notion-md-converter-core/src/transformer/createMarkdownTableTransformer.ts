import { MarkdownUtils } from "../utils";
import type { TableCell, TableHeader } from "../utils";
import { createBasicTableTransformer } from "./createBasicTransformer";

export const createMarkdownTableTransformer = () => {
  return createBasicTableTransformer(({ header, rows }) => {
    const headerCells: TableHeader[] = header.table_row.cells.map((cell) => ({
      content: MarkdownUtils.convertRichTextsToMarkdown(cell),
    }));
    const rowsCells: TableCell[][] = rows.map((row) =>
      row.table_row.cells.map((cell) => ({
        content: MarkdownUtils.convertRichTextsToMarkdown(cell),
      })),
    );
    // 改行の数を出力
    return MarkdownUtils.wrapWithNewLines(MarkdownUtils.convertToTable(headerCells, rowsCells));
  });
};
