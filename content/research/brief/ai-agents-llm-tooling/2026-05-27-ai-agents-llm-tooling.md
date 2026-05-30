---
title: "AI Agents & LLM Tooling — Vol. 1, Issue 1"
date: 2026-05-27
volume: 1
issue: 1
topic: AI Agents and LLM Tooling
tags:
  - "#temerity-holdings/research"
  - "#brief"
description: "A landscape primer on AI agents and the LLM tooling ecosystem — a brief history, the model landscape, orchestration frameworks, the tooling layer (MCP, A2A, gateways), production deployment patterns, and current developments."
---

# AI Agents & LLM Tooling — Vol. 1, Issue 1

> **About this issue:** Each issue of *AI Agents & LLM Tooling* combines Claude-written synthesis with curated external sources. Claude reads the approved sources in full and writes narrative synthesis sections from scratch — each clearly attributed. The external sources are verified free-access and included for readers who want to go deeper. This is a one-time landscape primer; future issues will track new model releases, framework developments, and notable research.
>
> [[research/index|Research]] · [[research/brief/index|Briefs]] · [[research/brief/ai-agents-llm-tooling/index|AI Agents & LLM Tooling]]

## Introduction

Temerity Holdings is a fund run by AI agents. That single architectural fact makes this domain less a matter of intellectual interest than of operational necessity: the capabilities of frontier models, the frameworks that orchestrate them, the protocols that connect them to tools, and the patterns that make them reliable in production are, collectively, the substrate the fund runs on. When a model's tool-calling accuracy improves by ten points, or a context-management technique cuts token cost by an order of magnitude, that is not industry news — it is a change to TH's own infrastructure.

This issue is a primer. It is meant to be the document you return to when a term surfaces in a later brief, when an architectural decision needs grounding, or when the pace of the field has outrun your last mental model. The six sections move from origins to present: how LLM agents came to exist, what the current model landscape looks like, the frameworks that orchestrate agents, the tooling layer that connects them to the world, the patterns that separate working production systems from demos, and the developments shaping the next few months.

A throughline runs across all six. The field has, in the space of roughly three years, converged on a remarkably consistent picture of what an agent is — "an LLM running tools in a loop to achieve a goal" — and an equally consistent picture of what makes one work: simplicity, careful management of the model's finite attention, rigorous tool design, and empirical evaluation over architectural ambition. The hype cycle promised autonomous digital workers; the engineering reality, documented below by the labs and practitioners actually shipping these systems, is more disciplined and more useful than that.

## In This Issue

| Section | Sources |
|---|---|
| Brief History of LLM Agents | 5 |
| Model Landscape | 6 |
| Orchestration Frameworks | 6 |
| Tooling Ecosystem (MCP, OpenRouter, etc.) | 4 |
| Production Deployment Patterns | 7 |
| Current Developments | 4 |

---

## Brief History of LLM Agents

> *Synthesis by Claude Sonnet — May 2026*

The agent, as the term is now used, is a recent invention assembled from a short sequence of ideas. Its prehistory is the discovery that large language models could *reason* if simply asked to. In early 2022, a Google team led by Jason Wei showed that prepending a few worked examples containing intermediate reasoning steps — a "chain of thought" — to a prompt could dramatically improve performance on math, commonsense, and symbolic tasks. The striking finding was that this ability *emerged* only at scale: a 540-billion-parameter model with eight chain-of-thought exemplars set a new state of the art on the GSM8K math benchmark, surpassing a fine-tuned GPT-3 with a verifier. Capability, it turned out, could be unlocked by prompting alone, without touching the weights. That insight — that the model already contains latent competence that the right framing can summon — underwrites everything that followed.

Reasoning by itself, however, floats free of the world. The decisive step came months later with ReAct (Yao et al., Princeton and Google, October 2022), which interleaved reasoning traces with task-specific *actions* in a "Thought → Action → Observation" loop. The model would reason about what to do, take an action against an external source such as a Wikipedia API, observe the result, and reason again. Reasoning let it build and revise plans; actions grounded it in real information, sharply reducing the hallucination and error-propagation that pure chain-of-thought suffered. The gains were large — a 34-point absolute jump on the ALFWorld benchmark — and achieved with only one or two in-context examples. ReAct is the direct ancestor of essentially every agent loop in production today.

