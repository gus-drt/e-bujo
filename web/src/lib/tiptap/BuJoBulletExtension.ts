import { Extension } from "@tiptap/core";
import { textInputRule } from "@tiptap/react";

export type BuJoType = "task" | "event" | "note" | "idea";

export interface BuJoMeta {
  type: BuJoType;
}

const symbolToType: Record<string, BuJoType> = {
  "-": "task",
  o: "event",
  ".": "note",
  ">": "idea",
};

export const BuJoBulletExtension = Extension.create({
  name: "bujoBullet",

  addStorage() {
    return {
      lastType: "note" as BuJoType,
    };
  },

  addInputRules() {
    return [
      textInputRule({
        find: /^([-o.>])\s$/,
        handler: ({ state, range, match, chain }) => {
          const symbol = match[1];
          const type = symbolToType[symbol] ?? "note";

          this.storage.lastType = type;

          // Remove o símbolo digitado
          const from = range.from;
          const to = range.to;

          chain()
            .deleteRange({ from, to })
            .setNode("paragraph")
            .setMeta("bujoBullet", { type })
            .run();
        },
      }),
    ];
  },
});

