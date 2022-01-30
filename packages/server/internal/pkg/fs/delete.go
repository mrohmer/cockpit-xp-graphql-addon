package fs

import "os"

func DeleteDir(dir string) error {
	return os.RemoveAll(dir)
}
func DeleteFile(file string) error {
	return os.Remove(file)
}
