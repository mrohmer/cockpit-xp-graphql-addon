package file_source

import (
	"encoding/json"
	"fmt"
	"rohmer.rocks/server/internal/pkg/graph"
	"rohmer.rocks/server/internal/pkg/graph/model"
	"strconv"
)

type update struct {
	r *graph.Resolver

	updateRace    func()
	updateTrack   func()
	updateDrivers func()
	updateSlots   func()
	updateDriver  map[string]func()
	updateSlot    map[string]func()
}

func processEvents(r *graph.Resolver, events []string) (errs []error) {
	u := update{
		r: r,
	}
	for _, event := range events {
		err := u.processEvent(event)
		if err != nil {
			errs = append(errs, err)
		}
	}

	fmt.Print("[source] sending updates to observers...")
	u.commit()
	fmt.Println(" done")

	return
}
func (u *update) processEvent(event string) error {
	var eventType eventTypeOnly
	err := json.Unmarshal([]byte(event), &eventType)

	if err != nil {
		fmt.Println("[source] unable to parse json")
		fmt.Println(err)
		return err
	}

	fmt.Printf("[source] start processing event %s...", eventType.Event)

	handler, err := u.getHandler(eventType.Event)

	if err != nil {
		fmt.Println(" could not find handler")
		return err
	}

	err = handler(event)

	if err != nil {
		fmt.Println(" could not process correctly:")
		fmt.Println(err)
		return err
	}
	fmt.Println(" done")
	return nil
}
func (u *update) getHandler(eventType string) (func(str string) error, error) {
	switch eventType {
	case "Bahnrekord":
		return u.processBahnrekordEvent, nil
	case "Bestrafung":
		return u.processBestrafungEvent, nil
	case "ChangeRealTimeStatus":
		return u.processChangeRealTimeStatusEvent, nil
	case "Rundenrekord":
		return u.processRundenrekordEvent, nil
	case "SchnellsteRunde":
		return u.processSchnellsteRundeEvent, nil
	case "StartRealTime":
		return u.processStartRealTimeEvent, nil
	case "FuelChanged":
		return u.processFuelChangedEvent, nil
	case "PositionsChanged":
		return u.processPositionsChangedEvent, nil
	case "RegisterDriver":
		return u.processRegisterDriver, nil
	case "Tick":
		return u.processTickEvent, nil
	case "StartZiel":
		return u.processStartZielEvent, nil
	case "TankenEinfahrt":
		return u.processTankenEinfahrtEvent, nil
	case "TankenAusfahrt":
		return u.processTankenAusfahrtEvent, nil
	case "Topspeed-Stopp":
		return u.processTopSpeedStoppEvent, nil
	}
	return nil, fmt.Errorf("unknown event '%s'", eventType)
}
func (u *update) processBahnrekordEvent(str string) error {
	var event bahnrekordEvent
	err := json.Unmarshal([]byte(str), &event)

	if err != nil {
		return err
	}

	track := u.r.Track()
	if track == nil {
		track = &model.Track{}
	}
	track.Record = &event.Data.Value

	u.updateTrack = u.r.SetTrack(track)
	return nil
}
func (u *update) processBestrafungEvent(str string) error {
	var event bestrafungEvent
	err := json.Unmarshal([]byte(str), &event)

	if err != nil {
		return err
	}

	slot := u.r.Slot(event.Data.SlotID)

	if slot == nil {
		return nil
	}

	switch event.Data.Status {
	case "COMPLETED":
		var penalties []*model.Penalty
		for _, penalty := range slot.Penalties {
			if penalty != nil && penalty.ID != event.Data.ID {
				penalties = append(penalties, penalty)
			}
		}
		slot.Penalties = penalties
		break
	case "ACTIVE", "DISQUALIFICATION":
		slot.Penalties = append(slot.Penalties, &model.Penalty{
			ID:     event.Data.ID,
			Type:   event.Data.Type,
			Status: event.Data.Status,
		})
		break
	}

	u.addSlotUpdate(event.Data.SlotID, slot)
	return nil
}
func (u *update) processChangeRealTimeStatusEvent(str string) error {
	var event changeRealTimeStatusEvent
	err := json.Unmarshal([]byte(str), &event)

	if err != nil {
		return err
	}

	race := u.r.Race()
	if race == nil {
		race = &model.Race{}
	}

	{
		var status model.RaceStatus
		switch event.Data.Status {
		case "RUNNING":
			status = model.RaceStatusRunning
			break
		case "STOPPED":
			status = model.RaceStatusStopped
			break
		case "PAUSED":
			status = model.RaceStatusPaused
			break
		}
		race.Status = &status
		race.Running = status == model.RaceStatusRunning
	}

	{
		var mode model.RaceMode
		switch event.Data.Mode {
		case "RACE":
			mode = model.RaceModeRace
			break
		case "TRAINING":
			mode = model.RaceModeTraining
			break
		case "QUALIFYING":
			mode = model.RaceModeQualifying
			break
		}
		race.Mode = &mode
	}

	{
		var lastEvent model.RaceEvent
		switch event.Data.Type {
		case "SESSION_IS_STARTING":
			lastEvent = model.RaceEventSessionIsStarting
			break
		case "SESSION_STARTED":
			lastEvent = model.RaceEventSessionStarted
			break
		case "RACE_STARTING":
			lastEvent = model.RaceEventRaceStarting
			break
		case "RACE_ENDED_BY_FIRST":
			lastEvent = model.RaceEventRaceEndedByFirst
			break
		case "RACE_ENDED_BY_LAST":
			lastEvent = model.RaceEventRaceEndedByLast
			break
		case "CHAOS":
			lastEvent = model.RaceEventChaos
			break
		case "CHAOS_WITH_FOLLOW_UP_TIME":
			lastEvent = model.RaceEventChaosWithFollowUpTime
			break
		case "SESSION_CANCELED":
			lastEvent = model.RaceEventSessionCanceled
			break
		}
		race.LastEvent = &lastEvent
	}

	race.TargetTime = event.Data.TargetTime
	race.TargetLaps = event.Data.TargetLap

	u.updateRace = u.r.SetRace(race)
	return nil
}
func (u *update) processRegisterDriver(str string) error {
	var event registerDriverEvent
	err := json.Unmarshal([]byte(str), &event)

	if err != nil {
		return err
	}

	slots := u.r.Slots()
	if slots == nil {
		slots = make(map[string]model.Slot)
	}
	drivers := u.r.Drivers()
	if drivers == nil {
		drivers = make(map[string]model.Driver)
	}

	id := event.Data.SlotID
	d := model.Driver{
		ID:   id,
		Name: event.Data.Name,
		Car:  event.Data.Car,
		Races: &model.RaceStats{
			Completed: event.Data.Races.Completed,
			Won:       event.Data.Races.Won,
		},
	}
	drivers[id] = d
	slots[id] = model.Slot{
		ID:       id,
		Driver:   &d,
		Fuel:     event.Data.Fuel,
		Position: event.Data.Position,
		LapTime:  &model.LapTime{},
	}

	u.updateDrivers = u.r.SetDrivers(drivers)
	u.updateSlots = u.r.SetSlots(slots)
	return nil
}
func (u *update) processFuelChangedEvent(str string) error {
	var event fuelChangedEvent
	err := json.Unmarshal([]byte(str), &event)

	if err != nil {
		return err
	}

	slots := u.r.Slots()
	if slots == nil {
		return nil
	}

	for id, fuel := range event.Data {
		slot, exists := slots[id]
		if exists {
			slot.Fuel = fuel
			slots[id] = slot
		}
	}

	u.updateSlots = u.r.SetSlots(slots)
	return nil
}
func (u *update) processPositionsChangedEvent(str string) error {
	var event positionsChangedEvent
	err := json.Unmarshal([]byte(str), &event)

	if err != nil {
		return err
	}

	slots := u.r.Slots()
	if slots == nil {
		return nil
	}

	for id, position := range event.Data {
		slot, exists := slots[id]
		if exists {
			slot.Position = position
			slots[id] = slot
		}
	}

	u.updateSlots = u.r.SetSlots(slots)
	return nil
}
func (u *update) processRundenrekordEvent(str string) error {
	var event rundenrekordEvent
	err := json.Unmarshal([]byte(str), &event)

	if err != nil {
		return err
	}

	race := u.r.Race()
	if race == nil {
		race = &model.Race{}
	}

	driver := u.r.Driver(event.Data.SlotID)

	race.Record = &model.Record{
		Driver: driver,
		Value:  &event.Data.General,
	}

	u.updateRace = u.r.SetRace(race)
	return nil
}
func (u *update) processSchnellsteRundeEvent(str string) error {
	var event schnellsteRundeEvent
	err := json.Unmarshal([]byte(str), &event)

	if err != nil {
		return err
	}

	slot := u.r.Slot(event.Data.SlotID)

	if slot == nil {
		return nil
	}

	slot.LapRecord = &event.Data.Value

	u.addSlotUpdate(event.Data.SlotID, slot)
	return nil
}
func (u *update) processStartRealTimeEvent(str string) error {
	var event startRealTimeEvent
	err := json.Unmarshal([]byte(str), &event)

	if err != nil {
		return err
	}

	var name *string
	if event.Data.Track.Name != "" {
		name = &event.Data.Track.Name
	}
	var record *int
	if event.Data.Track.Record != 0 {
		record = &event.Data.Track.Record
	}

	track := &model.Track{
		Record: record,
		Name:   name,
	}

	race := &model.Race{
		TargetTime: event.Data.TargetTime,
		TargetLaps: event.Data.TargetLap,
		Running:    false,
	}

	u.updateTrack = u.r.SetTrack(track)
	u.updateRace = u.r.SetRace(race)
	return nil
}
func (u *update) processStartZielEvent(str string) error {
	var event startZielEvent
	err := json.Unmarshal([]byte(str), &event)

	if err != nil {
		return err
	}

	slot := u.r.Slot(event.Data.SlotID)
	if slot == nil {
		return nil
	}

	slot.Fuel = event.Data.Fuel
	slot.Lap = event.Data.Lap
	slot.RemainingLaps = event.Data.RemainingLaps
	slot.DistanceToNext = &model.DistanceToPlayer{
		Time: event.Data.Distance.Next.Time,
		Lap:  event.Data.Distance.Next.Lap,
	}
	slot.DistanceToLeader = &model.DistanceToPlayer{
		Time: event.Data.Distance.Leader.Time,
		Lap:  event.Data.Distance.Leader.Lap,
	}

	var current *int
	if event.Data.LapTime.Last != 0 {
		current = &event.Data.LapTime.Last
	}
	var best *int
	if event.Data.LapTime.Best != 0 {
		best = &event.Data.LapTime.Best
	}

	last := slot.LapTime.Last

	if slot.LapTime.Current != nil && *slot.LapTime.Current > 0 {
		last = append(last, *slot.LapTime.Current)
	}

	sum := 0
	amount := len(last)
	for _, i := range last {
		sum += i
	}
	if current != nil {
		sum += *current
		amount++
	}

	var average *float64
	if amount > 0 {
		tmp := float64(sum) / float64(amount)
		average = &tmp
	}

	slot.LapTime = &model.LapTime{
		Average: average,
		Last:    last,
		Current: current,
		Best:    best,
	}

	u.addSlotUpdate(event.Data.SlotID, slot)
	return nil
}
func (u *update) processTankenEinfahrtEvent(str string) error {
	var event tankenEinfahrtEvent
	err := json.Unmarshal([]byte(str), &event)

	if err != nil {
		return err
	}

	slot := u.r.Slot(event.Data.SlotID)
	if slot == nil {
		return nil
	}

	slot.IsRefueling = event.Data.Active
	slot.BoxStops = event.Data.Stops

	u.addSlotUpdate(event.Data.SlotID, slot)
	return nil
}
func (u *update) processTankenAusfahrtEvent(str string) error {
	var event tankenAusfahrtEvent
	err := json.Unmarshal([]byte(str), &event)

	if err != nil {
		return err
	}

	slot := u.r.Slot(event.Data.SlotID)
	if slot == nil {
		return nil
	}

	slot.IsRefueling = event.Data.Active
	slot.BoxStops = event.Data.Stops

	u.addSlotUpdate(event.Data.SlotID, slot)
	return nil
}
func (u *update) processTickEvent(str string) error {
	var event tickEvent
	err := json.Unmarshal([]byte(str), &event)

	if err != nil {
		return err
	}

	// todo: session time?!

	return nil
}
func (u *update) processTopSpeedStoppEvent(str string) error {
	var event topspeedStoppEvent
	err := json.Unmarshal([]byte(str), &event)

	if err != nil {
		return err
	}

	slot := u.r.Slot(event.Data.SlotID)
	if slot == nil {
		return nil
	}

	for i := 0; i < event.Data.Station-len(slot.SectorStats); i++ {
		slot.SectorStats = append(slot.SectorStats, nil)
	}
	slot.SectorStats[event.Data.Station] = &model.SectorStats{
		ID: strconv.Itoa(event.Data.Station),
		Time: &model.SectorStat{
			Current: &event.Data.Time.Current,
			Record:  &event.Data.Time.Rekord,
		},
		Speed: &model.SectorStat{
			Current: &event.Data.Speed.Current,
			Record:  &event.Data.Speed.Rekord,
		},
	}

	u.addSlotUpdate(event.Data.SlotID, slot)
	return nil
}

