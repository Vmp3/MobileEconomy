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

type DespesaService struct {
	despesaDAL *dal.DespesaDAL
}

func NewDespesaService(despesaDAL *dal.DespesaDAL) *DespesaService {
	return &DespesaService{despesaDAL: despesaDAL}
}

func parseMonthYearDespesa(monthYear string) (time.Time, error) {
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

func formatMonthYearDespesa(t time.Time) string {
	return fmt.Sprintf("%04d-%02d", t.Year(), int(t.Month()))
}

func isBeforeCurrentMonthDespesa(mesReferencia time.Time) bool {
	now := time.Now().UTC()
	currentMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, time.UTC)
	return mesReferencia.Before(currentMonth)
}

func (s *DespesaService) CreateDespesa(userID uint, req *types.CreateDespesaRequest) (*types.DespesaSimpleResponse, error) {
	mesReferencia, err := parseMonthYearDespesa(req.MesReferencia)
	if err != nil {
		return nil, err
	}

	if isBeforeCurrentMonthDespesa(mesReferencia) {
		return nil, errors.New("não é possível criar despesa para meses anteriores ao mês corrente")
	}

	despesa := &types.Despesa{
		Descricao:     req.Descricao,
		Valor:         req.Valor,
		MesReferencia: mesReferencia,
		UserID:        userID,
	}

	if err := s.despesaDAL.CreateDespesa(despesa); err != nil {
		return nil, err
	}

	return &types.DespesaSimpleResponse{
		Descricao:     despesa.Descricao,
		Valor:         despesa.Valor,
		MesReferencia: formatMonthYearDespesa(despesa.MesReferencia),
	}, nil
}

func (s *DespesaService) GetDespesasByMonth(userID uint, monthYear string) ([]types.DespesaSimpleResponse, error) {
	mesReferencia, err := parseMonthYearDespesa(monthYear)
	if err != nil {
		return nil, err
	}

	despesas, err := s.despesaDAL.GetDespesasByUserAndMonth(userID, mesReferencia)
	if err != nil {
		return nil, err
	}

	var response []types.DespesaSimpleResponse
	for _, despesa := range despesas {
		response = append(response, types.DespesaSimpleResponse{
			Descricao:     despesa.Descricao,
			Valor:         despesa.Valor,
			MesReferencia: formatMonthYearDespesa(despesa.MesReferencia),
		})
	}

	return response, nil
}

func (s *DespesaService) GetDespesasByUser(userID uint) ([]types.DespesaSimpleResponse, error) {
	despesas, err := s.despesaDAL.GetDespesasByUser(userID)
	if err != nil {
		return nil, err
	}

	var response []types.DespesaSimpleResponse
	for _, despesa := range despesas {
		response = append(response, types.DespesaSimpleResponse{
			Descricao:     despesa.Descricao,
			Valor:         despesa.Valor,
			MesReferencia: formatMonthYearDespesa(despesa.MesReferencia),
		})
	}

	return response, nil
}

func (s *DespesaService) UpdateDespesa(userID uint, despesaID uint, req *types.UpdateDespesaRequest) (*types.DespesaSimpleResponse, error) {
	despesa, err := s.despesaDAL.GetDespesaByID(despesaID, userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("despesa não encontrada")
		}
		return nil, err
	}

	if isBeforeCurrentMonthDespesa(despesa.MesReferencia) {
		return nil, errors.New("não é possível editar despesa de meses anteriores ao mês corrente")
	}

	despesa.Descricao = req.Descricao
	despesa.Valor = req.Valor

	if err := s.despesaDAL.UpdateDespesa(despesa); err != nil {
		return nil, err
	}

	return &types.DespesaSimpleResponse{
		Descricao:     despesa.Descricao,
		Valor:         despesa.Valor,
		MesReferencia: formatMonthYearDespesa(despesa.MesReferencia),
	}, nil
}

func (s *DespesaService) DeleteDespesa(userID uint, despesaID uint) error {
	despesa, err := s.despesaDAL.GetDespesaByID(despesaID, userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("despesa não encontrada")
		}
		return err
	}

	if isBeforeCurrentMonthDespesa(despesa.MesReferencia) {
		return errors.New("não é possível excluir despesa de meses anteriores ao mês corrente")
	}

	return s.despesaDAL.DeleteDespesa(despesaID, userID)
} 