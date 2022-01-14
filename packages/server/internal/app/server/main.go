package server

import (
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
func (s *Server) Start() error {
	if s.port == 0 {
		return errors.New("port not set")
	}
	if s.resolver == nil {
		return errors.New("resolver not set")
	}

	router := chi.NewRouter()

	router.Use(cors.New(cors.Options{
		Debug: s.debug,
	}).Handler)

	srv := handler.New(generated.NewExecutableSchema(generated.Config{Resolvers: s.resolver}))
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

	log.Printf("go to http://localhost:%d/playground for GraphQL playground\n\nopen http://%s:%d on any device in your network to view the ui\n\n", s.port, getOutboundIP(), s.port)
	log.Fatal(http.ListenAndServe(":"+strconv.Itoa(s.port), router))

	return nil
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
