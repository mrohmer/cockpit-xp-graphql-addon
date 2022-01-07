package graph

//go:generate go run github.com/99designs/gqlgen

import (
	"rohmer.rocks/server/internal/pkg/graph/model"
	"sort"
	"sync"
)

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your pkg, add any dependencies you require here.

type Resolver struct {
	race    *model.Race
	track   *model.Track
	slots   map[string]model.Slot
	drivers map[string]model.Driver

	raceObserver    map[string]chan *model.Race
	trackObserver   map[string]chan *model.Track
	slotsObserver   map[string]chan []*model.Slot
	slotObserver    map[string]map[string]chan *model.Slot
	driversObserver map[string]chan []*model.Driver
	driverObserver  map[string]map[string]chan *model.Driver
	mu              sync.Mutex
}

func (r *Resolver) Race() *model.Race {
	return r.race
}
func (r *Resolver) SetRace(race *model.Race) func() {
	if r.race == nil && race == nil {
		return func() {}
	}
	r.race = race
	return r.updateRaceObservers
}

func (r *Resolver) Track() *model.Track {
	return r.track
}

func (r *Resolver) SetTrack(track *model.Track) func() {
	if r.track == nil && track == nil {
		return func() {}
	}
	r.track = track
	return r.updateTrackObservers
}

func (r *Resolver) Slots() map[string]model.Slot {
	return r.slots
}
func (r *Resolver) SlotsArr() (slots []*model.Slot) {
	keys := make([]string, 0, len(r.slots))
	for k := range r.slots {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	for _, k := range keys {
		tmp := r.slots[k]
		slots = append(slots, &tmp)
	}
	return
}
func (r *Resolver) Slot(id string) *model.Slot {
	slot, ok := r.slots[id]
	if ok {
		return &slot
	}
	return nil
}

func (r *Resolver) SetSlots(slots map[string]model.Slot) func() {
	if r.slots == nil && slots == nil {
		return func() {}
	}
	r.slots = slots
	return func() {
		r.updateSlotsObservers()
		for key, _ := range r.slots {
			r.updateSlotObservers(key)
		}
	}
}
func (r *Resolver) SetSlot(key string, slot *model.Slot) func() {
	_, ok := r.slots[key]
	if (!ok) && slot == nil {
		return func() {}
	}

	if slot != nil {
		r.slots[key] = *slot
	} else {
		delete(r.slots, key)
	}
	return func() {
		r.updateSlotsObservers()
		r.updateSlotObservers(key)
	}
}

func (r *Resolver) Drivers() map[string]model.Driver {
	return r.drivers
}
func (r *Resolver) DriversArr() (drivers []*model.Driver) {
	keys := make([]string, 0, len(r.drivers))
	for k := range r.drivers {
		keys = append(keys, k)
	}
	sort.Strings(keys)

	for _, k := range keys {
		tmp := r.drivers[k]
		drivers = append(drivers, &tmp)
	}
	return
}
func (r *Resolver) Driver(id string) *model.Driver {
	driver, ok := r.drivers[id]
	if ok {
		return &driver
	}
	return nil
}

func (r *Resolver) SetDrivers(drivers map[string]model.Driver) func() {
	if r.drivers == nil && drivers == nil {
		return func() {}
	}
	r.drivers = drivers
	return func() {
		r.updateDriversObservers()
		for key, _ := range r.drivers {
			r.updateDriverObservers(key)
		}
		r.updateSlotsObservers()
		for key, _ := range r.slots {
			r.updateSlotObservers(key)
		}
	}
}
func (r *Resolver) SetDriver(key string, driver *model.Driver) func() {
	_, ok := r.drivers[key]
	if (!ok) && driver == nil {
		return func() {}
	}

	if driver != nil {
		r.drivers[key] = *driver
	} else {
		delete(r.drivers, key)
	}
	return func() {
		r.updateDriversObservers()
		r.updateDriverObservers(key)
		r.updateSlotsObservers()
		r.updateSlotObservers(key)
	}
}

func (r *Resolver) updateRaceObservers() {
	r.mu.Lock()
	for _, observer := range r.raceObserver {
		observer <- r.race
	}
	r.mu.Unlock()
}
func (r *Resolver) updateTrackObservers() {
	r.mu.Lock()
	for _, observer := range r.trackObserver {
		observer <- r.track
	}
	r.mu.Unlock()
}
func (r *Resolver) updateSlotsObservers() {
	r.mu.Lock()
	for _, observer := range r.slotsObserver {
		observer <- r.SlotsArr()
	}
	r.mu.Unlock()
}
func (r *Resolver) updateSlotObservers(id string) {
	r.mu.Lock()
	if observers, ok := r.slotObserver[id]; ok {
		for _, observer := range observers {
			if slot, slotOk := r.slots[id]; slotOk {
				observer <- &slot
			} else {
				observer <- nil
			}
		}
	}
	r.mu.Unlock()
}
func (r *Resolver) updateDriversObservers() {
	r.mu.Lock()
	for _, observer := range r.driversObserver {
		observer <- r.DriversArr()
	}
	r.mu.Unlock()
}
func (r *Resolver) updateDriverObservers(id string) {
	r.mu.Lock()
	if observers, ok := r.driverObserver[id]; ok {
		for _, observer := range observers {
			if driver, driverOk := r.drivers[id]; driverOk {
				observer <- &driver
			} else {
				observer <- nil
			}
		}
	}
	r.mu.Unlock()
}
