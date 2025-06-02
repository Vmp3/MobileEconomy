package main

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"log"
	"os"

	"github.com/Vicente/Password-Mobile-App/backend/app/controllers"
	"github.com/Vicente/Password-Mobile-App/backend/app/dal"
	"github.com/Vicente/Password-Mobile-App/backend/app/routes"
	"github.com/Vicente/Password-Mobile-App/backend/app/services"
	"github.com/Vicente/Password-Mobile-App/backend/app/types"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/joho/godotenv"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func generateRandomSecret() string {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		log.Fatalf("Falha ao gerar JWT_SECRET: %v", err)
	}
	return hex.EncodeToString(bytes)
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("Arquivo .env não encontrado, usando variáveis de ambiente do sistema")
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		log.Println("JWT_SECRET não encontrado, gerando automaticamente...")
		jwtSecret = generateRandomSecret()
		os.Setenv("JWT_SECRET", jwtSecret)
		log.Printf("JWT_SECRET gerado automaticamente: %s", jwtSecret)
	} else {
		log.Println("Usando JWT_SECRET fornecido")
	}

	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "host=localhost user=postgres password=postgres dbname=financial_app port=5432 sslmode=disable"
	}

	db, err := gorm.Open(postgres.Open(dbURL), &gorm.Config{})
	if err != nil {
		log.Fatalf("Falha ao conectar ao banco de dados: %v", err)
	}

	if err := db.AutoMigrate(&types.User{}, &types.Limite{}); err != nil {
		log.Fatalf("Falha ao migrar modelos: %v", err)
	}

	authDAL := dal.NewAuthDAL(db)
	authService := services.NewAuthService(authDAL)
	authController := controllers.NewAuthController(authService)

	limiteDAL := dal.NewLimiteDAL(db)
	limiteService := services.NewLimiteService(limiteDAL)
	limiteController := controllers.NewLimiteController(limiteService)

	app := fiber.New()

	app.Use(cors.New(cors.Config{
		AllowOrigins:     "*",
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH",
		AllowHeaders:     "Origin,Content-Type,Accept,Authorization",
		AllowCredentials: false,
	}))

	routes.SetupAuthRoutes(app, authController)
	routes.SetupLimiteRoutes(app, limiteController)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("Servidor iniciado na porta %s\n", port)
	if err := app.Listen(":" + port); err != nil {
		log.Fatalf("Falha ao iniciar o servidor: %v", err)
	}
}
