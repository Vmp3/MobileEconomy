package services

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/Vicente/Password-Mobile-App/backend/app/dal"
	"github.com/Vicente/Password-Mobile-App/backend/app/types"
	"gorm.io/gorm"
)

type LimiteService struct {
	limiteDAL *dal.LimiteDAL
}

func NewLimiteService(limiteDAL *dal.LimiteDAL) *LimiteService {
	return &LimiteService{limiteDAL: limiteDAL}
}

func parseMonthYear(monthYear string) (time.Time, error) {
	parts := strings.Split(monthYear, "-")
	if len(parts) != 2 {
		return time.Time{}, errors.New("formato de mês inválido. Use YYYY-MM")
	}

	year, err := strconv.Atoi(parts[0])
	if err != nil {
		return time.Time{}, errors.New("ano inválido")
	}

	month, err := strconv.Atoi(parts[1])
	if err != nil {
		return time.Time{}, errors.New("mês inválido")
	}

	if month < 1 || month > 12 {
		return time.Time{}, errors.New("mês deve estar entre 1 e 12")
	}

	return time.Date(year, time.Month(month), 1, 0, 0, 0, 0, time.UTC), nil
}

func formatMonthYear(t time.Time) string {
	return fmt.Sprintf("%04d-%02d", t.Year(), int(t.Month()))
}

func isBeforeCurrentMonth(mesReferencia time.Time) bool {
	now := time.Now().UTC()
	currentMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, time.UTC)
	return mesReferencia.Before(currentMonth)
}

func (s *LimiteService) CreateLimite(userID uint, req *types.CreateLimiteRequest) (*types.LimiteSimpleResponse, error) {
	mesReferencia, err := parseMonthYear(req.MesReferencia)
	if err != nil {
		return nil, err
	}

	if isBeforeCurrentMonth(mesReferencia) {
		return nil, errors.New("não é possível criar limite para meses anteriores ao mês corrente")
	}

	exists, err := s.limiteDAL.ExistsLimiteForMonth(userID, mesReferencia)
	if err != nil {
		return nil, err
	}
	if exists {
		return nil, errors.New("já existe um limite criado para este mês")
	}

	limite := &types.Limite{
		Valor:         req.Valor,
		MesReferencia: mesReferencia,
		UserID:        userID,
	}

	if err := s.limiteDAL.CreateLimite(limite); err != nil {
		return nil, err
	}

	return &types.LimiteSimpleResponse{
		ID:            limite.ID,
		Valor:         limite.Valor,
		MesReferencia: formatMonthYear(limite.MesReferencia),
	}, nil
}

func (s *LimiteService) GetLimiteByMonth(userID uint, monthYear string) (*types.LimiteSimpleResponse, error) {
	mesReferencia, err := parseMonthYear(monthYear)
	if err != nil {
		return nil, err
	}

	limite, err := s.limiteDAL.GetLimiteByUserAndMonth(userID, mesReferencia)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("limite não encontrado para este mês")
		}
		return nil, err
	}

	return &types.LimiteSimpleResponse{
		ID:            limite.ID,
		Valor:         limite.Valor,
		MesReferencia: formatMonthYear(limite.MesReferencia),
	}, nil
}

func (s *LimiteService) GetLimitesByUser(userID uint) ([]types.LimiteSimpleResponse, error) {
	limites, err := s.limiteDAL.GetLimitesByUser(userID)
	if err != nil {
		return nil, err
	}

	var response []types.LimiteSimpleResponse
	for _, limite := range limites {
		response = append(response, types.LimiteSimpleResponse{
			ID:            limite.ID,
			Valor:         limite.Valor,
			MesReferencia: formatMonthYear(limite.MesReferencia),
		})
	}

	return response, nil
}

func (s *LimiteService) UpdateLimite(userID uint, limiteID uint, req *types.UpdateLimiteRequest) (*types.LimiteSimpleResponse, error) {
	limite, err := s.limiteDAL.GetLimiteByID(limiteID, userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("limite não encontrado")
		}
		return nil, err
	}

	if isBeforeCurrentMonth(limite.MesReferencia) {
		return nil, errors.New("não é possível editar limite de meses anteriores ao mês corrente")
	}

	limite.Valor = req.Valor

	if err := s.limiteDAL.UpdateLimite(limite); err != nil {
		return nil, err
	}

	return &types.LimiteSimpleResponse{
		ID:            limite.ID,
		Valor:         limite.Valor,
		MesReferencia: formatMonthYear(limite.MesReferencia),
	}, nil
}

func (s *LimiteService) DeleteLimite(userID uint, limiteID uint) error {
	limite, err := s.limiteDAL.GetLimiteByID(limiteID, userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("limite não encontrado")
		}
		return err
	}

	if isBeforeCurrentMonth(limite.MesReferencia) {
		return errors.New("não é possível excluir limite de meses anteriores ao mês corrente")
	}

	return s.limiteDAL.DeleteLimite(limiteID, userID)
} 