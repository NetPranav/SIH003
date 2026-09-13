# ==============================================================================
# Smriti-NER (স্মৃতি / ꯁ꯭ꯃ꯭ꯔꯤꯇꯤ) — Terraform Cloud Infrastructure Definition
# SIH 2026 Problem Statement ID: 26003 | MDoNER
# Target: AWS India (ap-south-1 Mumbai) — MeitY Empaneled Cloud Environment
# Compliance: DISHA 2018 (Section 29/34) & ISO 27001 / CERT-In Certified
# ==============================================================================

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.30"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  backend "s3" {
    bucket         = "smriti-ner-terraform-state-mumbai"
    key            = "prod/infrastructure.tfstate"
    region         = "ap-south-1"
    encrypt        = true
    dynamodb_table = "smriti-terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project            = "Smriti-NER"
      ProblemStatementID = "26003"
      Ministry           = "MDoNER"
      DataSovereignty    = "IN-GOV-LOCAL"
      ComplianceTier     = "DISHA-2018-HIPAA-Equivalent"
      Environment        = var.environment
    }
  }
}

# ── Variables ────────────────────────────────────────────────────────────────
variable "aws_region" {
  type        = string
  default     = "ap-south-1" # Mumbai (MeitY Empaneled)
  description = "AWS India region for domestic data sovereignty"
}

variable "environment" {
  type        = string
  default     = "production"
}

variable "vpc_cidr" {
  type        = string
  default     = "10.100.0.0/16"
}

# ── 1. Virtual Private Cloud (VPC) & Multi-AZ Subnets ───────────────────────
resource "aws_vpc" "smriti_vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name = "smriti-vpc-${var.environment}"
  }
}

# Public Subnets for ALB & Edge NAT
resource "aws_subnet" "public" {
  count                   = 3
  vpc_id                  = aws_vpc.smriti_vpc.id
  cidr_block              = cidrsubnet(var.vpc_cidr, 4, count.index)
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name = "smriti-public-subnet-${count.index + 1}"
    Tier = "Public"
  }
}

# Private Subnets for ECS Fargate App Cluster
resource "aws_subnet" "app_private" {
  count             = 3
  vpc_id            = aws_vpc.smriti_vpc.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 4, count.index + 3)
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "smriti-app-private-subnet-${count.index + 1}"
    Tier = "Application"
  }
}

# Isolated Database Subnets for TimescaleDB / RDS
resource "aws_subnet" "db_isolated" {
  count             = 3
  vpc_id            = aws_vpc.smriti_vpc.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 4, count.index + 6)
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name = "smriti-db-isolated-subnet-${count.index + 1}"
    Tier = "Database"
  }
}

data "aws_availability_zones" "available" {
  state = "available"
}

# ── 2. KMS Customer Managed Keys (DISHA AES-256 Storage Encryption) ──────────
resource "aws_kms_key" "smriti_disha_key" {
  description             = "Customer Managed Key for Smriti-NER DISHA 2018 at-rest encryption"
  deletion_window_in_days = 30
  enable_key_rotation     = true

  tags = {
    Name = "smriti-disha-encryption-key"
  }
}

# ── 3. TimescaleDB / PostgreSQL 16 RDS Multi-AZ Database ───────────────────
resource "aws_db_subnet_group" "smriti_db_subnets" {
  name       = "smriti-db-subnet-group"
  subnet_ids = aws_subnet.db_isolated[*].id

  tags = {
    Name = "Smriti DB Subnet Group"
  }
}

