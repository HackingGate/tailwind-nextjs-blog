---
title: Terraforming Existing Cloudflare Configuration
date: '2023-11-04'
tags: [Terraform, Cloudflare, IaC, DNS]
type: Blog
license: CC BY-SA 4.0
---

## Introduction

Terraform, a popular IaC (Infrastructure as code) tool to foster the ease of infrastructure management and reduces human errors. Terraform as a tool supports many providers such as the major three cloud providers (AWS, Azure, GCP), and many more. In this blog post, we will be focusing on the Cloudflare provider and how to use it to manage your Cloudflare configuration.

## Prerequisites

The following tools installed on your machine:
- Terraform: [hashicorp/terraform](https://github.com/hashicorp/terraform)
- Cloudflare provider: [cloudflare/terraform-provider-cloudflare](https://github.com/cloudflare/terraform-provider-cloudflare)
- Utility to terraform existing Cloudflare resources: [cloudflare/cf-terraforming](https://github.com/cloudflare/cf-terraforming)

A Cloudflare account with a domain configured.

Find the Zone ID and Account ID of your domain by following the instructions in the following link:
https://developers.cloudflare.com/fundamentals/setup/find-account-and-zone-ids/

## Getting Started

### Terraform DNS Records 

Create a new directory
```bash
mkdir terraform-cloudflare
cd terraform-cloudflare
```

Create a new file `provider.tf` and add the following content:
```hcl
terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}
```

Create a new file `variables.tf` and add the following content:
```hcl
variable "cloudflare_api_token" {
  description = "Cloudflare API Token"
  type        = string
  default     = "<API_TOKEN>"
}
```

Create a token by using Edit zone DNS template from the [Cloudflare dashboard](https://dash.cloudflare.com/profile/api-tokens) and replace the `<API_TOKEN>` with the newly created token.

Generate DNS records using [cf-terraforming](https://github.com/cloudflare/cf-terraforming):

```bash
cf-terraforming generate -e '<Cloudflare_Email>' \
  -t '<API_TOKEN>' \
  --resource-type 'cloudflare_record' \
  --zone '<ZONE_ID>' \
  > cloudflare_record.tf
```

Replace the `'<Cloudflare_Email>'` with your Cloudflare account email, `'<API_TOKEN>'` with the newly created token and `'<ZONE_ID>'` with the zone id of your domain.

Run `terraform init` to initialize the provider and `terraform plan` to see the changes that will be applied.

Run `terraform apply` to apply the changes.

### Terraform Cloudflare Tunnel

Edit the api token created in the previous step and add the following permissions:

- Account -> Cloudflare Tunnel -> Edit

```bash
cf-terraforming generate -e '<Cloudflare_Email>' \
  -t '<API_TOKEN>' \
  --resource-type 'cloudflare_tunnel' \
  --account '<ACCOUNT_ID>' \
  > cloudflare_tunnel.tf
```

Run `terraform plan` to see the changes that will be applied.

Run `terraform apply` to apply the changes.

### Terraform Cloudflare Access

Edit the api token created in the previous step and add the following permissions:

- Account -> Access: Apps And Policies -> Edit

```bash
cf-terraforming generate -e '<Cloudflare_Email>' \
  -t '<API_TOKEN>' \
  --resource-type 'cloudflare_access_application' \
  --account '<ACCOUNT_ID>' \
  > cloudflare_access_application.tf
```

## Conclusion

I noticed not all functionality supported by the Cloudflare provider for Terraform, the state will not be read when I try to run `terraform plan` or `terraform apply` and I have to manually delete the resource from the Cloudflare dashboard and re-run `terraform apply` to create the resource again.