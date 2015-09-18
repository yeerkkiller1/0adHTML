package main

import (
  "fmt"
  "net/http"
  "flag"
  "strconv"
)

func main() {
  port := flag.Int("port", 7070, "The port the server will listen on.")
  flag.Parse()

  fmt.Println("Listening on port", *port)

  fs := http.FileServer(http.Dir("./"))
  http.Handle("/", fs)

  err := http.ListenAndServe(":" + strconv.Itoa(*port), nil)
  if err != nil {
    fmt.Printf("error: %s\n", err)
  }
}
