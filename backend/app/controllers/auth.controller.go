package controllers

import (
	"net/mail"
	"strings"
	"time"

	"github.com/Vicente/Password-Mobile-App/backend/app/services"
	"github.com/Vicente/Password-Mobile-App/backend/app/types"
	"github.com/gofiber/fiber/v2"
)

type AuthController struct {
	AuthService *services.AuthService
}

func NewAuthController(authService *services.AuthService) *AuthController {
	return &AuthController{
		AuthService: authService,
	}
}

func (c *AuthController) validateEmail(email string) error {
	email = strings.TrimSpace(strings.ToLower(email))
	if email == "" {
		return fiber.NewError(fiber.StatusBadRequest, "email é obrigatório")
	}

	if _, err := mail.ParseAddress(email); err != nil {
		return fiber.NewError(fiber.StatusBadRequest, "formato de email inválido")
	}

	if !strings.Contains(email, "@") || !strings.Contains(email, ".") {
		return fiber.NewError(fiber.StatusBadRequest, "email deve conter @ e domínio válido")
	}

	if strings.HasPrefix(email, ".") || strings.HasSuffix(email, ".") ||
		strings.HasPrefix(email, "@") || strings.HasSuffix(email, "@") {
		return fiber.NewError(fiber.StatusBadRequest, "formato de email inválido")
	}

	return nil
}

func (c *AuthController) validateBirthDate(birthDate types.Date) error {
	today := time.Now()
	if birthDate.Time.After(today) {
		return fiber.NewError(fiber.StatusBadRequest, "data de nascimento deve ser anterior à data atual")
	}
	return nil
}

func (c *AuthController) Signup(ctx *fiber.Ctx) error {
	var req types.SignupRequest

	if err := ctx.BodyParser(&req); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Dados inválidos: " + err.Error(),
		})
	}

	if err := c.validateEmail(req.Email); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	if err := c.validateBirthDate(req.DataNascimento); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	_, err := c.AuthService.Signup(&req)
	if err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return ctx.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Usuário criado com sucesso",
	})
}

func (c *AuthController) Login(ctx *fiber.Ctx) error {
	var req types.LoginRequest

	if err := ctx.BodyParser(&req); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Dados inválidos: " + err.Error(),
		})
	}

	if err := c.validateEmail(req.Email); err != nil {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	response, err := c.AuthService.Login(&req)
	if err != nil {
		return ctx.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": err.Error(),
		})
	}

	return ctx.Status(fiber.StatusOK).JSON(fiber.Map{
		"token": response.Token,
	})
}
