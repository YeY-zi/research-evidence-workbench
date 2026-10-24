import { findEvidence, createManualEvidence, createCard, cardToMarkdown, validatedSourceUrl } from './core.mjs?v=3';

const key = 'research-evidence-workbench-cards-v1';
const $ = (id) => document.getElementById(id);
const state = { question: '', matches: [], selected: null, cards: loadCards() };

function loadCards() {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '[]');
    return Array.isArray(value) ? value : [];
  } catch { return []; }
}

function saveCards() {
  try { localStorage.setItem(key, JSON.stringify(state.cards)); return true; }
  catch { $('save-message').textContent = '浏览器存储不可用，卡片未保存。'; return false; }
}

function element(tag, className, content) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (content !== undefined) node.textContent = content;
  return node;
}

function renderResults() {
  const container = $('results');
  container.replaceChildren();
  $('results-panel').hidden = false;
  $('editor-panel').hidden = true;
  state.selected = null;
  $('results-count').textContent = state.matches.length ? `${state.matches.length} 条人工整理线索` : '0 条匹配线索';
  if (!state.matches.length) {
    const empty = element('div', 'empty');
    empty.append(element('strong', '', '当前示例资料未找到可定位证据。'), element('p', '', '请改写问题或查阅原文；若已核对公开来源，可在下方手动登记。系统不会补写未收录的数字或诊断。'));
    container.append(empty);
    return;
  }
  const notice = element('p', 'notice', '以下是人工整理的检索线索，不是自动答案。请打开原文核对后再写卡片。');
  container.append(notice);
  state.matches.forEach((match) => {
    const article = element('article', 'result-card');
    const meta = element('p', 'result-meta', `${match.source.id} · ${match.source.year} · ${match.locator}`);
    const title = element('h3', '', match.source.title);
    const summary = element('p', 'summary', match.summary);
    const details = element('p', 'source-details', `DOI ${match.source.doi} · ${match.source.license} · 原文位置：${match.locator}`);
    const actions = element('div', 'result-actions');
    const link = element('a', '', '打开原文 ↗');
    link.href = match.source.url; link.target = '_blank'; link.rel = 'noopener noreferrer';
    const select = element('button', 'outline', '用此来源建卡 →');
    select.type = 'button'; select.addEventListener('click', () => selectMatch(match));
    actions.append(link, select);
    article.append(meta, title, summary, details, actions); container.append(article);
  });
}

function selectMatch(match) {
  state.selected = match;
  const box = $('selected-source');
  box.replaceChildren();
  box.append(element('span', 'source-label', match.source.id.startsWith('USER-') ? '用户手动登记 · 未经系统核验' : '已选内置来源'), element('strong', '', match.source.title), element('span', '', `${match.source.id} · ${match.locator}`));
  const sourceLink = element('a', '', '打开原文核对 ↗');
  sourceLink.href = validatedSourceUrl(match.source.url); sourceLink.target = '_blank'; sourceLink.rel = 'noopener noreferrer';
  box.append(sourceLink);
  $('judgment').value = '';
  $('limitation').value = '';
  $('confirmed').checked = false;
  $('save-message').textContent = '';
  $('editor-panel').hidden = false;
  $('editor-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  $('judgment').focus({ preventScroll: true });
}

function renderCards() {
  const container = $('cards');
  container.replaceChildren();
  $('export-button').disabled = state.cards.length === 0;
  if (!state.cards.length) { container.append(element('p', 'empty-cards', '还没有卡片。完成来源核对后，在上方保存第一张。')); return; }
  state.cards.forEach((card) => {
    const item = element('article', 'saved-card');
    item.append(element('p', 'result-meta', `${card.sourceId} · ${card.locator}`), element('h3', '', card.question), element('p', 'summary', card.judgment), element('p', 'limitation', `来源：${card.sourceTitle}`));
    if (card.sourceNote) item.append(element('p', 'limitation', `用户来源备注：${card.sourceNote}`));
    if (card.limitation) item.append(element('p', 'limitation', `局限：${card.limitation}`));
    const row = element('div', 'result-actions');
    let link;
    try {
      link = element('a', '', '核对原文 ↗'); link.href = validatedSourceUrl(card.sourceUrl); link.target = '_blank'; link.rel = 'noopener noreferrer';
    } catch { link = element('span', 'notice', '来源链接无效，请检查导出记录'); }
    const remove = element('button', 'text-button', '删除卡片'); remove.type = 'button';
    remove.addEventListener('click', () => { state.cards = state.cards.filter((entry) => entry.id !== card.id); if (saveCards()) renderCards(); });
    row.append(link, remove); item.append(row); container.append(item);
  });
}

$('query-form').addEventListener('submit', (event) => {
  event.preventDefault();
  state.question = $('question').value.trim();
  if (!state.question) { $('question').focus(); return; }
  state.matches = findEvidence(state.question);
  $('manual-form').reset();
  $('manual-panel').hidden = true;
  $('manual-toggle').setAttribute('aria-expanded', 'false');
  $('manual-message').textContent = '';
  renderResults();
  $('results-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelectorAll('[data-example]').forEach((button) => button.addEventListener('click', () => {
  $('question').value = button.dataset.example;
  $('query-form').requestSubmit();
}));

$('manual-toggle').addEventListener('click', () => {
  const panel = $('manual-panel');
  panel.hidden = !panel.hidden;
  $('manual-toggle').setAttribute('aria-expanded', String(!panel.hidden));
  if (!panel.hidden) $('manual-title').focus();
});

$('manual-form').addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    const match = createManualEvidence({
      title: $('manual-title').value,
      url: $('manual-url').value,
      doi: $('manual-doi').value,
      locator: $('manual-locator').value,
      license: $('manual-license').value,
      note: $('manual-note').value
    });
    $('manual-message').textContent = '';
    selectMatch(match);
  } catch (error) { $('manual-message').textContent = error.message; }
});

$('card-form').addEventListener('submit', (event) => {
  event.preventDefault();
  try {
    const card = createCard({ question: state.question, judgment: $('judgment').value, limitation: $('limitation').value, evidenceItem: state.selected, confirmed: $('confirmed').checked });
    state.cards.unshift(card);
    if (!saveCards()) { state.cards.shift(); return; }
    $('save-message').textContent = '已保存到当前浏览器。';
    renderCards();
    state.selected = null;
    $('editor-panel').hidden = true;
    document.querySelector('.library').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } catch (error) { $('save-message').textContent = error.message; }
});

$('export-button').addEventListener('click', () => {
  const content = `# 研究证据卡片\n\n${state.cards.map(cardToMarkdown).join('\n')}`;
  const url = URL.createObjectURL(new Blob([content], { type: 'text/markdown;charset=utf-8' }));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'evidence-cards.md'; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

renderCards();
