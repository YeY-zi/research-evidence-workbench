import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { findEvidence } from '../app/core.mjs';

const [label, output] = process.argv.slice(2);
if (!label || !output) {
  console.error('Usage: node evals/run.mjs <label> <output.json>');
  process.exit(2);
}

const csv = readFileSync(new URL('./questions.csv', import.meta.url), 'utf8').trimEnd().split(/\r?\n/);
const headers = csv.shift().split(',');
const questions = csv.map((line) => Object.fromEntries(line.split(',').map((value, index) => [headers[index], value])));
if (questions.length !== 30 || questions.some((item) => !item.id || !item.question || !item.expected_behavior)) {
  throw new Error('Question set must contain 30 complete rows');
}

const rows = questions.map((item) => {
  const matches = findEvidence(item.question);
  const actualIds = matches.map((match) => match.id);
  const pass = item.expected_behavior === 'no_source'
    ? actualIds.length === 0
    : actualIds.length === 1 && actualIds[0] === item.expected_evidence_id;
  return {
    id: item.id,
    question: item.question,
    expectedEvidenceId: item.expected_evidence_id || null,
    expectedBehavior: item.expected_behavior,
    actualEvidenceIds: actualIds,
    pass
  };
});
const positives = rows.filter((item) => item.expectedBehavior === 'show_source');
const negatives = rows.filter((item) => item.expectedBehavior === 'no_source');
const countPass = (items) => items.filter((item) => item.pass).length;
const result = {
  label,
  generatedAt: new Date().toISOString(),
  commit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  questionSet: 'evals/questions.csv (30 fixed questions; single-editor desk labels)',
  scope: 'deterministic local evidence lookup; no LLM or user tasks',
  totals: {
    questions: rows.length,
    passed: countPass(rows),
    answerable: positives.length,
    answerablePassed: countPass(positives),
    noSource: negatives.length,
    noSourcePassed: countPass(negatives)
  },
  rows
};
writeFileSync(output, JSON.stringify(result, null, 2) + '\n', 'utf8');
console.log(`${label}: ${result.totals.passed}/${rows.length}; answerable ${result.totals.answerablePassed}/${positives.length}; no-source ${result.totals.noSourcePassed}/${negatives.length}`);