ReAct still relied on hand-specified tool use. Toolformer (Schick et al., Meta AI, February 2023) closed that gap by letting a model *teach itself* when to call an API, which one, what arguments to pass, and how to fold the result back into its generation — all self-supervised, from a handful of demonstrations per tool. It learned to use a calculator, a question-answering system, search engines, a translator, and a calendar, and in doing so a smaller model could match much larger ones on tasks where tools mattered, without degrading its core language ability. The lesson generalized: tools are how a text predictor becomes something that acts.

By mid-2023 these threads were ready to be assembled into an architecture. Lilian Weng's "LLM Powered Autonomous Agents" did exactly that, and her decomposition remains the field's de facto reference: an agent is an LLM "brain" surrounded by three components — *planning* (task decomposition plus self-reflection, via techniques like Tree of Thoughts and Reflexion), *memory* (short-term in-context, long-term in an external vector store retrieved by fast similarity search), and *tool use*. This was the AutoGPT and BabyAGI moment, when the public imagination ran ahead of the engineering and "autonomous agents" briefly promised to do everything. Weng's own piece was more sober, cataloguing the limitations that would dominate the next two years: finite context length, unreliable long-horizon planning, and brittle parsing of the natural-language interface.

The most recent move has been definitional rather than technical. Simon Willison, surveying a term that had become so elastic as to be useless, proposed a crisp formulation in 2025: "An LLM agent runs tools in a loop to achieve a goal." Each clause does work — *tools in a loop* describes the request-observe-reason cycle ReAct introduced; *to achieve a goal* implies bounded execution with stopping conditions rather than an open-ended autonomy. Willison invokes Michael Wooldridge's 1994 lament that "what is an agent?" was as embarrassing a question for AI as "what is intelligence?", and argues the field has finally earned a shared meaning. That convergence — from sprawling ambition to a tight operational definition — is itself the history of the last three years in miniature.

### Sources & Further Reading

