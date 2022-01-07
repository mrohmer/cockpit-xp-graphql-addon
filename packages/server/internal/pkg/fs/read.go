package fs

import (
	"bufio"
	"os"
	"strings"
)

func ReadLines(path string) ([]string, error) {
	buff, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}
	str := string(buff)
	str = strings.ReplaceAll(str, "\r\n", "\n")
	str = strings.TrimSpace(str)

	if str == "" {
		return nil, nil
	}

	return readLinesInStr(str), nil
}
func readLinesInStr(str string) []string {
	var lines []string
	sc := bufio.NewScanner(strings.NewReader(str))
	for sc.Scan() {
		lines = append(lines, sc.Text())
	}
	return lines
}
