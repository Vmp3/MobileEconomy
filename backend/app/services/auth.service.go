package services

import (
	"errors"
	"net/mail"
	"os"
	"strings"
	"time"

	"github.com/Vicente/Password-Mobile-App/backend/app/dal"
	"github.com/Vicente/Password-Mobile-App/backend/app/types"
	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

var (
	jwtSecret = os.Getenv("JWT_SECRET")
	jwtExpiry = 24 * time.Hour
)

type AuthService struct {
	AuthDAL *dal.AuthDAL
}

func NewAuthService(authDAL *dal.AuthDAL) *AuthService {
	return &AuthService{
		AuthDAL: authDAL,
	}
}

func (s *AuthService) Signup(req *types.SignupRequest) (*types.User, error) {
	email := strings.TrimSpace(req.Email)
	if email == "" {
		return nil, errors.New("email é obrigatório")
	}

	if _, err := mail.ParseAddress(email); err != nil {
		return nil, errors.New("formato de email inválido")
	}

	if !strings.Contains(email, "@") || !strings.Contains(email, ".") {
		return nil, errors.New("email deve conter @ e domínio válido")
	}

	if strings.HasPrefix(email, ".") || strings.HasSuffix(email, ".") ||
		strings.HasPrefix(email, "@") || strings.HasSuffix(email, "@") {
		return nil, errors.New("formato de email inválido")
	}

	email = strings.ToLower(email)

	if len(strings.TrimSpace(req.Nome)) == 0 {
		return nil, errors.New("nome é obrigatório")
	}

	senha := strings.TrimSpace(req.Senha)
	if len(senha) < 6 {
		return nil, errors.New("a senha deve ter pelo menos 6 caracteres")
	}

	confirmacaoSenha := strings.TrimSpace(req.ConfirmacaoSenha)
	if senha != confirmacaoSenha {
		return nil, errors.New("as senhas não coincidem")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(senha), bcrypt.DefaultCost)
	if err != nil {
		return nil, errors.New("erro ao processar senha")
	}

	user := &types.User{
		Nome:           strings.TrimSpace(req.Nome),
		DataNascimento: req.DataNascimento,
		Email:          email,
		SenhaHash:      string(hashedPassword),
	}

	if err := s.AuthDAL.CreateUser(user); err != nil {
		return nil, err
	}

	user.Senha = ""

	return user, nil
}

func (s *AuthService) Login(req *types.LoginRequest) (*types.AuthResponse, error) {
	email := strings.TrimSpace(strings.ToLower(req.Email))
	if email == "" {
		return nil, errors.New("email é obrigatório")
	}

	if _, err := mail.ParseAddress(email); err != nil {
		return nil, errors.New("formato de email inválido")
	}

	user, err := s.AuthDAL.GetUserByEmail(email)
	if err != nil {
		return nil, errors.New("email ou senha inválidos")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.SenhaHash), []byte(req.Senha)); err != nil {
		return nil, errors.New("email ou senha inválidos")
	}

	token, err := s.generateJWT(user)
	if err != nil {
		return nil, errors.New("erro ao gerar token de autenticação")
	}

	user.Senha = ""

	return &types.AuthResponse{
		Token: token,
		User:  *user,
	}, nil
}

func (s *AuthService) generateJWT(user *types.User) (string, error) {
	claims := jwt.MapClaims{
		"id":    user.ID,
		"email": user.Email,
		"exp":   time.Now().Add(jwtExpiry).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	return token.SignedString([]byte(jwtSecret))
}
