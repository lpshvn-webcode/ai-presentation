// Общая логика путей и имён для скриптов export-pdf.mjs / inline-deck.mjs.
//
// Каждая презентация живёт в папке <тип>/<проект>/<период>/:
//   reports/easyhealth/2026-09/   — ежемесячный отчёт
//   audits/superqr/2026-09-meta-ads/ — аудит
//   cases/<проект>/<период-тема>/ — кейс
// Готовые файлы для отправки получают имя <проект>-<тип>-<период>:
//   reports/easyhealth/2026-09/easyhealth-report-2026-09.pdf / .html

import fs from 'node:fs';
import path from 'node:path';

export const root = path.resolve(import.meta.dirname, '..');

const TYPES = { reports: 'report', audits: 'audit', cases: 'case' };

export function resolveDeck(arg) {
  if (!arg) {
    console.error('Укажите папку презентации, например: reports/easyhealth/2026-09');
    process.exit(1);
  }
  const deckDir = path.resolve(root, arg);
  const parts = path.relative(root, deckDir).split(path.sep);
  const type = TYPES[parts[0]];
  if (!type || parts.length !== 3) {
    console.error(`Ожидается путь вида <reports|audits|cases>/<проект>/<период>, получено: ${arg}`);
    process.exit(1);
  }
  const htmlPath = path.join(deckDir, 'index.html');
  if (!fs.existsSync(htmlPath)) {
    console.error(`Не найден файл: ${htmlPath}`);
    process.exit(1);
  }
  const [, project, period] = parts;
  const name = `${project}-${type}-${period}`;
  return {
    deckDir,
    htmlPath,
    name,
    pdfPath: path.join(deckDir, `${name}.pdf`),
    bundlePath: path.join(deckDir, `${name}.html`),
  };
}
