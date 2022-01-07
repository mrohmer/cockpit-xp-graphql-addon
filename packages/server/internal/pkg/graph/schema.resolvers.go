package graph

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.

import (
	"context"

	"rohmer.rocks/server/internal/pkg/graph/generated"
	"rohmer.rocks/server/internal/pkg/graph/model"
)

func (r *queryResolver) Race(ctx context.Context) (*model.Race, error) {
	return r.race, nil
}

func (r *queryResolver) Track(ctx context.Context) (*model.Track, error) {
	return r.track, nil
}

func (r *queryResolver) Slots(ctx context.Context) ([]*model.Slot, error) {
	return r.SlotsArr(), nil
}

func (r *queryResolver) Slot(ctx context.Context, id string) (*model.Slot, error) {
	slot, ok := r.slots[id]
	if !ok {
		return nil, nil
	}
	return &slot, nil
}

func (r *queryResolver) Drivers(ctx context.Context) ([]*model.Driver, error) {
	return r.DriversArr(), nil
}

func (r *queryResolver) Driver(ctx context.Context, id string) (*model.Driver, error) {
	driver, ok := r.drivers[id]
	if !ok {
		return nil, nil
	}
	return &driver, nil
}

func (r *subscriptionResolver) Race(ctx context.Context) (<-chan *model.Race, error) {
	id := randomStr(8)
	channel := make(chan *model.Race, 1)

	// Start a goroutine to allow for cleaning up subscriptions that are disconnected.
	// This go routine will only get past Done() when a client terminates the subscription. This allows us
	// to only then remove the reference from the list of ChatObservers since it is no longer needed.
	go func() {
		<-ctx.Done()
		r.mu.Lock()
		delete(r.raceObserver, id)
		r.mu.Unlock()
	}()
	r.mu.Lock()

	if r.raceObserver == nil {
		r.raceObserver = make(map[string]chan *model.Race)
	}

	// Keep a reference of the channel so that we can push changes into it when new messages are posted.
	r.raceObserver[id] = channel
	r.mu.Unlock()
	// This is optional, and this allows newly subscribed clients to get a list of all the messages that have been
	// posted so far. Upon subscribing the client will be pushed the messages once, further changes are handled
	// in the PostMessage mutation.
	r.raceObserver[id] <- r.race
	return channel, nil
}

func (r *subscriptionResolver) Track(ctx context.Context) (<-chan *model.Track, error) {
	id := randomStr(8)
	channel := make(chan *model.Track, 1)

	// Start a goroutine to allow for cleaning up subscriptions that are disconnected.
	// This go routine will only get past Done() when a client terminates the subscription. This allows us
	// to only then remove the reference from the list of ChatObservers since it is no longer needed.
	go func() {
		<-ctx.Done()
		r.mu.Lock()
		delete(r.trackObserver, id)
		r.mu.Unlock()
	}()
	r.mu.Lock()

	if r.trackObserver == nil {
		r.trackObserver = make(map[string]chan *model.Track)
	}

	// Keep a reference of the channel so that we can push changes into it when new messages are posted.
	r.trackObserver[id] = channel
	r.mu.Unlock()
	// This is optional, and this allows newly subscribed clients to get a list of all the messages that have been
	// posted so far. Upon subscribing the client will be pushed the messages once, further changes are handled
	// in the PostMessage mutation.
	r.trackObserver[id] <- r.track
	return channel, nil
}

func (r *subscriptionResolver) Slots(ctx context.Context) (<-chan []*model.Slot, error) {
	id := randomStr(8)
	channel := make(chan []*model.Slot, 1)

	// Start a goroutine to allow for cleaning up subscriptions that are disconnected.
	// This go routine will only get past Done() when a client terminates the subscription. This allows us
	// to only then remove the reference from the list of ChatObservers since it is no longer needed.
	go func() {
		<-ctx.Done()
		r.mu.Lock()
		delete(r.slotsObserver, id)
		r.mu.Unlock()
	}()
	r.mu.Lock()

	if r.slotsObserver == nil {
		r.slotsObserver = make(map[string]chan []*model.Slot)
	}

	// Keep a reference of the channel so that we can push changes into it when new messages are posted.
	r.slotsObserver[id] = channel
	r.mu.Unlock()
	// This is optional, and this allows newly subscribed clients to get a list of all the messages that have been
	// posted so far. Upon subscribing the client will be pushed the messages once, further changes are handled
	// in the PostMessage mutation.
	r.slotsObserver[id] <- r.SlotsArr()
	return channel, nil
}

