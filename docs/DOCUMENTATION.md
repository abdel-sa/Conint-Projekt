# Secret Notes — Project Documentation

> Note: this file follows the section structure required by the semester project
> specification. Transfer the finished content into the official FHTW template
> before submission.

## 1. Applications + Docker Files
<!-- Chosen frameworks (React, Fastify), Dockerfile walkthrough, ports, env vars -->
TODO

## 2. Version Control
<!-- Branching strategy: main, feature/*, deploy/production. Link to README#branching-strategy -->
TODO

## 3. Infrastructure (AWS)
<!-- EC2 instance type/config, RDS (Postgres) config, VPC/security group rules -->
TODO

## 4. Docker Hub
<!-- Repository names, tagging strategy (git SHA + latest) -->
TODO

## 5. CI Servers
<!-- GitHub Actions + Jenkins setup, screenshots of successful/failing runs -->
TODO

## 6. Code Quality Server (SonarQube)
<!-- Setup on AWS, metrics tracked (code smells, duplication, coverage) -->
TODO

## 7. Security Scan Server (Snyk)
<!-- How Snyk is wired into the Lint stage, how findings are triaged/fixed -->
TODO

## 8. Feature Toggle & A/B Test Server (PostHog)
<!-- Setup, the `secret-notes-ui-variant-b` flag, how to enable/disable it -->
TODO

## 9. Each Stage of the Pipeline
<!-- Lint, Test, Build, Deliver, Deploy, E2E/Performance — what each does, failure/notification behavior -->
TODO

## 10. Features and Refined User Stories
<!-- Acceptance criteria + implementation notes for Feature A, B, C -->
TODO

## 11. A/B Testing
<!-- How to set up a new PostHog split test for a different UI/encryption flow -->
TODO

## 12. Blue/Green Deployment
<!-- deploy/ folder walkthrough: docker-compose.blue-green.yml, router.conf, deploy-green.sh, switch-blue-green.sh -->
TODO

## 13. Logging and Monitoring (Outlook)
<!-- Proposed approach, e.g. CloudWatch for AWS, or ELK -->
TODO
