package server

import (
	"context"
	"errors"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi"
	"github.com/gorilla/websocket"
	"github.com/rs/cors"
	"log"
	"net"
	"net/http"
	"rohmer.rocks/server/internal/pkg/graph"
	"rohmer.rocks/server/internal/pkg/graph/generated"
	"strconv"
)

type Server struct {
	port     int
	resolver *graph.Resolver
	debug    bool
}

func NewServer(port int) *Server {
	return &Server{port: port}
}
func (s *Server) SetResolver(resolver *graph.Resolver) *Server {
	s.resolver = resolver
	return s
}
func (s *Server) DebugMode(debug bool) {
	s.debug = debug
}
func (s *Server) GetStartable() (func() func(), error) {
	if s.port == 0 {
		return nil, errors.New("port not set")
	}
	if s.resolver == nil {
		return nil, errors.New("resolver not set")
	}

	startableServer := &Server{
		port:     s.port,
		resolver: s.resolver,
		debug:    s.debug,
	}
	startable := func() func() {
		router := chi.NewRouter()

		router.Use(cors.New(cors.Options{
			Debug:          startableServer.debug,
			AllowedHeaders: []string{"*"},
		}).Handler)

		srv := handler.New(generated.NewExecutableSchema(generated.Config{Resolvers: startableServer.resolver}))
		srv.AddTransport(transport.Options{})
		srv.AddTransport(transport.GET{})
		srv.AddTransport(transport.POST{})
		srv.AddTransport(transport.MultipartForm{})

		srv.SetQueryCache(lru.New(1000))

		srv.Use(extension.Introspection{})
		srv.Use(extension.AutomaticPersistedQuery{
			Cache: lru.New(100),
		})
		srv.AddTransport(&transport.Websocket{
			Upgrader: websocket.Upgrader{
				CheckOrigin: func(r *http.Request) bool {
					// Check against your desired domains here
					return true
				},
				ReadBufferSize:  1024,
				WriteBufferSize: 1024,
			},
		})

		fs := http.FileServer(http.Dir("public"))

		router.Handle("/playground", playground.Handler("GraphQL playground", "/query"))
		router.Handle("/query", srv)
		router.Handle("/*", fs)

		log.Printf(
			"go to http://localhost:%d/playground for GraphQL playground\n\nopen http://%s:%d on any device in your network to view the ui\n\n",
			startableServer.port,
			getOutboundIP(),
			startableServer.port,
		)

		httpSrv := &http.Server{Addr: ":" + strconv.Itoa(startableServer.port)}
		http.Handle("/", router)
		log.Fatal(httpSrv.ListenAndServe())

		return func() {
			httpSrv.Shutdown(context.TODO())
		}
	}

	return startable, nil
}

func getOutboundIP() net.IP {
	conn, err := net.Dial("udp", "8.8.8.8:80")
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	localAddr := conn.LocalAddr().(*net.UDPAddr)

	return localAddr.IP
}
