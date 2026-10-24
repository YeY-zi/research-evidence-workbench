import test from 'node:test';
import assert from 'node:assert/strict';
import { findEvidence, createCard, cardToMarkdown } from './core.mjs';

test('known question returns a locatable source', () => {
  const matches = findEvidence('BraTS 2023 挑战列出哪些 MRI 模态？');
  assert.equal(matches.length, 1);
  assert.equal(matches[0].source.id, 'SRC-001');
  assert.match(matches[0].locator, /4\.10/);
  assert.match(matches[0].source.url, /^https:\/\//);
});

test('out-of-scope model score and patient question return no evidence', () => {
  assert.deepEqual(findEvidence('SegMamba 的 WT Dice 精确数值是多少？'), []);
  assert.deepEqual(findEvidence('BraTS 2023 的 Dice 值是多少？'), []);
  assert.deepEqual(findEvidence('某患者的肿瘤属于什么诊断？'), []);
});

test('saved card and export retain provenance and require human judgment', () => {
  const evidenceItem = findEvidence('Dice 系数主要衡量什么？')[0];
  assert.equal(evidenceItem.source.id, 'SRC-002');
  assert.throws(() => createCard({ question: 'Dice?', judgment: '', evidenceItem }));
  const card = createCard({ question: 'Dice 系数主要衡量什么？', judgment: '衡量分割区域重叠。', limitation: '还需核对原文。', evidenceItem });
  const markdown = cardToMarkdown(card);
  assert.match(markdown, /SRC-002/);
  assert.match(markdown, /Performance metrics/);
  assert.match(markdown, /https:\/\/pmc\.ncbi\.nlm\.nih\.gov/);
  assert.match(markdown, /还需核对原文/);
});
