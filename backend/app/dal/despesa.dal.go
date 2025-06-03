package dal

import (
	"time"

	"github.com/Vicente/Password-Mobile-App/backend/app/types"
	"gorm.io/gorm"
)

type DespesaDAL struct {
	db *gorm.DB
}

func NewDespesaDAL(db *gorm.DB) *DespesaDAL {
	return &DespesaDAL{db: db}
}

func (d *DespesaDAL) CreateDespesa(despesa *types.Despesa) error {
	return d.db.Create(despesa).Error
}

func (d *DespesaDAL) GetDespesasByUserAndMonth(userID uint, mesReferencia time.Time) ([]types.Despesa, error) {
	var despesas []types.Despesa
	
	firstDay := time.Date(mesReferencia.Year(), mesReferencia.Month(), 1, 0, 0, 0, 0, time.UTC)
	lastDay := firstDay.AddDate(0, 1, -1)
	
	err := d.db.Where("user_id = ? AND mes_referencia >= ? AND mes_referencia <= ?", userID, firstDay, lastDay).Find(&despesas).Error
	return despesas, err
}

func (d *DespesaDAL) GetDespesasByUser(userID uint) ([]types.Despesa, error) {
	var despesas []types.Despesa
	err := d.db.Where("user_id = ?", userID).Order("mes_referencia DESC").Find(&despesas).Error
	return despesas, err
}

func (d *DespesaDAL) GetDespesaByID(id uint, userID uint) (*types.Despesa, error) {
	var despesa types.Despesa
	err := d.db.Where("id = ? AND user_id = ?", id, userID).First(&despesa).Error
	if err != nil {
		return nil, err
	}
	return &despesa, nil
}

func (d *DespesaDAL) UpdateDespesa(despesa *types.Despesa) error {
	return d.db.Save(despesa).Error
}

func (d *DespesaDAL) DeleteDespesa(id uint, userID uint) error {
	return d.db.Where("id = ? AND user_id = ?", id, userID).Delete(&types.Despesa{}).Error
} 