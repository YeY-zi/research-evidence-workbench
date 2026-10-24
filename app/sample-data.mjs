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
    summary: '这篇综述回顾 BraTS 2012–2024 年的数据集发展，并概述当时仍在规划中的 2025 年挑战。',
    topics: ['years']
  },
  {
    id: 'E-002', sourceId: 'SRC-001',
    locator: 'Section 4.10, MRI modalities',
    summary: '综述列出 BraTS 2023 的四种 MRI 模态：T1、增强 T1（T1c）、T2 和 FLAIR。',
    topics: ['modalities']
  },
  {
    id: 'E-003', sourceId: 'SRC-001',
    locator: 'Section 4.10, item 6: Synthesis (Global)—missing MRI',
    summary: '综述说明 BraSyn-2023 基于 BraTS 2021 数据集，并设置随机缺失一种 MRI 模态的任务。',
    topics: ['brasyn']
  },
  {
    id: 'E-004', sourceId: 'SRC-002',
    locator: 'Performance metrics, Dice similarity coefficient (equation 8)',
    summary: '该综述把 Dice 相似系数用于衡量真实肿瘤区域与模型分割区域的空间重叠。',
    topics: ['dice']
  }
];
