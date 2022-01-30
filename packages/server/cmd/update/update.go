package main

import (
	"errors"
	"fmt"
	"io/ioutil"
	"os"
	"rohmer.rocks/server/internal/pkg/fs"
	"rohmer.rocks/server/internal/pkg/github"
)

const repository = "mrohmer/cockpit-xp-graphql-addon"
const currentVersion = "__CURRENT_VERSION__"

func main() {
	fmt.Println("Current version is: ", currentVersion)
	fmt.Print("\nFetching latest version...")
	version, err := github.GetLatestRelease(repository)

	if err != nil {
		fmt.Println()
		panic(err)
	}

	fmt.Printf(" found %s\n", version)

	if currentVersion == version {
		fmt.Println("Everything is up to date.")
		return
	}

	fmt.Println("Downloading files...")
	err = downloadAndExtractTagAsset(version)
	if err != nil {
		panic(err)
	}

	fmt.Println("Copying current files to backup location...")
	err = copyDirToBackup()
	if err != nil {
		panic(err)
	}

	fmt.Println("Moving new files to correct location...")
	err = moveNewFilesToCorrectLocation()
	if err != nil {
		panic(err)
	}

	fmt.Println("Done")
}

func downloadAndExtractTagAsset(tag string) error {
	asset, name, err := github.GetReleaseAssetByTag(repository, tag)

	if err != nil {
		return err
	}

	if !fs.FileExists(name) {
		err = github.DownloadAsset(asset, name)

		if err != nil {
			return err
		}
	}

	if fs.DirExists("tmp") {
		err = fs.DeleteDir("tmp")
		if err != nil {
			return err
		}
	}

	err = fs.Unzip(name, "tmp")
	if err != nil {
		return err
	}
	err = fs.DeleteFile(name)
	if err != nil {
		return err
	}

	return nil
}

func copyDirToBackup() error {
	if fs.DirExists("backup") {
		err := fs.DeleteDir("backup")
		if err != nil {
			return err
		}
	}

	err := os.Mkdir("backup", 0755)
	if err != nil {
		return err
	}
	files, err := ioutil.ReadDir(".")
	if err != nil {
		return err
	}

	for _, file := range files {
		if file.IsDir() {
			if file.Name() != "backup" && file.Name() != "tmp" {
				err = fs.MoveDir(file.Name(), fmt.Sprintf("backup/%s", file.Name()))
				if err != nil {
					return err
				}
			}
		} else {
			err = fs.MoveFile(file.Name(), fmt.Sprintf("backup/%s", file.Name()))
			if err != nil {
				return err
			}
		}
	}
	return nil
}

func moveNewFilesToCorrectLocation() error {
	if !fs.DirExists("tmp") {
		return errors.New("could not find tmp folder")
	}

	files, err := ioutil.ReadDir("tmp")
	if err != nil {
		return err
	}

	for _, file := range files {
		if file.IsDir() {
			if file.Name() != "backup" && file.Name() != "tmp" {
				err = fs.MoveDir(fmt.Sprintf("tmp/%s", file.Name()), file.Name())
				if err != nil {
					return err
				}
			}
		} else {
			err = fs.MoveFile(fmt.Sprintf("tmp/%s", file.Name()), file.Name())
			if err != nil {
				return err
			}
		}
	}
	return fs.DeleteDir("tmp")
}
