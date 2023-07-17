package usecases

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
	"time"

	"golang.org/x/sync/errgroup"

	"github.com/Archisman-Mridha/outboxer/domain/ports"
	"github.com/Archisman-Mridha/outboxer/utils"
)

type RunArgs struct {
	OutboxDB ports.OutboxDB
	MQ       ports.MQ

	BatchSize int
}

// Run is the core of the outboxer.
func (u *Usecases) Run(args RunArgs) {
	var (
		tobePublishedItemsChan = make(chan *ports.ToBePublishedItem)
		// If publishing of a message to the message queue fails, then id of the DB row corresponding to
		// that message is pushed to itemsFailedTobePublishedChan.
		itemsFailedTobePublishedChan = make(chan string)
	)
	defer func() {
		close(tobePublishedItemsChan)
		close(itemsFailedTobePublishedChan)
	}()

	waitGroup, waitGroupContext := errgroup.WithContext(context.Background())
	// Listen for system interruption signals to gracefully shut down
	waitGroup.Go(func() error {
		shutdownSignalChan := make(chan os.Signal, 1)
		signal.Notify(shutdownSignalChan, os.Interrupt, syscall.SIGTERM)
		defer signal.Stop(shutdownSignalChan)

		var err error

		select {
		case <-waitGroupContext.Done():
			err = waitGroupContext.Err()

		case shutdownSignal := <-shutdownSignalChan:
			log.Printf("Received program shutdown signal: %v", shutdownSignal)
		}

		return err
	})

	//-- Core logic

	utils.RunFnPeriodically[*ports.GetMessagesArgs](
		waitGroup,
		args.OutboxDB.GetMessages, &ports.GetMessagesArgs{
			BatchSize:              args.BatchSize,
			ToBePublishedItemsChan: tobePublishedItemsChan,
		},
		3*time.Second,
	)

	waitGroup.Go(func() error {
		args.MQ.PublishMessages(
			&ports.PublishMessagesArgs{
				ToBePublishedItemsChan:       tobePublishedItemsChan,
				ItemsFailedTobePublishedChan: itemsFailedTobePublishedChan,
			},
		)

		return nil
	})

	waitGroup.Go(func() error {
		args.OutboxDB.Clean()

		return nil
	})

	waitGroup.Wait()
}
