package utils

import (
	"fmt"
	"math/rand"
)

const (
	maxOTP= 999999
	minOTP= 100000
)

func GenerateOTP( ) string {
	return fmt.Sprint(rand.Intn(maxOTP - minOTP) + minOTP)}