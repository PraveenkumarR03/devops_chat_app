# Chat App — DevOps Demo

A simple real-time Chat App built to demonstrate the full DevOps lifecycle — from writing code to automatic deployment.

> Built for II Year B.E. CSE students · CS25C10 Object Oriented Software Engineering

---

## What is inside

| File / Folder | What it does |
|---|---|
| `src/` | Node.js + Express backend API |
| `public/` | WhatsApp-style chat frontend |
| `test/` | 4 automated tests (Node built-in test runner) |
| `Dockerfile` | Packages the app into a container image |
| `.github/workflows/ci.yml` | Full CI/CD pipeline — runs on every push to main |

> **Note:** Messages are stored in memory and reset when the server restarts. Intentional — keeps the demo simple.

---

## The pipeline — fully automatic

Every `git push` to `main` triggers all 4 jobs in order:

```
push to main
    ↓
1. Test          — installs deps, runs 4 automated tests
    ↓
2. Build & Push  — builds Docker image, pushes to Docker Hub
                   tags: praveenkumarr03/devops_chat_app:<sha> + latest
    ↓
3. Deploy        — calls Render deploy hook → Render pulls new image and goes live
    ↓
4. Release       — creates a GitHub Release tagged v2026.10.22-<sha>
```

Pull requests only run **Step 1 (tests)** — no deploy on PRs.

---

## GitHub Secrets required

Go to your repo → **Settings → Secrets and variables → Actions → New repository secret**

| Secret | Value |
|---|---|
| `DOCKERHUB_USERNAME` | `praveenkumarr03` |
| `DOCKERHUB_TOKEN` | Docker Hub access token (Account Settings → Security → New Access Token) |
| `RENDER_DEPLOY_HOOK_URL` | Render service → Settings → Deploy Hook |

---

## Step 1 — Run locally

```bash
npm install
npm test        # 4 tests should pass
npm start       # starts server at http://localhost:3000
```

Open two browser tabs at **http://localhost:3000** — enter different names and chat between tabs.

Health check: http://localhost:3000/api/health → `{"status":"ok"}`

---

## Step 2 — Run with Docker

```bash
docker build -t chat-app .
docker run --rm -p 3000:3000 chat-app
```

---

## Step 3 — Set up Render

1. Sign in at https://render.com
2. **New → Web Service → Connect GitHub repo** (`PraveenkumarR03/devops_chat_app`)
3. Runtime: **Docker**
4. Create the service
5. Go to **Settings → Deploy Hook** → copy the URL → add as `RENDER_DEPLOY_HOOK_URL` secret in GitHub

---

## Step 4 — Push and watch it deploy

```bash
git add .
git commit -m "your message"
git push
```

Go to **github.com/PraveenkumarR03/devops_chat_app/actions** — watch all 4 jobs run automatically.

---

## How this maps to the DevOps lifecycle

| DevOps Stage | Tool | What happens |
|---|---|---|
| Plan | GitHub Issues | Track features and tasks |
| Code | Git + GitHub | Version control, branches, pull requests |
| Build | Docker | Package app into a container image |
| Test | Node test runner | 4 automated tests on every push |
| CI | GitHub Actions | Auto pipeline triggered on push |
| Deploy | Render | Auto-deploy via deploy hook |
| Release | GitHub Releases | Auto-tagged after every successful deploy |
| Monitor | Render logs + `/api/health` | Watch app health in production |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Port 3000 in use | `docker run --rm -p 3001:3000 chat-app` → open http://localhost:3001 |
| Tests fail | Run `npm test` locally, check the first failing test |
| Docker push fails | Check `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN` secrets |
| Render not deploying | Check `RENDER_DEPLOY_HOOK_URL` secret and Render build logs |
| Push denied (403) | Run `gh auth login` or use a Personal Access Token |
| Messages disappear | Expected — storage is in memory only |