package types

import (
	"time"
	"gorm.io/gorm"
)

type Despesa struct {
	gorm.Model
	Descricao     string    `json:"descricao" binding:"required"`
	Valor         float64   `json:"valor" binding:"required,gt=0"`
	MesReferencia time.Time `json:"mesReferencia" binding:"required" gorm:"type:date"`
	UserID        uint      `json:"userId" gorm:"not null"`
	User          User      `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

type CreateDespesaRequest struct {
	Descricao     string  `json:"descricao" binding:"required"`
	Valor         float64 `json:"valor" binding:"required,gt=0"`
	MesReferencia string  `json:"mesReferencia" binding:"required"`
}

type UpdateDespesaRequest struct {
	Descricao string  `json:"descricao" binding:"required"`
	Valor     float64 `json:"valor" binding:"required,gt=0"`
}

type DespesaSimpleResponse struct {
	ID            uint    `json:"id"`
	Descricao     string  `json:"descricao"`
	Valor         float64 `json:"valor"`
	MesReferencia string  `json:"mesReferencia"`
} 