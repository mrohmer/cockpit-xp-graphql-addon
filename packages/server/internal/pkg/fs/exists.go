package fs

import (
	"os"
)

func FileExists(path string) bool {
	_, err := os.Stat(path)
	return err == nil
}
func DirExists(path string) bool {
	return FileExists(path)
}
