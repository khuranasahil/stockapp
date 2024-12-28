terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-2"
}

# Use existing ECR Repository
data "aws_ecr_repository" "stockapp" {
  name = "stockapp"
}

# ECS Cluster
resource "aws_ecs_cluster" "stockapp" {
  name = "stockapp-cluster"
}

# Task Definition
resource "aws_ecs_task_definition" "stockapp" {
  family                   = "stockapp"
  requires_compatibilities = ["FARGATE"]
  network_mode            = "awsvpc"
  cpu                     = 512
  memory                  = 1024
  execution_role_arn      = aws_iam_role.ecs_execution_role.arn
  task_role_arn          = aws_iam_role.ecs_task_role.arn

  container_definitions = jsonencode([
    {
      name  = "stockapp"
      image = "${data.aws_ecr_repository.stockapp.repository_url}:latest"
      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
          protocol      = "tcp"
        }
      ]
      environment = [
        {
          name  = "SPRING_PROFILES_ACTIVE"
          value = "prod"
        },
        {
          name  = "MARKETSTACK_API_KEY"
          value = "83c8eb73c602dc78f07f9235123411b4"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/stockapp"
          "awslogs-region"        = "us-east-2"
          "awslogs-stream-prefix" = "ecs"
        }
      }
    }
  ])
}

# IAM Roles
resource "aws_iam_role" "ecs_execution_role" {
  name = "stockapp-ecs-execution-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role" "ecs_task_role" {
  name = "stockapp-ecs-task-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

# Use existing VPC and Subnets
data "aws_vpc" "main" {
  id = "vpc-0eb73178b493c167f"
}

data "aws_subnet" "public" {
  count = 2
  id    = count.index == 0 ? "subnet-08f66d7f6b459874e" : "subnet-00528677e6dd9610d"
}

resource "aws_security_group" "ecs_tasks" {
  name        = "stockapp-ecs-tasks"
  description = "Allow inbound traffic for ECS tasks"
  vpc_id      = data.aws_vpc.main.id

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

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

# Application Load Balancer
resource "aws_lb" "stockapp" {
  name               = "stockapp-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.ecs_tasks.id]
  subnets           = data.aws_subnet.public[*].id
}

resource "aws_lb_target_group" "stockapp" {
  name        = "stockapp-tg"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = data.aws_vpc.main.id
  target_type = "ip"

  health_check {
    path                = "/actuator/health"
    healthy_threshold   = 2
    unhealthy_threshold = 10
    interval            = 120
    timeout             = 60
    matcher             = "200"
    port                = "traffic-port"
    protocol            = "HTTP"
  }

  deregistration_delay = 300
}

resource "aws_lb_listener" "stockapp" {
  load_balancer_arn = aws_lb.stockapp.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.stockapp.arn
  }
}

# ECS Service
resource "aws_ecs_service" "stockapp" {
  name            = "stockapp-service"
  cluster         = aws_ecs_cluster.stockapp.id
  task_definition = aws_ecs_task_definition.stockapp.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = data.aws_subnet.public[*].id
    security_groups  = [aws_security_group.ecs_tasks.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.stockapp.arn
    container_name   = "stockapp"
    container_port   = 8080
  }
  
  health_check_grace_period_seconds = 600
}



# Output the ALB DNS name
output "alb_dns_name" {
  value = aws_lb.stockapp.dns_name
}
