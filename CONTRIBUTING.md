# Contributing

Thank you for helping. There are two ways to contribute — both end as a pull request reviewed by a maintainer.

1. **From WonderStack** (no Git needed): on [wonderstackai.com/tools](https://wonderstackai.com/tools), a tool page or
   [/requests](https://wonderstackai.com/requests), press **Suggest a tool**, **Add free training** or **Fix this
   tool**. WonderStack builds the file, checks it, and opens the pull request (or gives you a prefilled GitHub link).
2. **On GitHub**: fork, add or edit **one file**, run `npm run validate`, open a pull request with the matching
   template. You can also open an issue ("Add a tool", "Add free training", "Fix a tool") and a maintainer turns it
   into a file.

One pull request = one file, please. It keeps review fast and history clear.

## Sign-off (Developer Certificate of Origin)

We use the [Developer Certificate of Origin 1.1](https://developercertificate.org/) instead of a contributor licence
agreement. Sign off each commit:

```bash
git commit -s -m "Add tool: Superwhisper"
```

That adds `Signed-off-by: Your Name <you@example.com>` and certifies that you wrote the change (or may submit it) and
that you license it under this repository's licence for that folder (Apache 2.0 for `tools/`, `training/`, and
`skills/`). A change to `scripts/`, `schema/`, or a workflow stays in this repository. The address in the sign-off is the one Git already records in the commit; use a GitHub
`noreply` address if you prefer not to publish yours.

Pull requests opened by the WonderStack bot carry the contributor's confirmation in the PR description (they ticked
the same declaration in the app); the bot account is exempt from the sign-off check.

## Tool entries — `tools/<slug>.yaml`

The file name is the `id` with `-` instead of `_` (`id: claude_code` → `tools/claude-code.yaml`). Copy the example
for the kind you are adding: [tool](tools/chatgpt.yaml), [skill](tools/anthropic-pdf-skill.yaml),
[agent](tools/goose.yaml), [MCP server](tools/github-mcp.yaml).

```yaml
id: superwhisper                 # lower snake case, 2–40 characters, unique
kind: tool                       # tool | skill | agent | mcp_server
name: "Superwhisper"
vendor: "Superwhisper"
category: write                  # research | write | visual | media | code | ops | data | teach
url: "https://superwhisper.com"  # the official page or repository, https only
best_for: "Dictating text anywhere on your Mac with an AI model"   # 10–300 characters
pricing: "Free / paid plans"     # as the maker states it; "Unknown" when unsure
level: beginner                  # beginner | intermediate | advanced
free_tier: true                  # true | false | null (unknown — never guess)
tagline: null                    # optional, 5–160 characters
tags:                            # up to 12, lower case
  - dictation
aliases: []                      # other names people type
platforms: []                    # see schema/tool.schema.json for the list
docs_url: null
github_repo: null                # owner/name
install_hint: null
```

Rules: public facts only, the maker's own wording for pricing, no superlatives without a source, no affiliate or
shortened links. When you are unsure, write `null` — unknown is better than wrong.

## Free training — `training/<slug>.md`

Copy [training/example-free-training.md](training/example-free-training.md).

```markdown
---
title: "Prompting for teachers, in 30 minutes"
url: "https://example.org/course"
tools:                    # 1–5 ids: a file in tools/, or a tool already listed on WonderStack
  - claude
job: plan_lessons         # an id from jobs.json
level: beginner
duration_minutes: 30
format: course            # course | video | article | guide | exercise | docs
language: en              # en | es | fr | de | pt | it | other
licence: "free-to-access" # the licence OF THE LINKED TRAINING: CC-BY-4.0 | CC-BY-SA-4.0 | CC0-1.0 | MIT | Apache-2.0 | free-to-access
cost: free                # only free training: no paywall, no trial that ends in a charge
author: "@yourhandle"     # optional public handle; null to stay anonymous
---

Two to five sentences in your own words (40–1500 characters, at most 2 links): what you learn, for which job, and
what you need before you start. No "# " headings.
```

## The YAML we accept

A deliberately small subset so the validator has no dependencies: `key: value` lines, values plain or in quotes,
`null`, `true`/`false`, numbers, lists as `- item` lines (or `[a, b]`). Put a value in double quotes when it contains
`: ` or starts with a special character. No anchors, nested maps or multi-line strings. `npm run validate` points at
the exact line when something is off.

## Review

- CI must pass: schema, file name, unique ids, known jobs and tools, no personal data, working links.
- A maintainer checks the facts against the official page. Typical turnaround: a few days.
- After the merge, WonderStack picks the change up within an hour (new tools as candidates, see README).

## What we will not merge

Personal data, paid or trial-gated training, affiliate links, copied text from the maker's marketing longer than a
short phrase, duplicate entries, or anything that tries to influence rankings ("best", "#1") without a source.
