# HTTPS Setup Guide for Stock App Production Environment

## Required AWS Permissions

### ACM Certificate Management
The following IAM policy is required for managing SSL certificates:
```json
{
    "Version": "2012-10-17",
    "Statement": [{
        "Effect": "Allow",
        "Action": [
            "acm:ImportCertificate",
            "acm:RequestCertificate",
            "acm:AddTagsToCertificate",
            "acm:DescribeCertificate",
            "acm:ListCertificates"
        ],
        "Resource": "*"
    }]
}
```

### Load Balancer Management
Additional permissions needed for configuring the load balancer:
```json
{
    "Version": "2012-10-17",
    "Statement": [{
        "Effect": "Allow",
        "Action": [
            "elasticloadbalancing:ModifyListener",
            "elasticloadbalancing:AddListenerCertificates",
            "elasticloadbalancing:DescribeLoadBalancers",
            "elasticloadbalancing:DescribeListeners"
        ],
        "Resource": [
            "arn:aws:elasticloadbalancing:us-east-2:*:loadbalancer/app/stockapp-lb/*",
            "arn:aws:elasticloadbalancing:us-east-2:*:listener/app/stockapp-lb/*"
        ]
    }]
}
```

## HTTPS Setup Steps for Application Load Balancer

1. Request SSL Certificate:
```bash
# Request a public certificate for your domain
aws acm request-certificate \
    --domain-name stockapp-lb-1859686354.us-east-2.elb.amazonaws.com \
    --validation-method DNS \
    --region us-east-2
```

2. Configure Load Balancer Listener:
```bash
# Add HTTPS listener (after certificate is validated)
aws elbv2 create-listener \
    --load-balancer-arn <load-balancer-arn> \
    --protocol HTTPS \
    --port 443 \
    --certificates CertificateArn=<certificate-arn> \
    --default-actions Type=forward,TargetGroupArn=<target-group-arn>
```

3. Modify existing HTTP listener (optional redirect):
```bash
# Redirect HTTP to HTTPS
aws elbv2 modify-listener \
    --listener-arn <http-listener-arn> \
    --port 80 \
    --protocol HTTP \
    --default-actions Type=redirect,RedirectConfig={Protocol=HTTPS,Port=443,StatusCode=HTTP_301}
```

## Security Group Configuration

Update the security group (ID: sg-09df63d880f04c0c2) to allow HTTPS traffic:

```bash
# Add HTTPS inbound rule
aws ec2 authorize-security-group-ingress \
    --group-id sg-09df63d880f04c0c2 \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0

# Verify security group rules
aws ec2 describe-security-groups \
    --group-ids sg-09df63d880f04c0c2
```

## Important Notes

1. Certificate Validation:
   - DNS validation is recommended for automated renewal
   - Allow up to 30 minutes for DNS validation to complete

2. Load Balancer Configuration:
   - Keep HTTP listener (port 80) active for health checks
   - Configure redirect from HTTP to HTTPS for security

3. Security Considerations:
   - Restrict security group access as needed
   - Regular certificate rotation recommended
   - Monitor certificate expiration dates

4. Monitoring:
   - Set up CloudWatch alarms for certificate expiration
   - Monitor HTTPS listener health metrics
   - Configure logging for security analysis
