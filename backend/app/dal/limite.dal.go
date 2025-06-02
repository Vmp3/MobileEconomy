package dal

import (
	"time"

	"github.com/Vicente/Password-Mobile-App/backend/app/types"
	"gorm.io/gorm"
)

type LimiteDAL struct {
	db *gorm.DB
}

func NewLimiteDAL(db *gorm.DB) *LimiteDAL {
	return &LimiteDAL{db: db}
}

func (l *LimiteDAL) CreateLimite(limite *types.Limite) error {
	return l.db.Create(limite).Error
}

func (l *LimiteDAL) GetLimiteByUserAndMonth(userID uint, mesReferencia time.Time) (*types.Limite, error) {
	var limite types.Limite
	
	firstDay := time.Date(mesReferencia.Year(), mesReferencia.Month(), 1, 0, 0, 0, 0, time.UTC)
	
	err := l.db.Where("user_id = ? AND mes_referencia = ?", userID, firstDay).First(&limite).Error
	if err != nil {
		return nil, err
	}
	return &limite, nil
}

func (l *LimiteDAL) GetLimitesByUser(userID uint) ([]types.Limite, error) {
	var limites []types.Limite
	err := l.db.Where("user_id = ?", userID).Order("mes_referencia DESC").Find(&limites).Error
	return limites, err
}

func (l *LimiteDAL) GetLimiteByID(id uint, userID uint) (*types.Limite, error) {
	var limite types.Limite
	err := l.db.Where("id = ? AND user_id = ?", id, userID).First(&limite).Error
	if err != nil {
		return nil, err
	}
	return &limite, nil
}

func (l *LimiteDAL) UpdateLimite(limite *types.Limite) error {
	return l.db.Save(limite).Error
}

func (l *LimiteDAL) DeleteLimite(id uint, userID uint) error {
	return l.db.Where("id = ? AND user_id = ?", id, userID).Delete(&types.Limite{}).Error
}

func (l *LimiteDAL) ExistsLimiteForMonth(userID uint, mesReferencia time.Time) (bool, error) {
	var count int64
	
	firstDay := time.Date(mesReferencia.Year(), mesReferencia.Month(), 1, 0, 0, 0, 0, time.UTC)
	
	err := l.db.Model(&types.Limite{}).Where("user_id = ? AND mes_referencia = ?", userID, firstDay).Count(&count).Error
	return count > 0, err
} 