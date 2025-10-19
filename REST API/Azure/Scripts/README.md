# Azure DevOps Scripts

This folder contains scripts used in the Azure DevOps CI/CD pipeline.

## CheckSecrets.csx

A C# script that scans the codebase for potential hardcoded secrets.

**Purpose:** Security scanning during CI/CD pipeline to detect:
- API keys
- Passwords
- Secrets/tokens
- Connection strings with passwords

**Usage in Pipeline:**
```yaml
# Option 1: Warning only (does not fail build)
- script: dotnet script Azure/Scripts/CheckSecrets.csx
  displayName: 'Scan code for obvious secrets'

# Option 2: Fail build on detected secrets
- script: |
    export FAIL_ON_SECRETS=true
    dotnet script Azure/Scripts/CheckSecrets.csx
  displayName: 'Scan code for obvious secrets'
```

**Requirements:**
- dotnet-script global tool (install via: `dotnet tool install -g dotnet-script`)
- Note: Azure DevOps hosted agents may not have dotnet-script pre-installed
- Consider installing in pipeline: `dotnet tool install -g dotnet-script || true`

**Note:** This script is designed to catch obvious mistakes. For production use, consider using specialized tools like:
- GitGuardian
- TruffleHog
- detect-secrets
- GitHub Advanced Security

## Future Scripts

This folder can contain additional scripts for:
- Code coverage report generation
- Database migration scripts
- Deployment validation scripts
- Infrastructure provisioning scripts
