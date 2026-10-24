export const sources = [
  {
    id: 'SRC-001',
    title: 'Advancing Precision: A Comprehensive Review of MRI Segmentation Datasets from BraTS Challenges (2012–2025)',
    authors: 'Bonato, Nanni & Bertoldo',
    year: 2025,
    doi: '10.3390/s25061838',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC11945730/',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/'
  },
  {
    id: 'SRC-002',
    title: 'A Survey of Brain Tumor Segmentation and Classification Algorithms',
    authors: 'Biratu et al.',
    year: 2021,
    doi: '10.3390/jimaging7090179',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8465364/',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/'
  }
];

// Chinese summaries are manually prepared pointers, not source quotations or generated answers.
export const evidence = [
  {
    id: 'E-001', sourceId: 'SRC-001',
    locator: 'Abstract',
    summary: '这篇综述回顾 BraTS 2012–2024 年的数据集发展，并概述当时仍在规划中的 2025 年挑战。'
  },
  {
    id: 'E-002', sourceId: 'SRC-001',
    locator: 'Section 4.10, MRI modalities',
    summary: '综述列出 BraTS 2023 的四种 MRI 模态：T1、增强 T1（T1c）、T2 和 FLAIR。'
  },
  {
    id: 'E-003', sourceId: 'SRC-001',
    locator: 'Section 4.10, item 6: Synthesis (Global)—missing MRI',
    summary: '综述说明 BraSyn-2023 基于 BraTS 2021 数据集，并设置随机缺失一种 MRI 模态的任务。'
  },
  {
    id: 'E-004', sourceId: 'SRC-002',
    locator: 'Performance metrics, Dice similarity coefficient (equation 8)',
    summary: '该综述把 Dice 相似系数用于衡量真实肿瘤区域与模型分割区域的空间重叠。'
  },
  {
    id: 'E-005', sourceId: 'SRC-001',
    locator: 'Section 4.10, label values (ET)',
    summary: '综述说明 BraTS 2023 的增强肿瘤（ET）标签值改为 3，早期挑战使用 4。'
  },
  {
    id: 'E-006', sourceId: 'SRC-001',
    locator: 'Section 4.10, Number of tasks',
    summary: '综述在 BraTS 2023 章节列出 8 项挑战任务。'
  },
  {
    id: 'E-007', sourceId: 'SRC-002',
    locator: 'Performance metrics, Intersection over union (equation 7)',
    summary: '该综述把 IoU（Jaccard index）定义为真实标注掩膜与模型预测掩膜的重叠指标。'
  },
  {
    id: 'E-008', sourceId: 'SRC-002',
    locator: 'Performance metrics, F1-Score (equation 6)',
    summary: '该综述指出 F1 分数是 precision（精确率）与 recall（召回率）的调和平均。'
  }
];
