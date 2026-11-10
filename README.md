# WonderStack community catalog

An open list of **what people contribute**: a tool [WonderStack](https://wonderstackai.com) does not list yet, a
correction to a public fact, and **free training** that teaches a tool for a real job. It is not a copy of the
WonderStack catalog. Anyone can read a contributed file and reuse it with the credit its licence asks for, and anyone
can add to the list with a pull request — from GitHub, or from the
"Suggest a tool / Add free training / Fix this tool" buttons on WonderStack, which open the pull request for you.
The person who sends the pull request is the one credited, which is how the list grows.

```
tools/<slug>.yaml          one tool, skill, agent or MCP server per file (one example of each kind is already here)
training/<slug>.md         one free training per file (one example is already here)
schema/*.schema.json       JSON Schemas both kinds of file must pass
jobs.json                  the jobs taxonomy training files refer to (job: <id>)
scripts/validate.mjs       schema + consistency checks (no dependencies: Node 22+)
scripts/check-links.mjs    checks that the links still work
skills/catalog-extract/    instructions an agent follows to catalog its own skills, agents and MCP servers
```

## Licences — and why

| What | Licence | Why |
|---|---|---|
| `tools/` (catalog data) | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) — see [LICENSE-DATA.md](LICENSE-DATA.md) | Facts about products should travel as far as possible: anyone (other directories, researchers, companies, AI assistants) may reuse them, commercially too, as long as they credit "WonderStack community catalog". Share-alike would stop many reusers from mixing it with their own data, and a database of short facts gains little from copyleft. |
| `training/` (descriptions written by contributors) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) — see [LICENSE-CONTENT.md](LICENSE-CONTENT.md) | These are original texts. Share-alike keeps improved versions open (the Wikipedia model) while still allowing commercial reuse with credit. The linked course itself keeps **its own** licence (stated in its `licence:` field); we only link to it. |
| `skills/` | [MIT](LICENSE) | Agent instructions, same kind of pack as other public skill repositories. A copy keeps the MIT notice. That notice is not a credit line: MIT does not require anyone to name this catalog. |
| `scripts/`, `schema/`, workflows | Part of this repository ([LICENSE](LICENSE)) | These files check and review contributions here. They are not a library, and they are not licensed for reuse or copying. |

Contributions are accepted under the same licence as the folder they land in ("inbound = outbound"), confirmed with the
[Developer Certificate of Origin 1.1](https://developercertificate.org/) — see [CONTRIBUTING.md](CONTRIBUTING.md).
There is no separate CLA.

## What belongs here — and what never does

- Yes: public facts about a product (official link, what it is best for, pricing as the maker states it, platforms),
  free training that really is free, corrections.
- Never: personal data (e-mails, phone numbers, names of private people, anything about a user), secrets or keys,
  paid courses, affiliate links, link shorteners, marketing superlatives without a source. The validator refuses
  e-mails, phone numbers and things that look like keys.
- Opinions and ratings ("how I use this tool for my job", 1–5 satisfaction) are **not** kept here: they are personal
  data and live inside WonderStack, where members can edit or delete them and where numbers are only published for
  groups of at least 5 people.

## How a merge reaches WonderStack

A sync job reads merged pull requests every hour:

- a **new tool** arrives as a *candidate* — a WonderStack editor still decides whether it is listed;
- a **fix** updates descriptive fields (text, tags, links, pricing text) of an existing tool — never its listing,
  category, official URL or any ranking signal;
- **free training** appears on the tool pages.

**Nothing here changes any ranking.** WonderStack orders tools by relevance and real use only; payment, sponsorship,
contributions and scout rewards are never ranking inputs.

## Validate locally

```bash
node --version            # 22 or newer
npm run validate          # schemas, file names, jobs, tool references, personal data
npm run check-links       # every link (slow); CI only checks the files a PR changes
```

## Credit

Contributors who send pull requests from WonderStack can choose to be credited with their WonderStack handle; merged
contributions count on the [WonderStack scouts board](https://wonderstackai.com/scouts). Git history credits everyone
who commits directly.

## Where entries come from

WonderStack's catalog is not copied here. Each kind has one example, so you can copy the shape:

| Kind | Example |
|---|---|
| tool | [tools/chatgpt.yaml](tools/chatgpt.yaml) |
| skill | [tools/anthropic-pdf-skill.yaml](tools/anthropic-pdf-skill.yaml) |
| agent | [tools/goose.yaml](tools/goose.yaml) |
| MCP server | [tools/github-mcp.yaml](tools/github-mcp.yaml) |
| free training | [training/example-free-training.md](training/example-free-training.md) |

Everything else appears when a person opens a pull request and a maintainer merges it. That is what gets credited,
and it is how the list grows.

`pnpm community:export --out ../wonderstack-community` (in the WonderStack app repository) refreshes the format
files only: `schema/`, `jobs.json` and `scripts/lib/community-files.mjs`. It does not write `tools/` or `training/`.

## For agents

An agent that can see your skills, subagents, and MCP servers can draft the catalog files for you. Paste this:

```text
Read skills/catalog-extract/SKILL.md in the wonderstack-community repo and follow it. Extract my skills, agents, and MCP servers into tools/*.yaml. Public facts only. Do not include secrets.
```

The same instructions are in [AGENTS.md](AGENTS.md). The skill writes one file per item, skips anything private or already listed, and runs `node scripts/validate.mjs` on each draft.

## Maintainers

See [CODEOWNERS](.github/CODEOWNERS). Be kind: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Security issues: see
[SECURITY.md](SECURITY.md).
