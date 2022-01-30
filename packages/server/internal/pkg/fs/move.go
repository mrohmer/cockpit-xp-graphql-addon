package fs

import "os"

func MoveDir(src, dest string) error {
	return os.Rename(src, dest)
}
func MoveFile(src, dest string) error {
	return os.Rename(src, dest)
}
