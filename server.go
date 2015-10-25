package main

import (
  "fmt"
  "net/http"
  "flag"
  "strconv"
  "bytes"
  "io/ioutil"
)

func setupFileserver(port int) {
	fs := http.FileServer(http.Dir("./"))
	http.Handle("/", fs)

	fmt.Println("Listening on port", port)
	err := http.ListenAndServe(":" + strconv.Itoa(port), nil)
	if err != nil {
		fmt.Errorf("error: %s\n", err)
	}
}
func serveProxyRequest(rw http.ResponseWriter, req *http.Request) {
	path := "https://0ad.firebaseio.com/" + req.URL.Path[1:]
	fmt.Println("Got request for:", path)
	body, err := ioutil.ReadAll(req.Body)
	if err != nil { panic(err) }
	// TODO: If we close rw here, we should reply faster?

	req2, err := http.NewRequest(req.Method, path, bytes.NewBuffer(body))
	if err != nil { panic(err) }
	resp, err := (&http.Client{}).Do(req2)
	if err != nil { panic(err) }
	defer resp.Body.Close()

	//fmt.Println("response Status:", resp.Status)
	//fmt.Println("response Headers:", resp.Header)
	body2, err := ioutil.ReadAll(resp.Body)
	if err != nil { panic(err) }
	fmt.Println("Firebase responds:", string(body2))
}

func setupProxyserver(port int) {
	fmt.Println("Proxy server listening on port", port)
	handler := http.HandlerFunc(serveProxyRequest)
	err := http.ListenAndServe(":" + strconv.Itoa(port), handler)
	if err != nil {
		fmt.Errorf("proxy error: %s\n", err)
	}
}
func main() {
	port := flag.Int("port", 7070, "The port the server will listen on.")
	flag.Parse()

	go setupProxyserver(2500)
	setupFileserver(*port)
}
