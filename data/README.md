# 数据管理

此目录用于说明数据来源和使用条件。原始数据和中间处理结果分别放在本地 `raw/`、`processed/`，已被 `.gitignore` 排除。

需要复现时，在相应实验记录中写明数据集名称、版本、获取地址、许可、下载或生成步骤、校验值及必要的预处理方法。只有获得分享许可且体积合适的数据样例才应单独加入版本控制。

## 本地演示的公开示例资料

`app/sample-data.mjs` 仅含两篇综述的书目信息、章节定位和少量**人工撰写的中文概述**，没有复制论文全文、医学影像或患者数据。核对日期：2026-10-24。下列许可针对论文原文；本仓库的概述是个人原型内容，不暗示论文作者认可本产品。

| ID | 来源与定位 | 许可 |
| --- | --- | --- |
| SRC-001 | Bonato, Nanni & Bertoldo (2025), *Advancing Precision: A Comprehensive Review of MRI Segmentation Datasets from BraTS Challenges (2012–2025)*, DOI: [10.3390/s25061838](https://doi.org/10.3390/s25061838), [PMC 原文](https://pmc.ncbi.nlm.nih.gov/articles/PMC11945730/)；演示涉及 Abstract 与 Section 4.10 | 原文页面注明 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| SRC-002 | *A Survey of Brain Tumor Segmentation and Classification Algorithms* (2021), DOI: [10.3390/jimaging7090179](https://doi.org/10.3390/jimaging7090179), [PMC 原文](https://pmc.ncbi.nlm.nih.gov/articles/PMC8465364/)；演示涉及 Performance metrics 中 Dice 相似系数定义 | 原文页面注明 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |

本地演示不会在线抓取这些论文。来源链接只用于人工核对；章节定位应随原文版本复查。数据集 BraTS 的使用许可与论文许可不同，本仓库没有下载或分发 BraTS 数据。

演示中的手动来源由使用者在浏览器中自行输入，不属于上表中已由项目作者核对的内置资料。应用仅检查 HTTPS 链接及部分字段格式，不验证内容、作者身份或许可；未填写许可时卡片记为“待核实”。公开分享导出的卡片前，使用者须自行复核来源和分享权利。

### 人工概述索引

| 条目 | 依据位置 | 核对重点 |
| --- | --- | --- |
| E-001 | SRC-001 Abstract | 2012–2024 的回顾与当时规划中的 2025 挑战。 |
| E-002 | SRC-001 Section 4.10 MRI modalities | T1、T1c、T2、FLAIR 四种模态。 |
| E-003 | SRC-001 Section 4.10 item 6 | BraSyn-2023 的 2021 数据来源和随机缺失模态。 |
| E-004 | SRC-002 Performance metrics equation 8 | Dice/DSC 的空间重叠含义。 |
| E-005 | SRC-001 Section 4.10 label values | ET 标签值在 2023 年由 4 改为 3。 |
| E-006 | SRC-001 Section 4.10 Number of tasks | 综述列出的 8 项任务。 |
| E-007 | SRC-002 Performance metrics equation 7 | IoU/Jaccard 的重叠定义。 |
| E-008 | SRC-002 Performance metrics equation 6 | F1 与 precision、recall 的调和平均关系。 |
