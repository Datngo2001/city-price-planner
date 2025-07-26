package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

type Message struct {
	Status  string `json:"status"`
	Message string `json:"message"`
}

func HomeHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(Message{Status: "success", Message: "Welcome to the City Price Planner API!"})
}

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/", HomeHandler).Methods("GET")

	log.Println("API server running on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", r))
}