resource "aws_db_instance" "timescaledb_primary" {
  identifier             = "smriti-timescaledb-${var.environment}"
  engine                 = "postgres"
  engine_version         = "16.1"
  instance_class         = "db.r6g.xlarge" # 4 vCPU, 32GB RAM for TimescaleDB compression
  allocated_storage      = 250
  max_allocated_storage  = 2000
  storage_type           = "gp3"
  storage_encrypted      = true
  kms_key_id             = aws_kms_key.smriti_disha_key.arn
  multi_az               = true
  db_subnet_group_name   = aws_db_subnet_group.smriti_db_subnets.name
  vpc_security_group_ids = [aws_security_group.db_sg.id]
  db_name                = "smriti_ner_db"
  username               = "smriti_admin"
  password               = var.db_password
  skip_final_snapshot    = false
  final_snapshot_identifier = "smriti-timescaledb-final-snapshot"
  backup_retention_period = 35
  deletion_protection    = true

  tags = {
    Name = "smriti-timescaledb-cluster"
  }
}

variable "db_password" {
  type      = string
  sensitive = true
  default   = "SmritiSecureTimescale2026!MDoNER"
}

# ── 4. ElastiCache Redis Cluster (Session & Task Broker) ────────────────────
resource "aws_elasticache_subnet_group" "redis_subnets" {
  name       = "smriti-redis-subnet-group"
  subnet_ids = aws_subnet.app_private[*].id
}

resource "aws_elasticache_replication_group" "smriti_redis" {
  replication_group_id          = "smriti-redis-cluster"
  description                   = "Redis 7.2 broker for Smriti-NER Celery workers"
  node_type                     = "cache.m6g.large"
  num_cache_clusters            = 2
  parameter_group_name          = "default.redis7"
  port                          = 6379
  subnet_group_name             = aws_elasticache_subnet_group.redis_subnets.name
  security_group_ids            = [aws_security_group.redis_sg.id]
  transit_encryption_enabled    = true
  at_rest_encryption_enabled    = true
  kms_key_id                    = aws_kms_key.smriti_disha_key.arn
  automatic_failover_enabled    = true
}

# ── 5. Application Load Balancer with TLS 1.3 Policy ────────────────────────
resource "aws_lb" "api_alb" {
  name               = "smriti-api-alb-${var.environment}"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = aws_subnet.public[*].id

  drop_invalid_header_fields = true

  tags = {
    Name = "smriti-api-alb"
  }
}

resource "aws_lb_listener" "https_tls13" {
  load_balancer_arn = aws_lb.api_alb.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-TLS13-1-2-2021-06" # Enforces TLS 1.3 & modern ciphers
  certificate_arn   = var.acm_certificate_arn

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.fastapi_tg.arn
  }
}

variable "acm_certificate_arn" {
  type    = string
  default = "arn:aws:acm:ap-south-1:123456789012:certificate/smriti-ner-gov-in"
}

resource "aws_lb_target_group" "fastapi_tg" {
  name        = "smriti-fastapi-tg"
  port        = 8000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.smriti_vpc.id
  target_type = "ip"

  health_check {
    path                = "/health"
    protocol            = "HTTP"
    matcher             = "200"
    interval            = 15
    timeout             = 5
    healthy_threshold   = 2
    unhealthy_threshold = 3
  }
}

# ── 6. Security Groups ──────────────────────────────────────────────────────
resource "aws_security_group" "alb_sg" {
  name        = "smriti-alb-sg"
  description = "Allow inbound HTTPS from edge and public internet"
  vpc_id      = aws_vpc.smriti_vpc.id

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "app_sg" {
  name        = "smriti-app-sg"
  description = "Allow traffic from ALB to FastAPI containers"
  vpc_id      = aws_vpc.smriti_vpc.id

  ingress {
    from_port       = 8000
    to_port         = 8000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "db_sg" {
  name        = "smriti-db-sg"
  description = "Allow inbound PostgreSQL from application private subnets only"
  vpc_id      = aws_vpc.smriti_vpc.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.app_sg.id]
  }
}

resource "aws_security_group" "redis_sg" {
  name        = "smriti-redis-sg"
  description = "Allow Redis from application private subnets only"
  vpc_id      = aws_vpc.smriti_vpc.id

  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.app_sg.id]
  }
}
