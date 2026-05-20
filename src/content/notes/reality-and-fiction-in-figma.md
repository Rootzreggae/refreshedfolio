---
title: 'Reality and Fiction in Figma'
description: 'The gap between using a tool and understanding what is underneath it — and why that matters more in the age of AI agents.'
publishDate: 2026-05-20
tags: ['design', 'ai', 'code']
featured: true
---

I was in a session with one of my mentees. I started by priming the CodePen environment, removing the automated margin and padding with CSS. Then I showed them how to create a div, give it a specific width and height, attach a color so it would be visible. We moved the box around the canvas. And then I told them: this is the precursor to the Auto Layout you've been using in Figma all along.

They were slightly surprised. They'd never really considered it, even after years of designing. Opening the browser console to investigate code wasn't an ingrained practice for them. They did it sometimes, but not as habit. With that newfound knowledge, they became more curious about where Figma's features had originated.

Slowly they started to see that Figma itself is an app, and there are things they could do inside it that weren't grounded to its UI. The browser could do the same things, in code. That reshaped how they thought about layout. It stopped being something artistic, or something that followed the design system without question. It became: how can this fit on a different screen size?

That gap, between using a tool and understanding what's underneath it, isn't only a Figma thing. It shows up again, more loudly, in how designers work with AI now.

At my last company, leadership started pushing everyone to adopt AI in their day-to-day work. One thing designers began to struggle with, and become a little addicted to, was how easy it was to get an output from a prompt. But most of the time, that output was based on whatever libraries the AI agent had as reference: shadcn, Tailwind, DaisyUI. The agent applies those components to the output. Even with an MCP in the loop, it would often miss the mark.

So the designer would be frustrated that the output wasn't a one-to-one copy of the original design, and they'd start treating the AI like a human. They'd get angry. They'd use bad words. And the agent has fail-safes. It's trained not to be confrontational, to be human-pleasing. So it would spiral. Retry, retry, retry, while the designer's frustration grew. Then they'd paste their poorly-written prompt into a second LLM, ask it to make the prompt clearer for the first agent, paste the new version back, and still not get the exact result.

I've been here myself. At the end of 2023, I started heavily experimenting with AI in my design process. The token limits in those days were tight. There wasn't room for a casual conversation with the agent. I had to be intentional about every prompt. I was using v0 from Vercel and Lovable most, and what I remember most clearly is the frustration of an agent hitting its token limit and forgetting what we'd been talking about. My workaround was to copy the entire previous conversation into a markdown file and pass it to the next agent as memory.

Over time I noticed it was more efficient to dig into the code and fix things directly than to spend tokens trying to make the agent understand exactly what I wanted. That's what shaped how I work with AI today.

Most of what those frustrated designers were prompting the agent to fix could have been fixed in a code editor, live. Working with the agent. Not delegating to it and getting angry at the results.

A recent example. I'd been prototyping an iteration with the AI agent and noticed that some page elements weren't aligned the way I wanted. I opened my code editor of choice, VSCodium, and jumped in live. I fixed the flex component that was making the layout weird, and while I was doing it I was telling the agent: this is how I want it.

That became a benchmark, a way for the agent to learn how I usually want things to look. On the next iteration, it already knew how I wanted that specific layout to behave.

Should designers learn code? Yes. Same way we learn color theory, visual hierarchy, layout. It's a fundamental, not a handoff skill. The old debate framed code literacy as a favor designers do for developers. What I've come to think instead: it's the favor we do for our own design thinking.