func (r *subscriptionResolver) Slot(ctx context.Context, id string) (<-chan *model.Slot, error) {
	observerId := randomStr(8)
	channel := make(chan *model.Slot, 1)

	// Start a goroutine to allow for cleaning up subscriptions that are disconnected.
	// This go routine will only get past Done() when a client terminates the subscription. This allows us
	// to only then remove the reference from the list of ChatObservers since it is no longer needed.
	go func() {
		<-ctx.Done()
		r.mu.Lock()
		delete(r.slotObserver[id], observerId)
		r.mu.Unlock()
	}()
	r.mu.Lock()

	if r.slotObserver == nil {
		r.slotObserver = make(map[string]map[string]chan *model.Slot)
	}
	if r.slotObserver[id] == nil {
		r.slotObserver[id] = make(map[string]chan *model.Slot)
	}

	// Keep a reference of the channel so that we can push changes into it when new messages are posted.
	r.slotObserver[id][observerId] = channel
	r.mu.Unlock()
	// This is optional, and this allows newly subscribed clients to get a list of all the messages that have been
	// posted so far. Upon subscribing the client will be pushed the messages once, further changes are handled
	// in the PostMessage mutation.
	slot, ok := r.slots[id]
	if ok {
		r.slotObserver[id][observerId] <- &slot
	} else {
		r.slotObserver[id][observerId] <- nil
	}
	return channel, nil
}

func (r *subscriptionResolver) Drivers(ctx context.Context) (<-chan []*model.Driver, error) {
	id := randomStr(8)
	channel := make(chan []*model.Driver, 1)

	// Start a goroutine to allow for cleaning up subscriptions that are disconnected.
	// This go routine will only get past Done() when a client terminates the subscription. This allows us
	// to only then remove the reference from the list of ChatObservers since it is no longer needed.
	go func() {
		<-ctx.Done()
		r.mu.Lock()
		delete(r.driversObserver, id)
		r.mu.Unlock()
	}()
	r.mu.Lock()

	if r.driversObserver == nil {
		r.driversObserver = make(map[string]chan []*model.Driver)
	}

	// Keep a reference of the channel so that we can push changes into it when new messages are posted.
	r.driversObserver[id] = channel
	r.mu.Unlock()
	// This is optional, and this allows newly subscribed clients to get a list of all the messages that have been
	// posted so far. Upon subscribing the client will be pushed the messages once, further changes are handled
	// in the PostMessage mutation.
	r.driversObserver[id] <- r.DriversArr()
	return channel, nil
}

func (r *subscriptionResolver) Driver(ctx context.Context, id string) (<-chan *model.Driver, error) {
	observerId := randomStr(8)
	channel := make(chan *model.Driver, 1)

	// Start a goroutine to allow for cleaning up subscriptions that are disconnected.
	// This go routine will only get past Done() when a client terminates the subscription. This allows us
	// to only then remove the reference from the list of ChatObservers since it is no longer needed.
	go func() {
		<-ctx.Done()
		r.mu.Lock()
		delete(r.driverObserver[id], observerId)
		r.mu.Unlock()
	}()
	r.mu.Lock()

	if r.driverObserver == nil {
		r.driverObserver = make(map[string]map[string]chan *model.Driver)
	}
	if r.driverObserver[id] == nil {
		r.driverObserver[id] = make(map[string]chan *model.Driver)
	}

	// Keep a reference of the channel so that we can push changes into it when new messages are posted.
	r.driverObserver[id][observerId] = channel
	r.mu.Unlock()
	// This is optional, and this allows newly subscribed clients to get a list of all the messages that have been
	// posted so far. Upon subscribing the client will be pushed the messages once, further changes are handled
	// in the PostMessage mutation.
	driver, ok := r.drivers[id]
	if ok {
		r.driverObserver[id][observerId] <- &driver
	} else {
		r.driverObserver[id][observerId] <- nil
	}
	return channel, nil
}

// Query returns generated.QueryResolver implementation.
func (r *Resolver) Query() generated.QueryResolver { return &queryResolver{r} }

// Subscription returns generated.SubscriptionResolver implementation.
func (r *Resolver) Subscription() generated.SubscriptionResolver { return &subscriptionResolver{r} }

type queryResolver struct{ *Resolver }
type subscriptionResolver struct{ *Resolver }
