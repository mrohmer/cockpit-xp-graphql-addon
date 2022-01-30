package file_source

type eventTypeOnly struct {
	Event string `json:"event"`
}

type slotted struct {
	SlotID string `json:"slot"`
}

type distance struct {
	Time int `json:"time"`
	Lap  int `json:"lap"`
}

type sektorValues struct {
	Current int `json:"current"`
	Rekord  int `json:"rekord"`
}

type bahnrekordEvent struct {
	eventTypeOnly

	Data struct {
		slotted
		Value int `json:"value"`
	} `json:"data"`
}
type bestrafungEvent struct {
	eventTypeOnly

	Data struct {
		slotted

		ID     string `json:"id"`
		Type   string `json:"type"`
		Status string `json:"status"`
	} `json:"data"`
}
type changeRealTimeStatusEvent struct {
	eventTypeOnly

	Data struct {
		Type       string `json:"type"`
		Status     string `json:"status"`
		Mode       string `json:"mode"`
		TargetLap  int    `json:"targetLap"`
		TargetTime int    `json:"targetTime"`
	} `json:"data"`
}
type fuelChangedEvent struct {
	eventTypeOnly

	Data map[string]float64 `json:"data"`
}
type fuelingChangedEvent struct {
	eventTypeOnly

	Data []string `json:"data"`
}
type stopsChangedEvent struct {
	eventTypeOnly

	Data map[string]int `json:"data"`
}
type positionsChangedEvent struct {
	eventTypeOnly

	Data map[string]int `json:"data"`
}
type registerDriverEvent struct {
	eventTypeOnly

	Data struct {
		slotted
		Name  string  `json:"name"`
		Car   string  `json:"car"`
		Fuel  float64 `json:"fuel"`
		Races struct {
			Completed int `json:"completed"`
			Won       int `json:"won"`
		} `json:"races"`
		Position int `json:"position"`
	} `json:"data"`
}
type rundenrekordEvent struct {
	eventTypeOnly
	Data struct {
		slotted
		Personal int `json:"personal"`
		General  int `json:"general"`
	} `json:"data"`
}
type schnellsteRundeEvent struct {
	eventTypeOnly

	Data struct {
		slotted
		Value int `json:"value"`
	} `json:"data"`
}
type startRealTimeEvent struct {
	eventTypeOnly

	Data struct {
		Track struct {
			Name   string `json:"name"`
			Record int    `json:"record"`
		} `json:"track"`
		TargetLap  int `json:"targetLap"`
		TargetTime int `json:"targetTime"`
	} `json:"data"`
}
type startZielEvent struct {
	eventTypeOnly

	Data struct {
		slotted

		Distance struct {
			Leader distance `json:"leader"`
			Next   distance `json:"next"`
		} `json:"distance"`

		LapTime struct {
			Diff int `json:"diff"`
			Last int `json:"last"`
			Best int `json:"best"`
		} `json:"lapTime"`

		Lap           int     `json:"lap"`
		RemainingLaps int     `json:"remainingLaps"`
		Fuel          float64 `json:"fuel"`
	} `json:"data"`
}
type topspeedStoppEvent struct {
	eventTypeOnly

	Data struct {
		slotted

		Station int          `json:"station"`
		Speed   sektorValues `json:"speed"`
		Time    sektorValues `json:"time"`
	} `json:"data"`
}
type tickEvent struct {
	eventTypeOnly

	Data struct {
		Time struct {
			Value    int `json:"value"`
			Inverted int `json:"inverted"`
		} `json:"time"`
	} `json:"data"`
}
