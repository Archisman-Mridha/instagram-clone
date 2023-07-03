package utils

import (
	"fmt"
	"log"
	"os"
)

func GetEnv(envName string) string {

  envValue, isEnvFound := os.LookupEnv(envName)
  if !isEnvFound {
    log.Fatalf(fmt.Sprintf("💀 Env %s not found", envName))
  }

  return envValue
}