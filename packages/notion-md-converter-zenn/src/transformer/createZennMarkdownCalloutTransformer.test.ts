import {
  createCalloutBlock,
  createTextRichText,
  createTransformerContext,
} from "@notion-md-converter/core/test-helper";
import { createZennMarkdownCalloutTransformer } from "./createZennMarkdownCalloutTransformer";

describe("createZennMarkdownCalloutTransformer", () => {
  const transformer = createZennMarkdownCalloutTransformer();

  it("コールアウトブロックをZennのマークダウン形式に変換する", () => {
    const block = createCalloutBlock({
      richText: [
        createTextRichText({
          plainText: "テストメッセージ",
        }),
      ],
      icon: { type: "emoji", emoji: "💡" },
    });
    const context = createTransformerContext({
      blocks: [block],
    });

    const result = transformer(context);

    expect(result).toBe("\n:::message\nテストメッセージ\n:::\n");
  });

  it("アラート絵文字が設定されている場合はアラートメッセージとして変換する", () => {
    const block = createCalloutBlock({
      richText: [
        createTextRichText({
          plainText: "アラートメッセージ",
        }),
      ],
      icon: { type: "emoji", emoji: "🚨" },
    });
    const context = createTransformerContext({
      blocks: [block],
    });

    const result = transformer(context);

    expect(result).toBe("\n:::message alert\nアラートメッセージ\n:::\n");
  });

  it("子要素がある場合は子要素も変換する", () => {
    const block = createCalloutBlock({
      richText: [
        createTextRichText({
          plainText: "親メッセージ",
        }),
      ],
      icon: { type: "emoji", emoji: "💡" },
      children: [
        createCalloutBlock({
          richText: [
            createTextRichText({
              plainText: "子メッセージ",
            }),
          ],
        }),
      ],
    });
    const context = createTransformerContext({
      blocks: [block],
    });

    context.mockedExecute.mockReturnValue("子メッセージ");
    const result = transformer(context);

    expect(result).toBe("\n:::message\n親メッセージ\n子メッセージ\n:::\n");
    expect(context.mockedExecute).toHaveBeenCalledWith(block.children);
  });

  it("子要素に:::が含まれる場合、wrapオプションを有効にして変換する", () => {
    const block = createCalloutBlock({
      richText: [
        createTextRichText({
          plainText: "親メッセージ",
        }),
      ],
      icon: { type: "emoji", emoji: "💡" },
      children: [
        createCalloutBlock({
          richText: [
            createTextRichText({
              plainText: ":::message\n子メッセージ\n:::",
            }),
          ],
        }),
      ],
    });
    const context = createTransformerContext({
      blocks: [block],
    });

    context.mockedExecute.mockReturnValue(":::message\n子メッセージ\n:::");
    const result = transformer(context);

    expect(result).toBe("\n::::message\n親メッセージ\n:::message\n子メッセージ\n:::\n::::\n");
    expect(context.mockedExecute).toHaveBeenCalledWith(block.children);
  });

  it("カスタムのアラート絵文字を設定できる", () => {
    const transformer = createZennMarkdownCalloutTransformer({
      alertEmojis: ["🚨", "🔔"],
    });
    const block = createCalloutBlock({
      richText: [
        createTextRichText({
          plainText: "アラートメッセージ",
        }),
      ],
      icon: { type: "emoji", emoji: "🔔" },
    });
    const context = createTransformerContext({
      blocks: [block],
    });

    const result = transformer(context);

    expect(result).toBe("\n:::message alert\nアラートメッセージ\n:::\n");
  });
});
