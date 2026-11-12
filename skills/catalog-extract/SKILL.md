---
name: catalog-extract
description: >-
  Turns the skills, subagents, and MCP servers configured in the current environment into WonderStack community
  catalog files (tools/<slug>.yaml). Use when the user asks to extract, export, or contribute their agents, MCP
  servers, skills, or local AI setup to the WonderStack community catalog.
---

# Extract catalog entries from this environment

Read the skills, subagents, and MCP servers this agent can see, and write one `tools/<slug>.yaml` per public item.
The files are public facts under Apache 2.0. Copy the example that matches the kind, then replace the facts:

| Kind | When | Example |
|---|---|---|
| `skill` | a `SKILL.md` or a skill pack | `tools/anthropic-pdf-skill.yaml` |
| `agent` | a subagent, coding agent, or custom assistant | `tools/goose.yaml` |
| `mcp_server` | an MCP server entry | `tools/github-mcp.yaml` |
| `tool` | a product that is none of the above | `tools/chatgpt.yaml` |

One new file per item. Skip an item that already has a file in `tools/`. Show the drafts to the user before committing. This repository accepts one pull request per file.

## Leave these out

- Values of `env`, `headers`, tokens, API keys, passwords, and connection strings.
- Any URL with a user, a password, a query string, or a host of `localhost`, `127.0.0.1`, or a private address.
- A server or skill that has no public `https` page. A private or company-only endpoint stays unpublished.
- E-mail addresses, phone numbers, real names of private people, and home-directory paths.
- `.env` files and credential stores. Do not open them.

When a configured command contains a secret argument, keep the public package name only. If you cannot separate them, set `install_hint` to `null`.

## Where to look

Read names and public package or repository identifiers. Ignore secret fields.

- MCP: `.cursor/mcp.json`, `.vscode/mcp.json`, `.mcp.json`, and the user-level MCP config for Cursor, Claude, Codex, or Goose. The useful fields are the server name, the package in `command`/`args`, and a docs link. Discard `env` and `headers`.
- Skills: `SKILL.md` files (front matter `name` and `description`) under the project and under the user skills directory.
- Agents: subagent markdown under `.claude/agents/` or the equivalent agents directory, plus a named agent whose own page or repository is public.

A folder of local notes with no official page is not a catalog entry.

## Write the file

`id` is lower snake case, 2–40 characters, from the public name (`GitHub MCP` → `github_mcp`). The file is `tools/<id with - instead of _>.yaml`.

Required shape (also in `schema/tool.schema.json`):

```yaml
id: github_mcp
kind: mcp_server          # tool | skill | agent | mcp_server
name: "GitHub MCP server"
vendor: "GitHub"          # maker, or "" when unknown
category: code            # research | write | visual | media | code | ops | data | teach
url: "https://github.com/github/github-mcp-server"   # official page or repository, https only
best_for: "Letting an assistant read repositories, issues and pull requests and act on them"
pricing: "Unknown"        # the maker's words, or Unknown
level: intermediate       # beginner | intermediate | advanced
free_tier: null           # true, false, or null — null when you do not know
tagline: null
tags: []
aliases: []
platforms: []             # claude | claude_code | cursor | copilot | vscode | chatgpt | gemini | windsurf | cline | n8n | any_mcp | web | cli
docs_url: null
github_repo: null         # owner/name, or null
install_hint: null        # public install line, or null
```

`best_for` is one sentence, 10–300 characters, about what it is for. Quote pricing only when the official page states it. Otherwise `pricing: "Unknown"` and `free_tier: null`. Put a value in double quotes when it contains `: ` or starts with a special character. No nested maps, no multi-line strings.

`url` is the official page or repository, found from the package or the project's own docs. It is never the URL stored in the user's config.

## Check, then stop

```bash
node scripts/validate.mjs tools/<slug>.yaml
```

Fix every error it prints. Then list the new files and the items you skipped, with the reason. Commit only when the user asks. A commit that adds a catalog file is signed off (`git commit -s`) under Apache 2.0.
