import { createServerFn } from "@tanstack/react-start";
import { extractText, getDocumentProxy } from "unpdf";

const MAX_TEXT_LENGTH = 20000;

export const extractResumeText = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    if (!(data instanceof FormData)) {
      throw new Error("Expected form data");
    }
    return data;
  })
  .handler(async ({ data }): Promise<{ text: string; supported: boolean }> => {
    const file = data.get("resume");
    if (!(file instanceof File) || file.size === 0) {
      return { text: "", supported: false };
    }

    const name = file.name.toLowerCase();

    if (name.endsWith(".txt")) {
      const text = await file.text();
      return { text: text.slice(0, MAX_TEXT_LENGTH), supported: true };
    }

    if (name.endsWith(".pdf")) {
      try {
        const buffer = new Uint8Array(await file.arrayBuffer());
        const pdf = await getDocumentProxy(buffer);
        const { text } = await extractText(pdf, { mergePages: true });
        return { text: text.slice(0, MAX_TEXT_LENGTH), supported: true };
      } catch {
        return { text: "", supported: false };
      }
    }

    // .doc / .docx text extraction isn't wired up yet.
    return { text: "", supported: false };
  });
