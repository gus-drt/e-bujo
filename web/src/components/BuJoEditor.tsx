"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { BuJoBulletExtension, BuJoType } from "@/lib/tiptap/BuJoBulletExtension";

interface BuJoEditorProps {
  onSubmit: (input: {
    type: BuJoType;
    content: unknown;
    rawText: string;
  }) => void;
}

export function BuJoEditor({ onSubmit }: BuJoEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, BuJoBulletExtension],
    content: "",
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        const json = editor.getJSON();
        const text = editor.getText().trim();

        if (!text) {
          return;
        }

        const type =
          (editor.storage.bujoBullet?.lastType as BuJoType | undefined) ??
          "note";

        onSubmit({
          type,
          content: json,
          rawText: text,
        });

        editor.commands.clearContent(true);
      }
    };

    editor.view.dom.addEventListener("keydown", handleKeyDown);
    return () => {
      editor.view.dom.removeEventListener("keydown", handleKeyDown);
    };
  }, [editor, onSubmit]);

  if (!editor) {
    return (
      <div className="rounded-md border border-zinc-200 bg-white p-2 text-xs text-zinc-500">
        Inicializando editor...
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="rounded-md border border-zinc-200 bg-white p-2 text-sm">
        <EditorContent editor={editor} />
      </div>
      <p className="text-[11px] text-zinc-500">
        Dica: use símbolos BuJo no início da linha e pressione{" "}
        <kbd className="rounded bg-zinc-200 px-1">Ctrl</kbd>+
        <kbd className="rounded bg-zinc-200 px-1">Enter</kbd> para salvar a
        entry.
      </p>
    </div>
  );
}

