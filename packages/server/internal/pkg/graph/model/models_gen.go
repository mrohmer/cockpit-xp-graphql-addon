// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

import (
	"fmt"
	"io"
	"strconv"
)

type DistanceToPlayer struct {
	Time int `json:"time"`
	Lap  int `json:"lap"`
}

type Driver struct {
	ID    string     `json:"id"`
	Name  string     `json:"name"`
	Car   string     `json:"car"`
	Races *RaceStats `json:"races"`
}

type LapTime struct {
	Average *float64 `json:"average"`
	Last    []int    `json:"last"`
	Current *int     `json:"current"`
	Best    *int     `json:"best"`
}

type Penalty struct {
	ID     string `json:"id"`
	Type   string `json:"type"`
	Status string `json:"status"`
}

type Race struct {
	TargetLaps int         `json:"targetLaps"`
	TargetTime int         `json:"targetTime"`
	Running    bool        `json:"running"`
	Mode       *RaceMode   `json:"mode"`
	Status     *RaceStatus `json:"status"`
	LastEvent  *RaceEvent  `json:"lastEvent"`
	Record     *Record     `json:"record"`
}

type RaceStats struct {
	Completed int `json:"completed"`
	Won       int `json:"won"`
}

type Record struct {
	Driver *Driver `json:"driver"`
	Value  *int    `json:"value"`
}

type SectorStat struct {
	Current *int `json:"current"`
	Record  *int `json:"record"`
}

type SectorStats struct {
	ID    string      `json:"id"`
	Time  *SectorStat `json:"time"`
	Speed *SectorStat `json:"speed"`
}

type Slot struct {
	ID               string            `json:"id"`
	Driver           *Driver           `json:"driver"`
	Lap              int               `json:"lap"`
	RemainingLaps    int               `json:"remainingLaps"`
	LapTime          *LapTime          `json:"lapTime"`
	Speed            int               `json:"speed"`
	Fuel             float64           `json:"fuel"`
	Penalties        []*Penalty        `json:"penalties"`
	DistanceToLeader *DistanceToPlayer `json:"distanceToLeader"`
	DistanceToNext   *DistanceToPlayer `json:"distanceToNext"`
	IsRefueling      bool              `json:"isRefueling"`
	BoxStops         int               `json:"boxStops"`
	SectorStats      []*SectorStats    `json:"sectorStats"`
	LapRecord        *int              `json:"lapRecord"`
	Position         int               `json:"position"`
	SpeedValue       *int              `json:"speedValue"`
	BreakValue       *int              `json:"breakValue"`
}

type Track struct {
	Record *int    `json:"record"`
	Name   *string `json:"name"`
}

type RaceEvent string

const (
	RaceEventSessionIsStarting     RaceEvent = "SESSION_IS_STARTING"
	RaceEventSessionStarted        RaceEvent = "SESSION_STARTED"
	RaceEventRaceStarting          RaceEvent = "RACE_STARTING"
	RaceEventRaceEndedByFirst      RaceEvent = "RACE_ENDED_BY_FIRST"
	RaceEventRaceEndedByLast       RaceEvent = "RACE_ENDED_BY_LAST"
	RaceEventChaos                 RaceEvent = "CHAOS"
	RaceEventChaosWithFollowUpTime RaceEvent = "CHAOS_WITH_FOLLOW_UP_TIME"
	RaceEventSessionCanceled       RaceEvent = "SESSION_CANCELED"
)

var AllRaceEvent = []RaceEvent{
	RaceEventSessionIsStarting,
	RaceEventSessionStarted,
	RaceEventRaceStarting,
	RaceEventRaceEndedByFirst,
	RaceEventRaceEndedByLast,
	RaceEventChaos,
	RaceEventChaosWithFollowUpTime,
	RaceEventSessionCanceled,
}

func (e RaceEvent) IsValid() bool {
	switch e {
	case RaceEventSessionIsStarting, RaceEventSessionStarted, RaceEventRaceStarting, RaceEventRaceEndedByFirst, RaceEventRaceEndedByLast, RaceEventChaos, RaceEventChaosWithFollowUpTime, RaceEventSessionCanceled:
		return true
	}
	return false
}

func (e RaceEvent) String() string {
	return string(e)
}

func (e *RaceEvent) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = RaceEvent(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid RaceEvent", str)
	}
	return nil
}

func (e RaceEvent) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type RaceMode string

const (
	RaceModeQualifying RaceMode = "QUALIFYING"
	RaceModeRace       RaceMode = "RACE"
	RaceModeTraining   RaceMode = "TRAINING"
)

var AllRaceMode = []RaceMode{
	RaceModeQualifying,
	RaceModeRace,
	RaceModeTraining,
}

func (e RaceMode) IsValid() bool {
	switch e {
	case RaceModeQualifying, RaceModeRace, RaceModeTraining:
		return true
	}
	return false
}

func (e RaceMode) String() string {
	return string(e)
}

func (e *RaceMode) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = RaceMode(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid RaceMode", str)
	}
	return nil
}

func (e RaceMode) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}

type RaceStatus string

const (
	RaceStatusRunning RaceStatus = "RUNNING"
	RaceStatusStopped RaceStatus = "STOPPED"
	RaceStatusPaused  RaceStatus = "PAUSED"
)

var AllRaceStatus = []RaceStatus{
	RaceStatusRunning,
	RaceStatusStopped,
	RaceStatusPaused,
}

func (e RaceStatus) IsValid() bool {
	switch e {
	case RaceStatusRunning, RaceStatusStopped, RaceStatusPaused:
		return true
	}
	return false
}

func (e RaceStatus) String() string {
	return string(e)
}

func (e *RaceStatus) UnmarshalGQL(v interface{}) error {
	str, ok := v.(string)
	if !ok {
		return fmt.Errorf("enums must be strings")
	}

	*e = RaceStatus(str)
	if !e.IsValid() {
		return fmt.Errorf("%s is not a valid RaceStatus", str)
	}
	return nil
}

func (e RaceStatus) MarshalGQL(w io.Writer) {
	fmt.Fprint(w, strconv.Quote(e.String()))
}