func (u *update) addDriverUpdate(id string, driver *model.Driver) {
	if u.updateDriver == nil {
		u.updateDriver = make(map[string]func())
	}
	u.updateDriver[id] = u.r.SetDriver(id, driver)
}
func (u *update) addSlotUpdate(id string, slot *model.Slot) {
	if u.updateSlot == nil {
		u.updateSlot = make(map[string]func())
	}
	u.updateSlot[id] = u.r.SetSlot(id, slot)
}
func (u *update) commit() {
	if u.updateRace != nil {
		u.updateRace()
		u.updateRace = nil
	}

	if u.updateTrack != nil {
		u.updateTrack()
		u.updateTrack = nil
	}

	if u.updateDriver != nil && len(u.updateDriver) > 0 {
		for key, f := range u.updateDriver {
			f()
			delete(u.updateSlot, key) // done implicitly
		}

		u.updateDriver = nil
		u.updateDrivers = nil // done implicitly
		u.updateSlots = nil   // done implicitly
	}

	if u.updateSlot != nil && len(u.updateSlot) > 0 {
		for _, f := range u.updateSlot {
			f()
		}
		u.updateSlot = nil
		u.updateSlots = nil // done implicitly
	}

	if u.updateDrivers != nil {
		u.updateDrivers()
		u.updateDrivers = nil
		u.updateSlots = nil // done implicitly
	}
	if u.updateSlots != nil {
		u.updateSlots()
		u.updateSlots = nil
	}
}
