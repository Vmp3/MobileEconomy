package types

import (
	"time"
	"gorm.io/gorm"
)

type Limite struct {
	gorm.Model
	Valor         float64   `json:"valor" binding:"required,gt=0"`
	MesReferencia time.Time `json:"mesReferencia" binding:"required" gorm:"type:date"`
	UserID        uint      `json:"userId" gorm:"not null"`
	User          User      `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

type CreateLimiteRequest struct {
	Valor         float64 `json:"valor" binding:"required,gt=0"`
	MesReferencia string  `json:"mesReferencia" binding:"required"`
}

type UpdateLimiteRequest struct {
	Valor float64 `json:"valor" binding:"required,gt=0"`
}

type LimiteSimpleResponse struct {
	Valor         float64 `json:"valor"`
	MesReferencia string  `json:"mesReferencia"`
} 