package main

import (
	"errors"
	"fmt"
	"log"
	"path/filepath"
	"rohmer.rocks/server/internal/app/file_source"
	"rohmer.rocks/server/internal/app/server"
	"rohmer.rocks/server/internal/pkg/config"
	"rohmer.rocks/server/internal/pkg/fs"
	"rohmer.rocks/server/internal/pkg/graph"
	"time"
)

const defaultPort = 8080
const defaultSrcFile = "./events.txt"

func main() {
	log.Fatal(exec())
}
func exec() error {
	err := config.Parse()
	if err != nil {
		return err
	}

	resolver := &graph.Resolver{}

	port := config.GetInt("port")
	srcFilePath, err := getSrcFilePath()
	if err != nil {
		return err
	}

	source := file_source.NewSource(srcFilePath, resolver)

	startServer, err := server.
		NewServer(port).
		SetResolver(resolver).
		GetStartable()
	if err != nil {
		return err
	}

	recoverer(func() {
		source.Start()
		defer source.Stop()

		shutdown := startServer()
		defer shutdown()

	})
	return nil
}

func recoverer(f func()) {
	defer func() {
		if err := recover(); err != nil {
			fmt.Println(err)
			time.Sleep(5 * time.Second)
			go recoverer(f)
		}
	}()
	f()
}

func getSrcFilePath() (string, error) {
	cSrcPath := config.GetString("srcFile")
	if cSrcPath == "" {
		return "", errors.New("src-file cannot be empty")
	}
	srcPath, err := filepath.Abs(cSrcPath)

	if err != nil {
		return "", err
	}

	log.Printf("Using file %s as source", srcPath)
	if !fs.FileExists(srcPath) {
		log.Printf("file '%s' does not exist yet", srcPath)
	}

	return srcPath, nil
}
