package config

import (
	"fmt"
	"github.com/spf13/pflag"
	"github.com/spf13/viper"
)

func init() {
	pflag.String("srcFile", "./events.txt", "the source file to read data from")
	pflag.Int("port", 8080, "the port to open the server")
	pflag.Bool("debug", false, "launch server in debug mode")

	for _, k := range viper.AllKeys() {
		fmt.Println(k)
	}

	viper.SetEnvPrefix("ws")
	viper.AutomaticEnv()

	viper.SetConfigName(".ws")

	viper.AddConfigPath(".")
}

func Parse() error {
	pflag.Parse()
	err := viper.BindPFlags(pflag.CommandLine)
	if err != nil {
		return err
	}
	if err := viper.ReadInConfig(); err != nil {
		if _, ok := err.(viper.ConfigFileNotFoundError); !ok {
			return err
		}
	}
	return nil
}

func GetString(key string) string {
	return viper.GetString(key)
}
func GetInt(key string) int {
	return viper.GetInt(key)
}
