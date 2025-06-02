package dal

import (
	"errors"

	"github.com/Vicente/Password-Mobile-App/backend/app/types"
	"gorm.io/gorm"
)

type AuthDAL struct {
	DB *gorm.DB
}

func NewAuthDAL(db *gorm.DB) *AuthDAL {
	return &AuthDAL{
		DB: db,
	}
}

func (d *AuthDAL) CreateUser(user *types.User) error {
	var existingUser types.User
	result := d.DB.Where("email = ?", user.Email).First(&existingUser)
	if result.Error == nil {
		return errors.New("email já cadastrado")
	} else if !errors.Is(result.Error, gorm.ErrRecordNotFound) {
		return result.Error
	}

	return d.DB.Create(user).Error
}

func (d *AuthDAL) GetUserByEmail(email string) (*types.User, error) {
	var user types.User
	result := d.DB.Where("email = ?", email).First(&user)
	if result.Error != nil {
		return nil, result.Error
	}
	return &user, nil
} 