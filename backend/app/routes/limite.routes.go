package routes

import (
	"github.com/Vicente/Password-Mobile-App/backend/app/controllers"
	"github.com/Vicente/Password-Mobile-App/backend/app/middleware"
	"github.com/gofiber/fiber/v2"
)

func SetupLimiteRoutes(app *fiber.App, limiteController *controllers.LimiteController) {
	limiteRoutes := app.Group("/api")

	limiteRoutes.Use(middleware.AuthMiddleware())

	limiteRoutes.Post("/limite", limiteController.CreateLimite)
	limiteRoutes.Get("/limite/mes/:mesReferencia", limiteController.GetLimiteByMonth)
	limiteRoutes.Get("/limites", limiteController.GetLimitesByUser)
	limiteRoutes.Put("/limite/:id", limiteController.UpdateLimite)
	limiteRoutes.Delete("/limite/:id", limiteController.DeleteLimite)
} 