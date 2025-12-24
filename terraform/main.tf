provider "aws" {
  region = "us-east-1"
}

variable "my_ip" {
  description = "Public IP allowed for SSH"
  type        = string
}

# 1. Create the Security Group
resource "aws_security_group" "potato_sg" {
  name        = "potato_leaf_sg--"
  description = "Allow SSH and React port"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.my_ip] 
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
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

# 2. Create the EC2 Instance
resource "aws_instance" "potato_server" {
  ami           = "ami-053b0d53c279acc90" 
  instance_type = "t3.micro"             
  key_name      = "len_den_club_2.0"    

  security_groups = [aws_security_group.potato_sg.name]

  # FIX: Required for security scans
  metadata_options {
    http_tokens = "required"
  }

  root_block_device {
    volume_size = 20
    volume_type = "gp3"
    encrypted   = true # FIX: Required for security scans
  }

  tags = {
    Name = "PotatoLeaf-Frontend-Server"
  }

  user_data = <<-EOF
              #!/bin/bash
              sudo apt-get update -y
              sudo apt-get install -y docker.io
              sudo systemctl start docker
              sudo systemctl enable docker
              sudo usermod -aG docker ubuntu
              sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
              sudo chmod +x /usr/local/bin/docker-compose
              EOF
}

output "public_ip" {
  value = aws_instance.potato_server.public_ip
}