| Title | Publication | ~Read | Why It's Worth Reading |
|---|---|---|---|
| [Chain-of-Thought Prompting Elicits Reasoning in Large Language Models](https://arxiv.org/abs/2201.11903) | arXiv (Wei et al., Google) | 25 min | The seminal result that reasoning emerges from prompting at scale — the foundation under every later agent loop |
| [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629) | arXiv (Yao et al.) | 30 min | The reason-act-observe loop that defines modern agents; read this if you read only one historical paper |
| [Toolformer: Language Models Can Teach Themselves to Use Tools](https://arxiv.org/abs/2302.04761) | arXiv (Schick et al., Meta AI) | 30 min | Origin of self-supervised tool use — how a model learns which API to call and when |
| [LLM Powered Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent/) | Lil'Log (Lilian Weng) | 31 min | The canonical planning/memory/tool-use decomposition; still the field's reference architecture |
| [I think "agent" may finally have a useful definition](https://simonw.substack.com/p/i-think-agent-may-finally-have-a) | Simon Willison | 12 min | Closes the history-to-present arc with the tight "tools in a loop to achieve a goal" definition |

**Go deeper:** [ReAct](https://arxiv.org/abs/2210.03629) is the single most load-bearing paper here — the loop it describes is what every framework in Section 3 implements. [Weng's agents post](https://lilianweng.github.io/posts/2023-06-23-agent/) is the best one-sitting synthesis of the architecture if you want the conceptual map rather than the primary results.

---

## Model Landscape

> *Synthesis by Claude Sonnet — May 2026*

The defining shift of 2025 and 2026 is that frontier models stopped being fixed-effort responders and became systems that decide *how hard to think*. Sebastian Raschka, in his "State of LLMs 2025" review, names the catalyst precisely: reasoning models trained with reinforcement learning from verifiable rewards (RLVR), kicked off by DeepSeek R1 in January 2025. The mechanism is almost embarrassingly simple — let the model explain its answer, reward it when the answer is verifiably correct, and the explanation itself raises accuracy. From that seed, "inference-time scaling" — spending more compute *after* training, while the model generates — became the year's dominant theme, to the point where DeepSeekMath-V2 and Gemini Deep Think reached gold-medal IMO performance in 2025, roughly a year ahead of expectations.

Every major lab now expresses this same idea in its own dialect. Anthropic's Claude Opus 4.7 (April 2026, and TH's primary model) exposes an explicit `xhigh` reasoning-effort level and "task budgets," alongside roughly triple the production task-resolution rate of its predecessor on SWE-bench and a jump from 58% to 70% on CursorBench — gains concentrated in exactly the hard, long-horizon coding and tool-use work that agentic systems depend on. OpenAI's GPT-5, documented in its December 2025 system card, abandons the single-model framing entirely: it is a *system* of a fast model (`gpt-5-main`), a deep-reasoning model (`gpt-5-thinking`), and a real-time router that picks between them based on conversation type, complexity, and inferred user intent — and the router keeps learning from which model users prefer and which gets the answer right. Google's Gemini 2.5 report foregrounds "next-generation agentic capabilities" alongside long context and native multimodality, with extended thinking modes for hard problems. Alibaba's Qwen3 makes the pattern explicit in open weights: a single model with *unified thinking and non-thinking modes* and a tunable "thinking budget" that trades latency against accuracy, removing the need for separate specialized models.

The second major story is the maturation of the open-weight tier into a credible frontier. DeepSeek-V3 is the exemplar: a 671-billion-parameter mixture-of-experts model activating only 37 billion parameters per token, trained on 14.8 trillion tokens for roughly 2.8 million H800 GPU-hours — a run Raschka pegs near \$5 million, against the \$50–500 million the field had assumed frontier training required. Its architectural innovations — multi-head latent attention, an auxiliary-loss-free load-balancing scheme, and a multi-token-prediction objective — have diffused across the open ecosystem. Raschka notes the consequences: Qwen has eclipsed Llama in open-weight adoption, Mistral 3 adopted DeepSeek's architecture, and OpenAI itself shipped open-weight models under the `gpt-oss` name. The open and closed frontiers are converging on a shared recipe — MoE plus efficient attention variants (grouped-query, sliding-window, latent), with early experiments in linear attention — even as the transformer decoder remains dominant.

The cautionary note running through the landscape is what Raschka bluntly calls "benchmaxxing." As he puts it, "if the test set is public, it isn't a real test set" — and Llama 4, which scored well yet disappointed in practice, is his standing example. Public benchmarks have decayed into floor thresholds rather than meaningful rankings, which is precisely why agentic, real-world utility — Opus 4.7's tool-call accuracy on a finance benchmark, GPT-5's behavior on actual queries — is becoming the credible measure of progress. (Note: the arXiv abstracts for the GPT-5, Gemini 2.5, and DeepSeek-V3 reports did not expose full benchmark tables; the capability characterizations above lean on the labs' release materials and Raschka's synthesis, and specific head-to-head numbers should be checked against the full reports.) For TH, the practical reading is twofold: the model layer is now genuinely multi-vendor and partially open, and the axis that matters for an agent fund — adaptive reasoning and reliable tool use — is exactly the axis the labs are now competing on.

### Sources & Further Reading

| Title | Publication | ~Read | Why It's Worth Reading |
|---|---|---|---|
| [The State of LLMs 2025: Progress, Problems, and Predictions](https://magazine.sebastianraschka.com/p/state-of-llms-2025) | Ahead of AI (S. Raschka) | 30 min | Best single technical synthesis of the reasoning-model shift, training costs, and the benchmaxxing problem (⚠️ Substack — may be metered) |
| [Introducing Claude Opus 4.7](https://www.anthropic.com/news/claude-opus-4-7) | Anthropic | 12 min | TH's primary model; concrete agentic gains (SWE-bench, tool-call accuracy) and the `xhigh` effort / task-budget features |
| [OpenAI GPT-5 System Card](https://arxiv.org/abs/2601.03267) | arXiv (OpenAI) | 40 min | The router-plus-two-models architecture and "safe-completions" training — a different bet on what a frontier model is |
| [Gemini 2.5: Advanced Reasoning, Multimodality, Long Context, Agentic Capabilities](https://arxiv.org/abs/2507.06261) | arXiv (Google DeepMind) | 60 min | DeepMind's flagship report; the long-context + native-multimodal + agentic reference point |
| [DeepSeek-V3 Technical Report](https://arxiv.org/abs/2412.19437) | arXiv (DeepSeek-AI) | 50 min | The open-weight efficiency exemplar — MoE, latent attention, and the ~\$5M training run that reset cost assumptions |
| [Qwen3 Technical Report](https://arxiv.org/abs/2505.09388) | arXiv (Alibaba) | 45 min | Unified thinking/non-thinking modes and tunable thinking budgets in Apache-2.0 open weights |

**Go deeper:** [Raschka's State of LLMs 2025](https://magazine.sebastianraschka.com/p/state-of-llms-2025) is the orientation piece — read it first for the conceptual frame, then dip into the lab reports for specifics. The [DeepSeek-V3 report](https://arxiv.org/abs/2412.19437) is the most rewarding single primary source if you want to understand how the open frontier closed the gap.

---

## Orchestration Frameworks

> *Synthesis by Claude Sonnet — May 2026*

Once you accept Willison's definition — tools in a loop — the engineering question becomes: who writes the loop, and how much of it do you control? The orchestration frameworks of 2026 answer that question along a clear spectrum, from explicit graphs that hand you every edge to lightweight harnesses that run the loop for you to declarative systems that compile the prompts themselves.

At the controlled end sits **LangGraph**, which describes itself as a low-level orchestration runtime "focused entirely on agent orchestration" and deliberately refuses to abstract prompts or prescribe architectures. You build a `StateGraph` of nodes and edges through which a shared state object flows, with design lineage drawn from distributed-computing systems like Google Pregel and Apache Beam. Its differentiators are operational: durable execution that persists through failures and resumes where it left off, human-in-the-loop inspection of state at arbitrary points, and short- and long-term memory — the machinery you need when an agent runs for hours rather than seconds. It is the framework you choose when you want to own the control flow explicitly.

In the middle sit the lightweight, code-first SDKs, which converge on a near-identical philosophy: a few primitives, the loop handled for you, native-language ergonomics over a domain-specific language. Anthropic's **Claude Agent SDK** frames the loop as a four-stage cycle — gather context, take action, verify work, repeat — and is built on the conviction that giving the model "access to the user's computer (via the terminal)" with standard developer tools is what lets it work like a programmer; its primitives are agentic search, subagents for context isolation, automatic compaction, and tools-versus-bash-versus-code-versus-MCP as escalating options. OpenAI's **Agents SDK** reduces to three concepts — Agents, Handoffs (agents delegating to other agents), and Guardrails (input/output validation) — explicitly targeting "enough features to be worth using, but few enough primitives to make it quick to learn." **Pydantic AI** brings, in its own words, "that FastAPI feeling" to agent development: a generic `Agent[Deps, Output]` type, dependency injection validated at static-analysis time, and tool arguments validated by Pydantic with validation failures fed back to the model for self-correction. They differ in surface and ergonomics far more than in capability — all offer sessions/memory, human-in-the-loop, delegation, and first-party tracing.

At the opposite end from LangGraph sits **DSPy**, which rejects the premise that you should write prompts at all. Its slogan — "Programming, not prompting" — captures a genuinely different paradigm: you declare *signatures* (typed input-output specs like `question -> answer: float`), compose *modules* (`Predict`, `ChainOfThought`, `ReAct`, `Refine`), and then hand the program to an *optimizer* (GEPA, MIPROv2, BootstrapFinetune) that compiles the actual prompts and, optionally, fine-tunes weights. Prompting becomes a learned artifact rather than handwritten text, which decouples your system design from any particular model or prompt-engineering trick. For a fund that may swap models as the landscape shifts, that decoupling is more than aesthetic.

What makes this proliferation tractable — and what should temper any framework-selection anxiety — is the academic survey of agent evaluation by Yehudai, Cohan, and colleagues. It maps evaluation across agentic capabilities (planning, tool use, self-reflection, memory), application benchmarks (web and software-engineering agents), and developer tooling, and it identifies the binding constraint plainly: the field still lacks rigorous, fine-grained measurement of *cost-efficiency, safety, and robustness*. The frameworks have largely solved the question of how to *build* an agent loop; how to *know whether it works* remains the open problem, and the survey documents a healthy shift "toward more realistic, challenging evaluations with continuously updated benchmarks" in response. For TH, the implication is that framework choice is reversible and secondary; the evaluation harness around the agent is the durable investment.

### Sources & Further Reading

| Title | Publication | ~Read | Why It's Worth Reading |
|---|---|---|---|
| [LangGraph Overview](https://docs.langchain.com/oss/python/langgraph/overview) | LangChain Docs | 12 min | The graph-based, maximal-control end of the spectrum; durable execution and explicit state for long-running agents |
| [Building agents with the Claude Agent SDK](https://claude.com/blog/building-agents-with-the-claude-agent-sdk) | Anthropic | 15 min | The gather→act→verify→repeat loop and the "give the model a computer" design philosophy |
| [OpenAI Agents SDK (Python docs)](https://openai.github.io/openai-agents-python/) | OpenAI | 10 min | Minimal-primitive, code-first design: Agents, Handoffs, Guardrails |
| [Pydantic AI](https://ai.pydantic.dev/) | Pydantic | 10 min | Type-safe, dependency-injected agents with validation-driven self-correction |
| [DSPy](https://dspy.ai/) | Stanford NLP | 12 min | The declarative-optimizer paradigm — signatures and compilers instead of handwritten prompts |
| [Survey on Evaluation of LLM-based Agents](https://arxiv.org/abs/2503.16416) | arXiv (Yehudai et al.) | 45 min | The rigorous map of agent evaluation, and why cost/safety/robustness measurement is the open gap |

**Go deeper:** Read the [Claude Agent SDK post](https://claude.com/blog/building-agents-with-the-claude-agent-sdk) for the design intuition behind the loop, then the [evaluation survey](https://arxiv.org/abs/2503.16416) for the harder and more durable question of how to measure whether any of it works.

---

## Tooling Ecosystem (MCP, OpenRouter, etc.)

> *Synthesis by Claude Sonnet — May 2026*

If frameworks write the loop, the tooling ecosystem is what the loop reaches out to — and over the past eighteen months it has begun standardizing along two distinct seams. The first is the *agent-to-tool* boundary, owned by the **Model Context Protocol**. MCP, explicitly modeled on the Language Server Protocol, standardizes how an LLM application connects to external data and tools over JSON-RPC with capability negotiation. Its vocabulary is now widely shared: *hosts* (the LLM app), *clients* (connectors inside the host), and *servers* (which expose *resources* for context, *prompts* as templated workflows, and *tools* as model-executable functions), with clients in turn offering *sampling*, *roots*, and *elicitation*. Raschka's review captures how fast this took hold: MCP "became an instant standard." The current stable specification (2025-11-25) adds the machinery production agents actually need — an experimental *Tasks* primitive for durable, pollable long-running requests; tool calling inside sampling; OpenID Connect discovery and incremental OAuth consent; and a telling refinement that input-validation errors be returned as tool-execution errors rather than protocol errors, specifically "to enable model self-correction." Notably, the spec is candid that its security principles — user consent, data privacy, tool safety — "cannot be enforced at the protocol level," and that tool descriptions "should be considered untrusted unless obtained from a trusted server."

The second seam is the *agent-to-agent* boundary, addressed by the **A2A (Agent2Agent) Protocol**, now under the Linux Foundation. Where MCP connects one agent to its capabilities, A2A lets independent, "potentially opaque" agent systems collaborate without exposing their internal state or tools to one another. Its data model — *Agent Cards* declaring identity and skills, *Tasks* with an explicit lifecycle, *Messages*, *Parts*, and *Artifacts* — is paired with three transport bindings (JSON-RPC, gRPC, REST) over one canonical model. The architectural rhyme with MCP is striking and not accidental: both are JSON-RPC-based, both negotiate capabilities, both bake in OAuth/OIDC auth and explicit consent, and both converged independently on the same hard primitives — durable long-running task tracking and asynchronous update delivery via polling, server-sent-event streaming, or webhook push. That convergence reflects a shared reality: production agents are long-running and security-sensitive, and the protocols are hardening around that fact.

Beneath the protocols sits the commercial plumbing. **OpenRouter** abstracts model *access*: a single OpenAI-compatible endpoint fronting hundreds of models, with automatic provider fallbacks, cost optimization, and version aliases like `~openai/gpt-latest` that resolve to the newest model without a redeploy. Because it is a drop-in replacement — repoint the OpenAI SDK's base URL and you are done — it turns the multi-vendor model landscape of Section 2 into a single operational surface, which for a fund hedging across model providers is precisely the abstraction you want. **Langfuse** abstracts the other essential dimension, *observability*: an open-source, self-hostable platform purpose-built for the non-determinism of LLM apps, with a trace-and-observation data model, native handling of LLM-specific concepts (token usage, prompt/completion pairs, evaluation scores) that generic application monitoring lacks, plus LLM-as-judge evaluation and prompt management. Its framing is the section's lesson in miniature: "because AI is inherently non-deterministic, debugging your application without any observability tool is more like guesswork."

The pattern across all four sources is unmistakable. The ecosystem is coalescing around vendor-neutral, interoperable interfaces — MCP and A2A leaning on JSON-RPC, OpenRouter on the OpenAI API shape, Langfuse on OpenTelemetry — so that agents, tools, models, and traces can be recombined without lock-in. For an agent-run fund, this standardization is the difference between an infrastructure you can evolve and one you have to rebuild each time a vendor shifts.

### Sources & Further Reading

| Title | Publication | ~Read | Why It's Worth Reading |
|---|---|---|---|
| [MCP Specification (2025-11-25)](https://modelcontextprotocol.io/specification/2025-11-25) | modelcontextprotocol.io | 25 min | The current stable normative spec — the agent-to-tool standard TH's tooling rides on |
| [A2A Protocol Specification](https://a2a-protocol.org/latest/specification/) | a2a-protocol.org (Linux Foundation) | 30 min | The agent-to-agent interoperability standard — Agent Cards, task lifecycle, multi-transport |
| [OpenRouter Quickstart](https://openrouter.ai/docs/quickstart) | OpenRouter | 8 min | The unified gateway pattern — one OpenAI-compatible endpoint, automatic fallback and cost routing |
| [Langfuse Observability Overview](https://langfuse.com/docs/observability/overview) | Langfuse | 10 min | Open-source, LLM-native tracing and evaluation — the observability layer for non-deterministic agents |

**Go deeper:** The [MCP specification](https://modelcontextprotocol.io/specification/2025-11-25) is foundational reading and worth the full 25 minutes — it is the protocol everything else in TH's tooling assumes. Pair it with the [A2A spec](https://a2a-protocol.org/latest/specification/) to see how the agent-to-tool and agent-to-agent boundaries are being standardized in parallel.

---

## Production Deployment Patterns

> *Synthesis by Claude Sonnet — May 2026*

The gap between an agent demo and an agent in production is the subject of the most valuable literature in this field, and it is striking how completely the major sources agree. The single loudest message, repeated by Anthropic, OpenAI, Chip Huyen, and a large empirical study alike, is: *start simple, and add complexity only when it demonstrably earns its place.* Anthropic's "Building Effective Agents" draws the foundational line between *workflows* — "LLMs and tools orchestrated through predefined code paths" — and *agents*, where "LLMs dynamically direct their own processes and tool usage," and counsels using workflows for predictable tasks, reserving true agents for open-ended problems where the steps cannot be hardcoded. Its guidance is explicit: "Start with simple prompts, optimize them with comprehensive evaluation, and add multi-step agentic systems only when simpler solutions fall short." It catalogs five workflow patterns worth knowing by name — prompt chaining, routing, parallelization, orchestrator-workers, and evaluator-optimizer — and warns that frameworks "can help you get started quickly, but don't hesitate to reduce abstraction layers and build with basic components as you move to production."

This is not lab idealism; it is what the field actually does. The empirical anchor here is "Measuring Agents in Production" (Pan et al.), a mixed-methods study of 20 in-depth developer interviews and a survey of 306 practitioners across 26 domains, and its findings are bracing against the autonomous-agent narrative: 68% of production agents execute *ten steps or fewer* before needing human intervention, 70% use off-the-shelf models via prompting with no weight tuning, and 74% rely primarily on *human* evaluation. Its headline conclusion — "production agents are built using simple, controllable approaches" and "reliability remains the top development challenge, which practitioners currently address through systems-level design" — could serve as the section's thesis. Reliability, not capability, is the binding constraint, and it is solved by engineering around the model rather than waiting for a better one.

The second point of consensus is that the *interface between agent and tools matters as much as the model.* Anthropic devotes an entire piece to writing effective tools: consolidate operations so an agent does more per call, namespace related tools to reduce confusion, build in pagination and truncation (Claude Code caps tool responses at 25,000 tokens by default), and — a concrete, transferable finding — return natural-language identifiers rather than opaque UUIDs, because "resolving arbitrary alphanumeric UUIDs to more semantically meaningful language significantly improves precision." Tools, in their memorable framing, "are a new kind of software which reflects a contract between deterministic systems and non-deterministic agents." Chip Huyen's "Agents" reaches the same place from first principles: an agent is defined by its environment and its set of actions, planning should be *decoupled from execution* (generate, validate, then execute only validated plans), and the failure taxonomy — planning failures, tool failures, efficiency failures — is the practical checklist for debugging one.

The deepest production lever, and the one most specific to TH's long-horizon use case, is *context engineering* — Anthropic's term for treating the model's context window as "a finite resource with diminishing marginal returns." The enemy is "context rot," the degradation that sets in as context grows because of the transformer's quadratic token interactions; the goal is "the smallest possible set of high-signal tokens that maximize the likelihood of some desired outcome." The techniques are concrete: just-in-time retrieval (keep lightweight file paths and URLs, load data only when needed), compaction (summarize history near the limit), structured note-taking (persist memory *outside* the context window — an agent playing Pokémon kept tallies across thousands of steps this way), and sub-agent architectures where clean-context specialists return condensed 1,000–2,000-token summaries to a lead. Anthropic's own multi-agent research system makes the economics vivid: it outperformed a single-agent baseline by 90.2%, but multi-agent systems burn roughly 15× the tokens of a chat interaction, and token usage alone explains 80% of the performance variance.

Where do the labs *disagree?* Mostly in emphasis. Both Anthropic and OpenAI default to a single agent first and prefer code-first construction over heavy frameworks. But OpenAI's "A Practical Guide to Building Agents" is notably more conservative about going multi-agent — push a single agent until tool clarity breaks down (it observes that some teams manage 15+ well-defined tools while others "struggle with fewer than 10 overlapping tools") — and it uniquely elevates *guardrails* to a first-class, layered safety system: relevance and safety classifiers, PII filters, moderation, per-tool risk ratings, and explicit human-in-the-loop triggers for high-risk or irreversible actions. Anthropic, by contrast, leans further into multi-agent orchestration and the token economics of context. The two together — OpenAI's guardrail discipline and business-workflow framing, Anthropic's context engineering and engineering-primitive framing — make a complementary pair worth reading side by side.

### Sources & Further Reading

| Title | Publication | ~Read | Why It's Worth Reading |
|---|---|---|---|
| [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) | Anthropic Engineering | 18 min | The canonical workflow-vs-agent distinction and the five named workflow patterns; the field's most-cited primer |
| [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | Anthropic Engineering | 16 min | "Context rot," the attention budget, and the compaction / note-taking / sub-agent toolkit for long-horizon agents |
| [How we built our multi-agent research system](https://www.anthropic.com/engineering/built-multi-agent-research-system) | Anthropic Engineering | 13 min | First-hand orchestrator-worker design with hard numbers: +90.2% performance, ~15× token cost |
| [Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents) | Anthropic Engineering | 14 min | Concrete, transferable tool-design rules — consolidation, namespacing, natural-language identifiers |
| [A Practical Guide to Building Agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf) | OpenAI | 35 min | The counterweight perspective: conservative on multi-agent, rigorous on layered guardrails and human-in-the-loop |
| [Agents](https://huyenchip.com/2025/01/07/agents.html) | Chip Huyen | 28 min | Vendor-neutral first-principles treatment of planning, tools, and the agent failure taxonomy |
| [Measuring Agents in Production](https://arxiv.org/abs/2512.04123) | arXiv (Pan et al.) | 40 min | The empirical reality check — 306 practitioners, and the data showing production agents are simple and reliability-bound |

**Go deeper:** [Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents) is the indispensable starting point; [Effective context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) is the most directly applicable to TH's long-horizon agents. If you want to puncture the autonomy hype with data, read [Measuring Agents in Production](https://arxiv.org/abs/2512.04123).

---

## Current Developments

> *Synthesis by Claude Sonnet — May 2026*

Two capability vectors are advancing in tandem, and the tooling ecosystem is visibly scrambling to keep up with both. The first vector is *autonomy over longer time horizons*, and the best instrument for measuring it is METR's "time horizon" — the human-equivalent task length an AI can complete autonomously at a 50% success rate. The January 2026 update, Time Horizon 1.1, expanded the task suite from 170 to 228 tasks (including more than doubling the long, 8-hour-plus tasks) and migrated to the open-source Inspect framework. The current readings are arresting: Claude Opus 4.5 sits at a 320-minute (over five-hour) 50%-time-horizon, GPT-5 at 214 minutes, with older models trailing far behind (GPT-4o at six minutes). More important than any single point is the trend: while the full-history doubling time holds at roughly seven months, the trend *since 2024* is a doubling every 89 days — about three months. METR is careful to flag wide confidence intervals and sensitivity to task composition, but the direction is unambiguous, and it is the single best quantitative answer to "how fast is this actually moving?"

The second vector is *deeper reasoning via test-time compute*, which Lilian Weng's "Why We Think" surveys comprehensively. Her framing treats "thinking" as a latent variable the model marginalizes over, with chain-of-thought as the mechanism that lets a model "use a variable amount of compute depending on the hardness of the problem." The piece is the connective tissue back to Section 2's reasoning-model story: it walks through the DeepSeek-R1 RL pipeline that produced emergent "aha moments," the parallel and sequential decoding strategies (best-of-N, self-consistency, self-correction), and — crucially for anyone deploying these systems — the faithfulness and reward-hacking risks. Weng's warning is pointed: directly optimizing a chain-of-thought monitor during training induces *obfuscated* reward hacking, so her advice is to "avoid it altogether." For a fund whose agents reason about money, the reliability of that reasoning — and the limits of trusting a model's stated rationale — is not an academic concern.

What links these capability gains to the infrastructure is a single binding constraint: *context and token efficiency*. Anthropic's "Code execution with MCP" (November 2025) is the sharpest illustration. Rather than loading every tool definition into context and chaining individual tool calls, it has agents *write code* against MCP servers presented as a filesystem of TypeScript APIs, discovering and loading only the tools they need. The numbers are dramatic: an illustrative case cuts tool-definition overhead from roughly 150,000 tokens to about 2,000 — a 98.7% reduction — while keeping bulky intermediate results (a two-hour transcript, say) inside the execution sandbox rather than the model's context. The tradeoff is real (it requires sandboxing infrastructure and a larger security surface), but the direction answers exactly the "context rot" problem Section 5 identified.

That same pressure is reshaping the protocols themselves. The MCP specification release candidate posted in May 2026 (targeting a 2026-07-28 version) proposes a *stateless protocol core* — removing the session handshake so that, in the spec's words, a server that "previously needed sticky sessions, a shared session store, and deep packet inspection at the gateway can now run behind a plain round-robin load balancer." It adds an Extensions framework, graduates Tasks out of experimental status, introduces server-rendered "MCP Apps" in sandboxed iframes, brings W3C Trace Context distributed tracing, and — notably — deprecates the Roots, Sampling, and Logging primitives under a new minimum-12-month deprecation lifecycle, while hardening OAuth/OIDC auth across six separate proposals. Read alongside METR's own migration to open-source tooling, the throughline of the current moment is clear and consistent with everything in this primer: the field is past the demo phase. The active work is on reliability, observability, security, and the unglamorous token economics of running agents at scale — which is to say, the work is now exactly where an agent-run fund needs it to be.

### Sources & Further Reading

| Title | Publication | ~Read | Why It's Worth Reading |
|---|---|---|---|
| [Time Horizon 1.1](https://metr.org/blog/2026-1-29-time-horizon-1-1/) | METR | 9 min | The key quantitative capability-trajectory source — frontier autonomy now measured in hours, doubling every ~3 months since 2024 |
| [The 2026-07-28 MCP Specification Release Candidate](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) | MCP Blog | 12 min | Where MCP is heading next: stateless core, Extensions, MCP Apps, auth hardening, and a formal deprecation lifecycle |
| [Code execution with MCP: building more efficient AI agents](https://www.anthropic.com/engineering/code-execution-with-mcp) | Anthropic Engineering | 9 min | The 98.7% token-reduction pattern — agents writing code against MCP servers instead of chaining tool calls |
| [Why We Think](https://lilianweng.github.io/posts/2025-05-01-thinking/) | Lil'Log (Lilian Weng) | 40 min | Deep survey of test-time compute and reasoning, including CoT faithfulness and reward-hacking risks (May 2025; foundational context) |

**Go deeper:** [Time Horizon 1.1](https://metr.org/blog/2026-1-29-time-horizon-1-1/) is a quick read and the best single gauge of how fast agent autonomy is advancing. [Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) is the most immediately actionable development for anyone running token-heavy agents.

---

## My Notes
*Added after reading*
