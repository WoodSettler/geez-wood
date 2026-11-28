---
title: How to set yourself up for an OPC
subtitle: a good topic for the mid-term of AI era
summary: >-
  I've been working with AI agent for a long time, within my career role's
  scope.

  Nevertheless,

  working under a traditional infra and working as an AI-native organization is
  completely different.
date: 2026-11-29
type: project
tags:
  - AI
  - Agent
  - OPC
featured: false
draft: false
cover: /covers/essays/OPC/cover.png
music:
  title: Rather Than Faith...
  artist: In It
  netease: >-
    https://music.163.com/song?id=360535&uct2=U2FsdGVkX1/2Tj69IZtkHDFpIh4C8ayBgfO+mD/bCI8=
---
OPC is a fashion.

Even primary school kids are doing their "OPC"s nowadays, which sometimes shame me.

Like half a year ago I heard about OPC and was kinda interested about this topic beacuse I watched a AI developers panel and one guy shared that his OPC has like 5 agents or so, among which "Jobs" is in charge of aesthetic, "Bethos" is in charge of something and "Elon" is the CEO who directly report to him. Crazily interesting. But back then, AI agents and models were not so unbelievable and well-connected yet(for a non-IT like me), which cost a lot of time when I tried to create my own agent orchestration system – I named it Orki – so I didnt continue, becasue I've been so busy for the last 6 months working in my current company. I also did a website at that time but look, I got a little time to update and write sth only until now.

Now, is a good time. It seems that the friction I met half a year ago has been dismissed by the fast-as-hell development of the LLMs and Agent Harness ecosystem. I have recently made a "dsh call" mcp for my Claude Code and Antigravity, so that they can dispatch tasks in a far more flexible way– you know I relied on some of the SOTA mdoels to think and plan but I also highly trusted deepseek flash's capability, speed and affordability. It matters a lot because, for half a year even I was so busy working but also I learnt a lot working heavily daily with agents, and now the puzzles connect again, and largely multiplied by this connection.

So, somehow I decided to try OPC for real.

For quite a long time I'm working on my own market intelligence and EPL pipeline for my own work, with them running for more that 2 months and accumulated quite some analysable and comparable outcomes, maybe it's an occasion to "transform" them into some products.

I started with an empty repo ( a new folder), and I asked Gemini's new model Neon to use "grill-me" on this topic:

And it didn't go easy on me.

Half an hour into the interrogation, a lot of my vague "startup fantasies" got stripped
away. No fancy multi-page corporate website. No daily social media matrix. No building a
giant SaaS before anyone has paid a single dollar. I have a full-time job, which
realistically leaves me 10 to 15 hours a week. With that kind of bandwidth, the only
sensible north star is brutally simple: land the first real USD payment, starting by turning
my existing intelligence pipeline into an auditable deliverable for overseas clients, and
only then worrying about everything else.

What surprised me most wasn't the product plan—it was how differently you have to design an
AI-native organization compared to a traditional company.

Traditional companies build infrastructure around human friction: office chatrooms, an email
inbox for every employee, sync meetings, HR layers. In a one-person company backed by
agents, the only real bottleneck is my attention and my legal identity.

Agents don't need Slack channels to debate each other; letting agents chat in free-form IM is just an entropy machine. Instead, machine-to-machine collaboration should live in Git as structured file contracts, with strict separation between reusable mechanisms and business configs (leaving explicit slots for human decisions so no agent silently invents defaults on my behalf).

So instead of naming agents after tech billionaires for fun, I ended up with a clean,
boringly practical two-tier structure:

• At the portfolio root sits Anchor—my PMO director—responsible for cross-project governance,
shared infrastructure, and protecting my bandwidth.
• Inside the first venture repo sits Helm, the project commander, dispatching four
specialized agents (Scout, Forge, Wedge, and Flint) via my dsh-call MCP, each boxed into its
own write scope.

Then came the real-world physical constraint: during weekday work hours I'm on my ThinkPad
T14 and barely touch side projects, while my 4080S desktop sits at home running 24/7. Once I
framed the 4080S as the "24/7 company office" and my T14/phone as just a lightweight remote
terminal, the infrastructure question became crystal clear. I didn't need a chatty AI
assistant—I needed a quiet, zero-noise human-in-the-loop bridge.

So tonight, before writing another line of product code, Anchor and I built the smallest
viable infra stack:

1. A shared Feishu notification pipe that both Anchor and Helm can call whenever something
   genuinely needs my eyes.
1. A zero-LLM-token Gmail triage daemon running silently on the 4080S every 5 minutes
   (wrapped properly so no annoying terminal window flashes on screen). My Gmail inbox was a
   mess I almost never opened, yet it's becoming my main business mailbox. Now a tiny Node
   script silently labels and suppresses ~75% of the noise—Black Friday promos, social pings,
   newsletters—and only pushes P0 signals (client inquiries, payment/billing updates,
   security/domain alerts) straight to my Feishu.
1. A Feishu feed cleaner that muted a dozen noisy built-in official bots and carved out a
   dedicated, pinned "OPC Command Deck" tab on my phone.

And then came the moment that made this whole thing feel encouraging – after I also finished setup my payoneer account during setting up infra:

Literally seconds after we switched the 5-minute watcher to silent mode and ran a final check at almost 2 a.m., my phone buzzed in the new Command Deck. Three real P0 emails it had just caught on its own: my Upwork payment method was verified, and Payoneer had officially enabled escrow payouts.

For the first time, it didn't feel like I was tinkering with prompts in a terminal. It felt like a real quiet assistant had just started acting on her own, filtering the noise, guarding the door, and knocking me only when it actually mattered.

I guess that's enough infrastructure for now.

Can we get a real-world order?

We will.

Good night.
