package github

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"
)

func GetLatestRelease(repository string) (string, error) {
	info, err := getReleaseInfo(repository, "latest")
	if err != nil {
		return "", err
	}

	tagName, ok := info["tag_name"]

	if !ok {
		return "", errors.New("could not find version name")
	}
	tagNameStr, ok := tagName.(string)
	if !ok {
		return "", errors.New("version name in unexpected format")
	}
	return tagNameStr, nil
}
func GetReleaseAssetByTag(repository, tag string) (asset, name string, err error) {
	info, err := getReleaseInfo(repository, fmt.Sprintf("tags/%s", tag))
	if err != nil {
		return
	}

	for _, a := range info["assets"].([]interface{}) {
		aMap, ok := a.(map[string]interface{})
		if !ok {
			continue
		}
		name, nameOk := aMap["name"].(string)
		url, urlOk := aMap["url"].(string)
		if nameOk && urlOk && strings.HasSuffix(name, ".zip") {
			return url, name, nil
		}
	}

	return "", "", errors.New("no asset found")
}
func DownloadAsset(url, fileName string) error {
	req := getRequest(url)

	req.Header.Add("Accept", "application/octet-stream")

	client := http.Client{}
	r, err := client.Do(req)
	if err != nil {
		return err
	}

	f, err := os.OpenFile(fileName, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, 0664)
	if err != nil {
		return err
	}

	defer f.Close()
	defer r.Body.Close()

	b := make([]byte, 4096)
	var i int

	for err == nil {
		i, err = r.Body.Read(b)
		f.Write(b[:i])
	}

	return nil
}

func getRequest(url string) *http.Request {
	req, _ := http.NewRequest("GET", url, nil)
	return req
}

func getReleaseInfo(repository, revision string) (result map[string]interface{}, err error) {
	url := fmt.Sprintf("https://api.github.com/repos/%s/releases/%s", repository, revision)

	req := getRequest(url)

	// Add required headers
	req.Header.Add("Accept", "application/vnd.github.v3.text-match+json")
	req.Header.Add("Accept", "application/vnd.github.moondragon+json")

	// call github
	client := http.Client{}
	r, err := client.Do(req)

	if err != nil {
		return
	}
	if r.StatusCode < 200 || r.StatusCode > 299 {
		return nil, fmt.Errorf("Error: %d %s", r.StatusCode, r.Status)
	}

	defer r.Body.Close()
	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		return
	}

	err = json.Unmarshal(body, &result)

	return
}
