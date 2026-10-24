import { evidence, sources } from './sample-data.mjs';

const sourceById = new Map(sources.map((source) => [source.id, source]));

export function findEvidence(question) {
  const q = String(question || '').trim().toLowerCase();
  if (!q) return [];
  // The fixture contains no model scores, clinical records or patient-level facts.
  if (/segmamba|wt\s*dice|患者|诊断|精确数值|准确率|百分比|%/.test(q)) return [];
  if (/(dice|dsc).*(多少|数值|得分|结果|值是多少)|(多少|数值|得分|结果).*(dice|dsc)/.test(q)) return [];
  if (/brats\s*2023/.test(q) && /(dice|dsc)/.test(q)) return [];

  const topics = new Set();
  if (/brasyn|缺失模态|缺失.*(mri|序列|模态)/.test(q)) topics.add('brasyn');
  if (/模态|序列|flair|t1c|t1|t2/.test(q)) topics.add('modalities');
  if (/年份|哪些年|覆盖.*年|2012|2024|发展/.test(q)) topics.add('years');
  if (/dice|dsc|相似系数|重叠/.test(q)) topics.add('dice');
  if (topics.has('brasyn')) topics.delete('modalities');
  return evidence.filter((item) => item.topics.some((topic) => topics.has(topic)))
    .map((item) => ({ ...item, source: sourceById.get(item.sourceId) }));
}

export function createCard({ question, judgment, limitation, evidenceItem }) {
  const cleanQuestion = String(question || '').trim();
  const cleanJudgment = String(judgment || '').trim();
  if (!cleanQuestion || !cleanJudgment || !evidenceItem?.source) {
    throw new Error('问题、人工判断和可定位来源均为必填项');
  }
  return {
    id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
    question: cleanQuestion,
    judgment: cleanJudgment,
    limitation: String(limitation || '').trim(),
    evidenceId: evidenceItem.id,
    sourceId: evidenceItem.source.id,
    sourceTitle: evidenceItem.source.title,
    sourceUrl: evidenceItem.source.url,
    locator: evidenceItem.locator,
    savedAt: new Date().toISOString()
  };
}

export function cardToMarkdown(card) {
  const safe = (value) => String(value || '').replace(/\r?\n/g, ' ').trim();
  return [
    `## 证据卡片 ${safe(card.id)}`,
    `- 研究问题：${safe(card.question)}`,
    `- 人工判断：${safe(card.judgment)}`,
    `- 来源：${safe(card.sourceTitle)}（${safe(card.sourceId)}）`,
    `- 原文位置：${safe(card.locator)}`,
    `- 来源链接：${safe(card.sourceUrl)}`,
    `- 局限与待核验：${safe(card.limitation) || '未填写'}`,
    `- 保存时间：${safe(card.savedAt)}`,
    ''
  ].join('\n');
}
