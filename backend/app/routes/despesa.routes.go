package routes

import (
	"github.com/Vicente/Password-Mobile-App/backend/app/controllers"
	"github.com/Vicente/Password-Mobile-App/backend/app/middleware"
	"github.com/gofiber/fiber/v2"
)

func SetupDespesaRoutes(app *fiber.App, despesaController *controllers.DespesaController) {
	despesaRoutes := app.Group("/api")

	despesaRoutes.Use(middleware.AuthMiddleware())

	despesaRoutes.Post("/despesa", despesaController.CreateDespesa)
	despesaRoutes.Get("/despesa/mes/:mesReferencia", despesaController.GetDespesasByMonth)
	despesaRoutes.Get("/despesas", despesaController.GetDespesasByUser)
	despesaRoutes.Put("/despesa/:id", despesaController.UpdateDespesa)
	despesaRoutes.Delete("/despesa/:id", despesaController.DeleteDespesa)
} 