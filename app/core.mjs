import { evidence, sources } from './sample-data.mjs';

const sourceById = new Map(sources.map((source) => [source.id, source]));

export function findEvidence(question) {
  const q = String(question || '').trim().toLowerCase();
  if (!q) return [];
  // Conservative scope gates: a shared keyword does not justify an unrelated answer.
  if (/患者|诊断|治疗建议|segmamba|价格|付费|排行榜|排名|第一名|最终结果|测试集.*多少|许可|版权|发表时间|采集时间|作者是谁|为什么|原因/.test(q)) return [];
  if (/(dice|dsc).*(得分|精确数值|具体数值|平均|fp|fn)|(得分|精确数值|具体数值|平均).*(dice|dsc)/.test(q)) return [];
  if (/brats\s*2024/.test(q) && /多少|患者|病例/.test(q)) return [];

  const rules = [
    ['E-003', (text) => /brasyn|缺失.*(mri|序列|模态)/.test(text) && /数据|任务|缺失|随机|模态|基于/.test(text)],
    ['E-005', (text) => /2023/.test(text) && /(et|增强肿瘤).*(标签|编码|数值|改|更新)|(标签|编码).*(et|增强肿瘤)/.test(text)],
    ['E-006', /(任务|挑战).*(几项|多少项|多少种|数量|共列出)|(几项|多少项|多少种|数量).*(任务|挑战)/],
    ['E-008', /f1.*(precision|recall|精确率|召回率|平均|关系)|(precision|recall|精确率|召回率).*f1/],
    ['E-007', (text) => /(iou|jaccard).*(什么|衡量|比较|指标|真值|预测)|(什么|指标).*(iou|jaccard)/.test(text) || (/iou/.test(text) && /jaccard/.test(text))],
    ['E-004', /(dice|dsc|相似系数).*(衡量|比较|指标|关系|什么|哪两个|区域)|(衡量|比较|指标).*(dice|dsc|相似系数)/],
    ['E-002', (text) => /brats|2023/.test(text) && /模态|序列/.test(text) && /哪些|包含|是否|列出|四种|有/.test(text)],
    ['E-001', (text) => /brats|bonato|综述|论文/.test(text) && /年份|哪些年|哪一年|回顾|2012|2024|2025.*挑战/.test(text)]
  ];
  const match = rules.find(([, pattern]) => typeof pattern === 'function' ? pattern(q) : pattern.test(q));
  if (!match) return [];
  const item = evidence.find((entry) => entry.id === match[0]);
  return item ? [{ ...item, source: sourceById.get(item.sourceId) }] : [];
}

export function createCard({ question, judgment, limitation, evidenceItem, confirmed }) {
  const cleanQuestion = String(question || '').trim();
  const cleanJudgment = String(judgment || '').trim();
  if (!cleanQuestion || !cleanJudgment || !evidenceItem?.source || confirmed !== true) {
    throw new Error('请填写问题与判断、选择来源，并确认已核对原文');
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
    sourceDoi: evidenceItem.source.doi,
    sourceLicense: evidenceItem.source.license,
    locator: evidenceItem.locator,
    checkedByCreator: true,
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
    `- DOI：${safe(card.sourceDoi) || '未记录'}`,
    `- 来源许可：${safe(card.sourceLicense) || '未记录'}`,
    `- 核对声明：${card.checkedByCreator ? '创建者勾选已核对原文（未独立验证）' : '未记录'}`,
    `- 局限与待核验：${safe(card.limitation) || '未填写'}`,
    `- 保存时间：${safe(card.savedAt)}`,
    ''
  ].join('\n');
}
