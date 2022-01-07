package file_source

import (
	"github.com/radovskyb/watcher"
	"log"
	"rohmer.rocks/server/internal/pkg/fs"
	"rohmer.rocks/server/internal/pkg/graph"
	"sync"
	"time"
)

type FileSource struct {
	path     string
	resolver *graph.Resolver
	w        *watcher.Watcher
	lastLen  int
	mu       *sync.Mutex
}

func NewSource(path string, resolver *graph.Resolver) *FileSource {
	return &FileSource{
		path:     path,
		resolver: resolver,
		mu:       new(sync.Mutex),
	}
}

func (f *FileSource) Start() error {
	f.Stop()
	go func(source *FileSource) {
		for {
			if fs.FileExists(source.path) {
				source.synced(func() {
					source.create()
					source.update()
				})
				log.Println(source.execWatcher())
				source.synced(source.remove)
			}
			time.Sleep(time.Millisecond * 100)
		}
	}(f)

	return nil
}
func (f *FileSource) Stop() {
	if f.w == nil {
		return
	}
	f.w.Close()
	f.w = nil
}

func (f *FileSource) execWatcher() error {
	go func(source *FileSource) {
		for {
			select {
			case <-f.w.Event:
				source.synced(source.update)
			case err := <-f.w.Error:
				log.Print(err)
				f.w.Close()
			case <-f.w.Closed:
				f.w = nil
				return
			}
		}
	}(f)
	f.w = watcher.New()
	f.w.FilterOps(watcher.Write, watcher.Create)
	err := f.w.Add(f.path)
	if err != nil {
		return err
	}
	return f.w.Start(time.Millisecond * 100)
}

func (f *FileSource) create() {
	f.lastLen = 0
	f.resolver.SetRace(nil)()
	f.resolver.SetDrivers(nil)()
	f.resolver.SetSlots(nil)()
	f.resolver.SetTrack(nil)()
}
func (f *FileSource) remove() {
	f.lastLen = 0
	f.resolver.SetRace(nil)()
	f.resolver.SetDrivers(nil)()
	f.resolver.SetSlots(nil)()
	f.resolver.SetTrack(nil)()
}
func (f *FileSource) update() {
	lines, err := fs.ReadLines(f.path)

	if err != nil {
		log.Printf("🤷 %e", err)
		return
	}
	if len(lines) < f.lastLen {
		f.lastLen = 0
		f.resolver.SetRace(nil)()
	}

	if len(lines) == f.lastLen {
		return
	}

	_ = processEvents(f.resolver, lines[f.lastLen:])

	f.lastLen = len(lines)
}

func (f *FileSource) synced(cb func()) {
	f.syncedWithAfterFunc(func() *func() {
		cb()
		return nil
	})
}
func (f *FileSource) syncedWithAfterFunc(cb func() *func()) {
	f.mu.Lock()
	after := cb()
	f.mu.Unlock()

	if after != nil {
		(*after)()
	}
}
