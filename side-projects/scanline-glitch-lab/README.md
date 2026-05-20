# Strip Interleave Lab

Standalone playground for your exact workflow:

- Input: 2 images, each ideally 2560x1280.
- Process: take horizontal strips and alternate A then B.
- Output: one merged image at 2560x2560.

## Run

1. Open a terminal in this folder.
2. Run:

```bash
npm run dev
```

3. Open `http://localhost:4173`.

## Use

- Upload Image A and Image B.
- Set Strip Height in pixels.
- Click Merge Now to refresh the preview.
- Click Download PNG to export the final 2560x2560 image.

## Notes

- Sources are normalized with a cover fit into 2560x1280 before merging.
- The preview is scaled for the browser, but export is always full size.
