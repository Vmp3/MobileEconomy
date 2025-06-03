package controllers

import (
	"strconv"

	"github.com/Vicente/Password-Mobile-App/backend/app/services"
	"github.com/Vicente/Password-Mobile-App/backend/app/types"
	"github.com/gofiber/fiber/v2"
)

type LimiteController struct {
	limiteService *services.LimiteService
}

func NewLimiteController(limiteService *services.LimiteService) *LimiteController {
	return &LimiteController{limiteService: limiteService}
}

// POST /api/limite
func (c *LimiteController) CreateLimite(ctx *fiber.Ctx) error {
	userID := ctx.Locals("userID").(uint)

	var req types.CreateLimiteRequest
	if err := ctx.BodyParser(&req); err != nil {
		return ctx.Status(400).JSON(fiber.Map{"error": "Dados inválidos"})
	}

	if req.Valor <= 0 {
		return ctx.Status(400).JSON(fiber.Map{"error": "O valor deve ser maior que zero"})
	}

	if req.MesReferencia == "" {
		return ctx.Status(400).JSON(fiber.Map{"error": "Mês de referência é obrigatório"})
	}

	limite, err := c.limiteService.CreateLimite(userID, &req)
	if err != nil {
		return ctx.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	return ctx.Status(201).JSON(limite)
}

// GET /api/limite/mes/:mesReferencia
func (c *LimiteController) GetLimiteByMonth(ctx *fiber.Ctx) error {
	userID := ctx.Locals("userID").(uint)
	mesReferencia := ctx.Params("mesReferencia")

	if mesReferencia == "" {
		return ctx.Status(400).JSON(fiber.Map{"error": "Mês de referência é obrigatório"})
	}

	limite, err := c.limiteService.GetLimiteByMonth(userID, mesReferencia)
	if err != nil {
		if err.Error() == "limite não encontrado para este mês" {
			return ctx.Status(204).JSON(fiber.Map{"message": "Nenhum limite encontrado para este mês"})
		}
		return ctx.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	return ctx.JSON(limite)
}

// GET /api/limites
func (c *LimiteController) GetLimitesByUser(ctx *fiber.Ctx) error {
	userID := ctx.Locals("userID").(uint)

	limites, err := c.limiteService.GetLimitesByUser(userID)
	if err != nil {
		return ctx.Status(500).JSON(fiber.Map{"error": "Erro interno do servidor"})
	}

	if len(limites) == 0 {
		return ctx.Status(204).JSON(fiber.Map{"message": "Nenhum limite encontrado"})
	}

	return ctx.JSON(limites)
}

// PUT /api/limite/:id
func (c *LimiteController) UpdateLimite(ctx *fiber.Ctx) error {
	userID := ctx.Locals("userID").(uint)

	idParam := ctx.Params("id")
	limiteID, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		return ctx.Status(400).JSON(fiber.Map{"error": "ID inválido"})
	}

	var req types.UpdateLimiteRequest
	if err := ctx.BodyParser(&req); err != nil {
		return ctx.Status(400).JSON(fiber.Map{"error": "Dados inválidos"})
	}

	if req.Valor <= 0 {
		return ctx.Status(400).JSON(fiber.Map{"error": "O valor deve ser maior que zero"})
	}

	limite, err := c.limiteService.UpdateLimite(userID, uint(limiteID), &req)
	if err != nil {
		return ctx.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	return ctx.Status(200).JSON(fiber.Map{
		"message": "Limite atualizado com sucesso",
		"data": limite,
	})
}

// DELETE /api/limite/:id
func (c *LimiteController) DeleteLimite(ctx *fiber.Ctx) error {
	userID := ctx.Locals("userID").(uint)

	idParam := ctx.Params("id")
	limiteID, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		return ctx.Status(400).JSON(fiber.Map{"error": "ID inválido"})
	}

	if err := c.limiteService.DeleteLimite(userID, uint(limiteID)); err != nil {
		return ctx.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	return ctx.Status(200).JSON(fiber.Map{"message": "Limite excluído com sucesso"})
} 