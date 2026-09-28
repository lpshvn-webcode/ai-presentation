#!/usr/bin/env node
// Экспорт <тип>/<проект>/<период>/index.html -> <проект>-<тип>-<период>.pdf
// в той же папке, через headless Chromium.
// Использование: node scripts/export-pdf.mjs reports/easyhealth/2026-09

import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';
import { resolveDeck } from './deck-path.mjs';

const { htmlPath, pdfPath } = resolveDeck(process.argv[2]);

fs.mkdirSync(path.dirname(pdfPath), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready); // дождаться реальной загрузки Inter, иначе печатает системным шрифтом
await page.emulateMedia({ media: 'print' });
await page.pdf({
  path: pdfPath,
  printBackground: true,
  preferCSSPageSize: true,
});
await browser.close();

console.log(`Сохранено: ${pdfPath}`);
