# Feedback

The Feedback panel lets you submit suggestions, bug reports, and content ideas that get refined by AI and posted as GitHub Issues.

## Opening the Panel

Click the **speech bubble icon** in the sidebar bottom bar (next to the theme picker and docs link). This navigates to the Feedback view.

## Submitting Feedback

1. **Title** -- a brief summary of your feedback
2. **Description** -- detailed explanation of the suggestion, bug, or idea
3. **Channel** (optional) -- associate the feedback with a specific channel for context

## AI Grooming

Click **Groom with AI** to have the local Ollama model analyze and refine your feedback. The AI returns:

- **Refined Title** -- a clearer, more actionable version
- **Summary** -- 1-2 sentence distillation
- **Action Items** -- concrete checklist of things to do
- **Labels** -- categorization tags (e.g., "bug", "feature", "content-idea")
- **Priority** -- low, medium, or high based on impact
- **Suggestions** -- tips to improve or expand the feedback

All fields are editable after grooming -- tweak anything before submitting.

## Submitting to GitHub

Click **Submit to GitHub** to create an issue in the [VibeSmiths/VideoIdeas](https://github.com/VibeSmiths/VideoIdeas) repository.

::: warning GITHUB_TOKEN Required
The "Submit to GitHub" button is only visible when a `GITHUB_TOKEN` is configured. The panel checks `GET /api/keys` on mount to detect this. If no token is found, a hint appears explaining how to add one via the API Keys modal or `GITHUB_TOKEN` in `app/.env`.
:::

The issue includes:

- Refined title as the issue title
- Markdown body with summary, action items checklist, original description, suggestions, and metadata
- Labels from the groomed result plus a `feedback` label
- Submitter username from your Keycloak login (included in the payload as `submittedBy`)
- Submitter username from your Keycloak login

The submission runs as an async NATS worker job. You'll see real-time status updates, and a link to the created issue once complete.

::: info Requirements
- **Ollama** must be running for AI grooming. Enable GPU services via Helm (`gpu.enabled: true` in values.yaml) or `docker compose -f docker-compose.dev.yml --profile gpu up -d` for local dev.
- **GitHub Token** required for issue submission — add via API Keys modal or `GITHUB_TOKEN` in `app/.env`
:::

## Re-grooming

Click **Re-groom** to run the AI analysis again with your edited fields. This is useful if you've substantially changed the description after the first grooming pass.
