// Multi-page PDF export for the full career report. Each passed-in node
// (a single on-screen section) is rendered to its own canvas via
// html-to-image and packed onto A4-ish pages — several short sections per
// page, a section taller than one page split across as many as it needs.
// Capturing per-section (rather than one giant canvas of the whole report)
// keeps every individual capture well inside browser canvas size limits.

const PAGE_WIDTH = 816; // px, Letter width at 96dpi
const PAGE_HEIGHT = 1056; // px, Letter height at 96dpi
const MARGIN = 28;
const GAP = 16;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const CONTENT_HEIGHT = PAGE_HEIGHT - MARGIN * 2;

// JPEG at this quality keeps a ~20-page report in the low tens of MB instead
// of the 100MB+ a lossless PNG produces for this much rendered text/UI —
// backgrounds are flattened to white first so JPEG's lack of alpha is moot.
const JPEG_QUALITY = 0.82;

function toJpegDataUrl(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
}

export async function exportSectionsToPdf(
  nodes: HTMLElement[],
  filename: string,
  onProgress?: (done: number, total: number) => void,
): Promise<void> {
  const [{ toCanvas }, { jsPDF }] = await Promise.all([import("html-to-image"), import("jspdf")]);

  const pdf = new jsPDF({ unit: "px", format: [PAGE_WIDTH, PAGE_HEIGHT], compress: true });
  let cursorY = MARGIN;
  let onFreshPage = true;

  const addPageBreak = () => {
    pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT], "portrait");
    cursorY = MARGIN;
    onFreshPage = true;
  };

  for (let i = 0; i < nodes.length; i++) {
    onProgress?.(i, nodes.length);
    const canvas = await toCanvas(nodes[i]!, { pixelRatio: 1.5, backgroundColor: "#ffffff" });
    const scale = CONTENT_WIDTH / canvas.width;
    const drawHeight = canvas.height * scale;

    if (drawHeight <= CONTENT_HEIGHT) {
      if (!onFreshPage && cursorY + drawHeight > PAGE_HEIGHT - MARGIN) addPageBreak();
      pdf.addImage(toJpegDataUrl(canvas), "JPEG", MARGIN, cursorY, CONTENT_WIDTH, drawHeight);
      cursorY += drawHeight + GAP;
      onFreshPage = false;
      continue;
    }

    // Section taller than one page: start it fresh, then slice across pages.
    if (!onFreshPage) addPageBreak();
    const pageHeightInCanvasPx = CONTENT_HEIGHT / scale;
    let sliceStart = 0;
    while (sliceStart < canvas.height) {
      const sliceHeight = Math.min(pageHeightInCanvasPx, canvas.height - sliceStart);
      const slice = document.createElement("canvas");
      slice.width = canvas.width;
      slice.height = sliceHeight;
      slice
        .getContext("2d")!
        .drawImage(
          canvas,
          0,
          sliceStart,
          canvas.width,
          sliceHeight,
          0,
          0,
          canvas.width,
          sliceHeight,
        );
      pdf.addImage(
        toJpegDataUrl(slice),
        "JPEG",
        MARGIN,
        MARGIN,
        CONTENT_WIDTH,
        sliceHeight * scale,
      );
      sliceStart += sliceHeight;
      if (sliceStart < canvas.height) addPageBreak();
    }
    // Force the next section onto a new page rather than packing after a split.
    cursorY = PAGE_HEIGHT + 1;
    onFreshPage = false;
  }

  onProgress?.(nodes.length, nodes.length);
  pdf.save(filename);
}
