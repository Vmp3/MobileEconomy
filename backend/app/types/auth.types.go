package types

import (
	"database/sql/driver"
	"fmt"
	"time"

	"gorm.io/gorm"
)

type Date struct {
	time.Time
}

func (d *Date) UnmarshalJSON(data []byte) error {
	str := string(data[1 : len(data)-1])

	formats := []string{
		"2006-01-02",
		"2006-01-02T15:04:05Z",
		"2006-01-02T15:04:05.000Z",
	}

	for _, format := range formats {
		if t, err := time.Parse(format, str); err == nil {
			d.Time = time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, time.UTC)
			return nil
		}
	}

	return fmt.Errorf("não foi possível analisar a data: %s", str)
}

func (d Date) MarshalJSON() ([]byte, error) {
	return []byte(`"` + d.Time.Format("2006-01-02") + `"`), nil
}

func (d Date) Value() (driver.Value, error) {
	return d.Time, nil
}
	
func (d *Date) Scan(value interface{}) error {
	if value == nil {
		d.Time = time.Time{}
		return nil
	}

	if t, ok := value.(time.Time); ok {
		d.Time = time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, time.UTC)
		return nil
	}

	return fmt.Errorf("não foi possível escanear %T em Date", value)
}

type User struct {
	gorm.Model
	Nome           string `json:"nome" binding:"required"`
	DataNascimento Date   `json:"dataNascimento" binding:"required"`
	Email          string `json:"email" binding:"required,email" gorm:"unique"`
	Senha          string `json:"senha" binding:"required" gorm:"-"`
	SenhaHash      string `json:"-"`
}

type SignupRequest struct {
	Nome             string `json:"nome" binding:"required"`
	DataNascimento   Date   `json:"dataNascimento" binding:"required"`
	Email            string `json:"email" binding:"required,email"`
	Senha            string `json:"senha" binding:"required,min=6"`
	ConfirmacaoSenha string `json:"confirmacaoSenha" binding:"required"`
}

type LoginRequest struct {
	Email string `json:"email" binding:"required,email"`
	Senha string `json:"senha" binding:"required"`
}

type AuthResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}
