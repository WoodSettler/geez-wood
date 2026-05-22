---
title: "为什么我离开了 vscode"
summary: "不是 vscode 不好 — 是它假设你已经知道在做什么。 我经常不知道。"
date: 2026-02-02
type: field
tags: [tools, code]
readingMin: 6
---

不是 vscode 不好。 vscode 是好软件。

但它有一个核心假设: 你已经知道你要写什么。 你已经选好了 framework, 你已经规划好了文件结构, 你已经知道你要 import 哪些库。 vscode 是 *实现工具*, 不是 *思考工具*。

我经常不知道我要写什么。 我有一个模糊的想法, 我想先把它说出来, 看看能不能跑。 vscode 帮不了这件事。

## claude code 帮得了

它不是 ide, 是对话。 对话比 ide 更接近思考的形状。 我可以说: "我想做一个能 dedupe 一个 object 数组的函数, 但要按某个 key 去重" — 它给我代码 + 解释 + 边界条件警告。

之后我可以问: "如果 key 不存在呢? 如果数组里有 null 呢?" — 这些是我自己写代码时经常忘掉的边界。

## 不是替代

我没把 vscode 卸了。 写大项目、debug、refactor 仍然 vscode 更好。 但作为 *起步工具*, 我离开了它。
