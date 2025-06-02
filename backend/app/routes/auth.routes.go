package routes

import (
	"github.com/Vicente/Password-Mobile-App/backend/app/controllers"
	"github.com/gofiber/fiber/v2"
)

func SetupAuthRoutes(app *fiber.App, authController *controllers.AuthController) {
	authRoutes := app.Group("/api/auth")

	authRoutes.Post("/signup", authController.Signup)
	authRoutes.Post("/signin", authController.Login)
}
