# 题集人工核对说明（单人桌面标注）

这 30 个问题于 2026-10-24 按固定来源内容编写并冻结，用于本地**规则检索**的离线测试。21 个问题预期命中指定证据条目，9 个问题预期拒答。`desk_checked` 表示本次依据公开原文位置做单人核对；未经过医学影像领域第二标注者复核，不是目标用户提问样本。

| 证据 ID | 问题 ID | 人工判定依据 |
| --- | --- | --- |
| E-001 | Q01–Q03 | [Bonato 等综述](https://pmc.ncbi.nlm.nih.gov/articles/PMC11945730/) Abstract：回顾 2012–2024，2025 当时处于规划。 |
| E-002 | Q04–Q06 | 同文 Section 4.10 “MRI modalities”：T1、T1c、T2、FLAIR。 |
| E-003 | Q07–Q09 | 同文 Section 4.10 item 6 “Synthesis (Global)—missing MRI”：BraSyn-2023 基于 2021 数据，随机缺失一种模态。 |
| E-004 | Q10–Q12 | [Biratu 等综述](https://pmc.ncbi.nlm.nih.gov/articles/PMC8465364/) Performance metrics, equation 8：Dice/DSC 衡量分割区域重叠。 |
| E-005 | Q13–Q15 | Bonato 等 Section 4.10 label values：ET 在 2023 年由 4 改为 3。 |
| E-006 | Q16–Q17 | Bonato 等 Section 4.10 “Number of tasks: 8”。 |
| E-007 | Q18–Q19 | Biratu 等 Performance metrics, equation 7：IoU/Jaccard index 衡量预测掩膜与真值掩膜重叠。 |
| E-008 | Q20–Q21 | Biratu 等 Performance metrics, equation 6：F1 是 precision 与 recall 的调和平均。 |
| 无条目 | Q22–Q30 | 题目所需的精确模型分数、患者判断、挑战排名或产品价格均未进入本地资料。即使公开网站其他位置可能有答案，**此受控资料集**应拒答。 |

题集检查关注的是来源 ID 与拒答；自动脚本无法判断中文概述是否真的被原文支持。来源支持性由上表单人核对，后续应由独立标注者复核，并增加对抗题和真实用户提问。
