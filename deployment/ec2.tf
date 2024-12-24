resource "aws_key_pair" "gestion_hotel_key" {
  key_name   = "gestion_hotel_key"
  public_key = file("../gestion_hotel_key.pub")  # Ruta al archivo de clave pública generada
}

# Crear una instancia EC2
resource "aws_instance" "ec2_gestion_hotel" {
  ami           = "ami-0b4624933067d393a" # Cambia por una AMI válida en tu región
  instance_type = "t2.micro" 
  
  subnet_id = aws_subnet.public_a.id

  vpc_security_group_ids = [aws_security_group.security_group_example_app.id]

  # Asociar la clave SSH a la instancia
  key_name = aws_key_pair.gestion_hotel_key.key_name
  
  associate_public_ip_address = true

  # Etiquetas para organizar recursos
  tags = {
    Name = "Gestion-Hotel"
  }

  user_data = <<-EOF
                #!/bin/bash
                # Actualizar paquetes existentes
                sudo yum update -y
                
                # Instalar Git y Node.js
                sudo yum install -y git
                sudo yum install -y nodejs
                cd ~
                # Clonar el repositorio
                git clone https://github.com/PaulHuaman696/Examen_Final_Gestion-Hotel.git
                cd ./Examen_Final_Gestion-Hotel/

                git pull
                
                # Instalar dependencias del proyecto
                npm install
                
                # Iniciar el servidor
                node server.js
                EOF
}