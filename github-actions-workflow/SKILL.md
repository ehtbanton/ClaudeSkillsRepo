---
name: github-actions-workflow
description: Generate GitHub Actions workflow YAML files for CI/CD pipelines including testing, building, and deployment automation. Triggers on "create GitHub Actions workflow", "generate CI/CD pipeline", "GitHub workflow for", "actions yaml for".
---

# GitHub Actions Workflow Generator

Generate production-ready GitHub Actions workflow files for CI/CD automation.

## Output Requirements

**File Output:** `.github/workflows/{name}.yml`
**Format:** Valid GitHub Actions YAML
**Standards:** GitHub Actions latest syntax

## When Invoked

Immediately generate a complete workflow file. Include appropriate triggers, jobs, and steps for the project type.

## Workflow Templates

### Node.js CI/CD Pipeline
```yaml
# .github/workflows/ci.yml

name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  workflow_dispatch:

env:
  NODE_VERSION: '20'
  PNPM_VERSION: '8'

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run ESLint
        run: pnpm lint

      - name: Run TypeScript check
        run: pnpm typecheck

  test:
    name: Test
    runs-on: ubuntu-latest
    needs: lint
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
      redis:
        image: redis:7
        ports:
          - 6379:6379
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run tests
        run: pnpm test:coverage
        env:
          DATABASE_URL: postgresql://test:test@localhost:5432/test
          REDIS_URL: redis://localhost:6379

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/lcov.info
          fail_ci_if_error: false

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: test
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: ${{ env.PNPM_VERSION }}

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: dist/
          retention-days: 7

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.example.com
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/

      - name: Deploy to staging
        run: |
          echo "Deploying to staging..."
          # Add deployment commands here

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://example.com
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: build
          path: dist/

      - name: Deploy to production
        run: |
          echo "Deploying to production..."
          # Add deployment commands here
```

### Docker Build and Push
```yaml
# .github/workflows/docker.yml

name: Docker Build

on:
  push:
    branches: [main]
    tags: ['v*.*.*']
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    name: Build and Push
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up QEMU
        uses: docker/setup-qemu-action@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to Container Registry
        if: github.event_name != 'pull_request'
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          platforms: linux/amd64,linux/arm64
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

### Python CI Pipeline
```yaml
# .github/workflows/python-ci.yml

name: Python CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    name: Test Python ${{ matrix.python-version }}
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        python-version: ['3.10', '3.11', '3.12']

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Python ${{ matrix.python-version }}
        uses: actions/setup-python@v5
        with:
          python-version: ${{ matrix.python-version }}

      - name: Install Poetry
        uses: snok/install-poetry@v1
        with:
          virtualenvs-create: true
          virtualenvs-in-project: true

      - name: Load cached venv
        id: cached-poetry-dependencies
        uses: actions/cache@v4
        with:
          path: .venv
          key: venv-${{ runner.os }}-${{ matrix.python-version }}-${{ hashFiles('**/poetry.lock') }}

      - name: Install dependencies
        if: steps.cached-poetry-dependencies.outputs.cache-hit != 'true'
        run: poetry install --no-interaction --no-root

      - name: Install project
        run: poetry install --no-interaction

      - name: Run linters
        run: |
          poetry run ruff check .
          poetry run mypy .

      - name: Run tests
        run: poetry run pytest --cov --cov-report=xml

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        if: matrix.python-version == '3.12'
        with:
          files: ./coverage.xml
```

### Release Workflow
```yaml
# .github/workflows/release.yml

name: Release

on:
  push:
    tags: ['v*.*.*']

permissions:
  contents: write
  packages: write

jobs:
  release:
    name: Create Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Generate changelog
        id: changelog
        uses: orhun/git-cliff-action@v2
        with:
          config: cliff.toml
          args: --latest --strip header

      - name: Create Release
        uses: softprops/action-gh-release@v1
        with:
          body: ${{ steps.changelog.outputs.content }}
          draft: false
          prerelease: ${{ contains(github.ref, '-') }}
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  publish-npm:
    name: Publish to NPM
    runs-on: ubuntu-latest
    needs: release
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Publish
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Scheduled Workflow
```yaml
# .github/workflows/scheduled.yml

name: Scheduled Tasks

on:
  schedule:
    # Run at 00:00 UTC every day
    - cron: '0 0 * * *'
  workflow_dispatch:

jobs:
  dependency-review:
    name: Check Dependencies
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Check for outdated dependencies
        run: npm outdated || true

      - name: Run security audit
        run: npm audit --audit-level=high

  cleanup:
    name: Cleanup Old Artifacts
    runs-on: ubuntu-latest
    steps:
      - name: Delete old workflow runs
        uses: Mattraks/delete-workflow-runs@v2
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          repository: ${{ github.repository }}
          retain_days: 30
          keep_minimum_runs: 5
```

### Reusable Workflow
```yaml
# .github/workflows/deploy-reusable.yml

name: Reusable Deploy

on:
  workflow_call:
    inputs:
      environment:
        required: true
        type: string
      url:
        required: true
        type: string
    secrets:
      DEPLOY_KEY:
        required: true

jobs:
  deploy:
    name: Deploy to ${{ inputs.environment }}
    runs-on: ubuntu-latest
    environment:
      name: ${{ inputs.environment }}
      url: ${{ inputs.url }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Deploy
        run: |
          echo "Deploying to ${{ inputs.environment }}"
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
```

### Calling Reusable Workflow
```yaml
# .github/workflows/deploy.yml

name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-staging:
    uses: ./.github/workflows/deploy-reusable.yml
    with:
      environment: staging
      url: https://staging.example.com
    secrets:
      DEPLOY_KEY: ${{ secrets.STAGING_DEPLOY_KEY }}

  deploy-production:
    needs: deploy-staging
    uses: ./.github/workflows/deploy-reusable.yml
    with:
      environment: production
      url: https://example.com
    secrets:
      DEPLOY_KEY: ${{ secrets.PROD_DEPLOY_KEY }}
```

## Common Patterns

### Matrix Strategy
```yaml
strategy:
  fail-fast: false
  matrix:
    os: [ubuntu-latest, macos-latest, windows-latest]
    node: [18, 20]
    exclude:
      - os: windows-latest
        node: 18
```

### Conditional Steps
```yaml
- name: Deploy
  if: github.ref == 'refs/heads/main' && github.event_name == 'push'
  run: ./deploy.sh
```

### Caching
```yaml
- name: Cache dependencies
  uses: actions/cache@v4
  with:
    path: ~/.npm
    key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    restore-keys: |
      ${{ runner.os }}-node-
```

## Validation Checklist

Before outputting, verify:
- [ ] Valid YAML syntax
- [ ] Workflow has `name` and `on` triggers
- [ ] Jobs have unique names
- [ ] Steps have `name` or `uses`/`run`
- [ ] Secrets accessed via `${{ secrets.NAME }}`
- [ ] Checkout action included where needed
- [ ] Correct action versions used (@v4, etc.)

## Example Invocations

**Prompt:** "Create GitHub Actions workflow for Node.js with testing and Docker deploy"
**Output:** Complete `.github/workflows/ci.yml` with test, build, Docker push jobs.

**Prompt:** "Generate GitHub workflow for Python library with PyPI publish"
**Output:** Complete `.github/workflows/release.yml` with test matrix, build, PyPI publish.

**Prompt:** "GitHub Actions for monorepo with conditional builds"
**Output:** Complete workflows with path filters, matrix builds, shared dependencies.
