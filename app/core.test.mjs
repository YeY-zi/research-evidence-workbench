import test from 'node:test';
import assert from 'node:assert/strict';
import { findEvidence, createCard, createManualEvidence, cardToMarkdown } from './core.mjs';

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
  assert.deepEqual(findEvidence('BraSyn 2023 的官方排行榜第一名是谁？'), []);
  assert.deepEqual(findEvidence('ET 标签在 BraTS 2022 的取值是什么？'), []);
});

test('expanded source facts have distinct locators', () => {
  assert.equal(findEvidence('BraTS 2023 的 ET 标签数值更新成几？')[0].id, 'E-005');
  assert.equal(findEvidence('BraTS 2023 总共有多少项任务？')[0].id, 'E-006');
  assert.equal(findEvidence('Jaccard index 是 IoU 吗？')[0].id, 'E-007');
  assert.equal(findEvidence('F1 分数是精确率和召回率的哪一种平均？')[0].id, 'E-008');
});

test('saved card and export retain provenance and require human judgment', () => {
  const evidenceItem = findEvidence('Dice 系数主要衡量什么？')[0];
  assert.equal(evidenceItem.source.id, 'SRC-002');
  assert.throws(() => createCard({ question: 'Dice?', judgment: '', evidenceItem, confirmed: true }));
  assert.throws(() => createCard({ question: 'Dice?', judgment: '衡量重叠', evidenceItem, confirmed: false }));
  const card = createCard({ question: 'Dice 系数主要衡量什么？', judgment: '衡量分割区域重叠。', limitation: '还需核对原文。', evidenceItem, confirmed: true });
  const markdown = cardToMarkdown(card);
  assert.match(markdown, /SRC-002/);
  assert.match(markdown, /Performance metrics/);
  assert.match(markdown, /https:\/\/pmc\.ncbi\.nlm\.nih\.gov/);
  assert.match(markdown, /还需核对原文/);
});

test('manual source allows a new paper while rejecting unsafe or incomplete provenance', () => {
  assert.throws(() => createManualEvidence({ title: 'Paper', locator: 'Table 1', url: 'javascript:alert(1)' }));
  assert.throws(() => createManualEvidence({ title: 'Paper', locator: '', url: 'https://example.org/paper' }));
  assert.throws(() => createManualEvidence({ title: 'Paper', locator: 'Table 1', url: 'https://example.org/paper', doi: 'bad-doi' }));
  const item = createManualEvidence({ title: 'Public paper', locator: 'Table 1', url: 'https://example.org/paper', doi: '10.1234/example', license: '待核实', note: '用户自己的检索线索' });
  const card = createCard({ question: '新研究问题', judgment: '人工判断', evidenceItem: item, confirmed: true });
  assert.equal(card.sourceUrl, 'https://example.org/paper');
  assert.match(cardToMarkdown(card), /10\.1234\/example/);
  assert.match(cardToMarkdown(card), /Table 1/);
  assert.match(cardToMarkdown(card), /用户自己的检索线索/);
});
