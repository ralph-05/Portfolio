# Résumé PDF — drop zone

Place your exported résumé PDF in this folder using the exact filename referenced in the site:

```
Ralph-Bayya-Resume.pdf
```

Referenced from:

- `index.html` → the **Download PDF** button (`assets/resume/Ralph-Bayya-Resume.pdf`)
- `resume.html` → the **Download PDF** toolbar button

## How to generate the PDF (no extra tools needed)

1. Open `resume.html` in your browser.
2. Click **Print** (or press `Ctrl/Cmd + P`).
3. Choose **Save as PDF** as the destination.
4. Set margins to *Default* or *Minimum*, enable **Background graphics**, and uncheck *Headers and footers*.
5. Save into this folder as `Ralph-Bayya-Resume.pdf`.

The print stylesheet in `assets/css/resume.css` handles the A4 layout, colours and page breaks automatically.

> If you export the PDF elsewhere, just update the `href` in both HTML files.