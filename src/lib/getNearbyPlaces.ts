export function getNearbyPlaces(
  map: google.maps.Map,
  input: string
): Promise<google.maps.places.PlaceResult[]> {
  const service = new google.maps.places.PlacesService(map)

  return new Promise((resolve, reject) => {
    const request: google.maps.places.TextSearchRequest = {
      query: input, // e.g., "temples in Pune"
    }

    service.textSearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        resolve(results)
      } else {
        reject(status)
      }
    })
  })
}
