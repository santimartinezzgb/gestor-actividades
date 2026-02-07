# Script de inicio bonito para Linux

clear
echo "=================================="
echo "  Iniciando Aplicación en  Linux  "
echo "=================================="
echo ""
echo "Recuerda que el backend (Spring Boot) debe estar en ejecución."
echo "Puedes iniciarlo en otra terminal con:"
echo "cd ../backend-gestor-actividades && ./mvnw spring-boot:run"
echo ""

export ELECTRON_DISABLE_SANDBOX=1
npm run electron


