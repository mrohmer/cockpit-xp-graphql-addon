package server

import (
	"errors"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi"
	"github.com/gorilla/websocket"
	"github.com/rs/cors"
	"log"
	"net/http"
	"rohmer.rocks/server/internal/pkg/graph"
	"rohmer.rocks/server/internal/pkg/graph/generated"
	"strconv"
)

type Server struct {
	port           int
	resolver       *graph.Resolver
	allowedOrigins []string
	debug          bool
}

func NewServer(port int) *Server {
	return &Server{port: port}
}
func (s *Server) SetResolver(resolver *graph.Resolver) *Server {
	s.resolver = resolver
	return s
}
func (s *Server) AddAllowedOrigin(origin string) *Server {
	s.allowedOrigins = append(s.allowedOrigins, origin)
	return s
}
func (s *Server) DebugMode(debug bool) {
	s.debug = debug
}
func (s *Server) Start() error {
	if s.port == 0 {
		return errors.New("port not set")
	}
	if s.resolver == nil {
		return errors.New("resolver not set")
	}

	router := chi.NewRouter()

	if len(s.allowedOrigins) > 0 {
		// Add CORS middleware around every request
		// See https://github.com/rs/cors for full option listing
		router.Use(cors.New(cors.Options{
			AllowedOrigins:   s.allowedOrigins,
			AllowCredentials: true,
			Debug:            s.debug,
		}).Handler)
	}

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: s.resolver}))
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

	router.Handle("/", playground.Handler("GraphQL playground", "/query"))
	router.Handle("/query", srv)

	log.Printf("connect to http://localhost:%d/ for GraphQL playground", s.port)
	log.Fatal(http.ListenAndServe(":"+strconv.Itoa(s.port), router))

	return nil
}
