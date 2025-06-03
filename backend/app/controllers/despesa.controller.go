package controllers

import (
	"strconv"

	"github.com/Vicente/Password-Mobile-App/backend/app/services"
	"github.com/Vicente/Password-Mobile-App/backend/app/types"
	"github.com/gofiber/fiber/v2"
)

type DespesaController struct {
	despesaService *services.DespesaService
}

func NewDespesaController(despesaService *services.DespesaService) *DespesaController {
	return &DespesaController{despesaService: despesaService}
}

// POST /api/despesa
func (c *DespesaController) CreateDespesa(ctx *fiber.Ctx) error {
	userID := ctx.Locals("userID").(uint)

	var req types.CreateDespesaRequest
	if err := ctx.BodyParser(&req); err != nil {
		return ctx.Status(400).JSON(fiber.Map{"error": "Dados inválidos"})
	}

	if req.Descricao == "" {
		return ctx.Status(400).JSON(fiber.Map{"error": "Descrição é obrigatória"})
	}

	if req.Valor <= 0 {
		return ctx.Status(400).JSON(fiber.Map{"error": "O valor deve ser maior que zero"})
	}

	if req.MesReferencia == "" {
		return ctx.Status(400).JSON(fiber.Map{"error": "Mês de referência é obrigatório"})
	}

	despesa, err := c.despesaService.CreateDespesa(userID, &req)
	if err != nil {
		return ctx.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	return ctx.Status(201).JSON(despesa)
}

// GET /api/despesa/mes/:mesReferencia
func (c *DespesaController) GetDespesasByMonth(ctx *fiber.Ctx) error {
	userID := ctx.Locals("userID").(uint)
	mesReferencia := ctx.Params("mesReferencia")

	if mesReferencia == "" {
		return ctx.Status(400).JSON(fiber.Map{"error": "Mês de referência é obrigatório"})
	}

	despesas, err := c.despesaService.GetDespesasByMonth(userID, mesReferencia)
	if err != nil {
		return ctx.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	if len(despesas) == 0 {
		return ctx.Status(204).JSON(fiber.Map{"message": "Nenhuma despesa encontrada para este mês"})
	}

	return ctx.JSON(despesas)
}

// GET /api/despesas
func (c *DespesaController) GetDespesasByUser(ctx *fiber.Ctx) error {
	userID := ctx.Locals("userID").(uint)

	despesas, err := c.despesaService.GetDespesasByUser(userID)
	if err != nil {
		return ctx.Status(500).JSON(fiber.Map{"error": "Erro interno do servidor"})
	}

	if len(despesas) == 0 {
		return ctx.Status(204).JSON(fiber.Map{"message": "Nenhuma despesa encontrada"})
	}

	return ctx.JSON(despesas)
}

// PUT /api/despesa/:id
func (c *DespesaController) UpdateDespesa(ctx *fiber.Ctx) error {
	userID := ctx.Locals("userID").(uint)

	idParam := ctx.Params("id")
	despesaID, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		return ctx.Status(400).JSON(fiber.Map{"error": "ID inválido"})
	}

	var req types.UpdateDespesaRequest
	if err := ctx.BodyParser(&req); err != nil {
		return ctx.Status(400).JSON(fiber.Map{"error": "Dados inválidos"})
	}

	if req.Descricao == "" {
		return ctx.Status(400).JSON(fiber.Map{"error": "Descrição é obrigatória"})
	}

	if req.Valor <= 0 {
		return ctx.Status(400).JSON(fiber.Map{"error": "O valor deve ser maior que zero"})
	}

	despesa, err := c.despesaService.UpdateDespesa(userID, uint(despesaID), &req)
	if err != nil {
		return ctx.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	return ctx.Status(200).JSON(fiber.Map{
		"message": "Despesa atualizada com sucesso",
		"data": despesa,
	})
}

// DELETE /api/despesa/:id
func (c *DespesaController) DeleteDespesa(ctx *fiber.Ctx) error {
	userID := ctx.Locals("userID").(uint)

	idParam := ctx.Params("id")
	despesaID, err := strconv.ParseUint(idParam, 10, 32)
	if err != nil {
		return ctx.Status(400).JSON(fiber.Map{"error": "ID inválido"})
	}

	if err := c.despesaService.DeleteDespesa(userID, uint(despesaID)); err != nil {
		return ctx.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	return ctx.Status(200).JSON(fiber.Map{"message": "Despesa excluída com sucesso"})
} 