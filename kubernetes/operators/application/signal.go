package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"
)

var signalsChan = make(chan struct{ })

func setupGracefullShutdownHandler( ) context.Context {
	// Makes sure that this function is invoked only once.
	close(signalsChan) // Panics if called twice.

	c := make(chan os.Signal, 2)
	ctx, cancel := context.WithCancel(context.Background( ))

	signal.Notify(c, []os.Signal{ os.Interrupt, syscall.SIGTERM }...)

	go func( ) {
		<-c
		cancel( )

		// Exit directly on receiving 2nd signal.
		<-c
		os.Exit(1)
	}( )

	return ctx
}