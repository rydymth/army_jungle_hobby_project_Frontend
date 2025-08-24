import { Injectable } from '@angular/core';

export interface coords
{
  lat: number;
  lng: number;
}

export class polygon {
  coords: coords[] = []
}

// Original unfiltered function
// Returns true if it is inside and false if it is outside
// export function rayCaster(point: coords, poly: polygon)
// {
//   console.log(poly.coords.length)
//   let len = poly.coords.length;
//   // Init 0 count
//   let count = 0
  
//   // Now we iterate through all the points one by one
//   // Better to do this than any other high order func like map/foreach/etc...
//   for (let i =0; i < len; i++)
//   {
//     let p1 = poly.coords[i];
//     let p2 = poly.coords[(i+1)%len]; // Escape the out of bounds exception with this
    
//     /* Check if the point lies to the left of our given
//      line(since we are taking 2 points, i.e. a line into
//      consideration). If it does, count++
//     */
    
//     //  For real i have to declare a func max/min? wth smh
//     function max(p1: number, p2: number) { return p1 > p2 ? p1 : p2} 
//     function min(p1: number, p2: number) { return p1 < p2 ? p1 : p2} 
    
//      // Checks:
//      // 1. It lies within the bounds of our line
//      // 2. It lies to the left, i.e. less than the max X of our point
//      if (
//       point.lng < max(p1.lng, p2.lng) &&
//       point.lng > min(p1.lng, p2.lng) &&
//       point.lat < max(p1.lat, p2.lat)
//      )
//      {
//        // Simple slope calculation
//        let xInt: number = (((p1.lat - p2.lat)*(p1.lng - point.lng))/(p1.lng - p2.lng)) + point.lat
       
//        // inc count
//        if (point.lat <= xInt) count++;
//      }
//   }
 
//   // If count is even it is out of polygon
//   // else it is inside
//   return !(count % 2 == 0);
// }

export function rayCaster(point: coords, poly: coords[]): boolean {
  let inside = false;
  const len = poly.length;

  for (let i = 0, j = len - 1; i < len; j = i++) {
    const xi = poly[i].lng, yi = poly[i].lat;
    const xj = poly[j].lng, yj = poly[j].lat;

    // Check if point is between the y bounds of the edge
    const intersect = ((yi > point.lat) !== (yj > point.lat)) &&
      (point.lng < (xj - xi) * (point.lat - yi) / (yj - yi) + xi);

    if (intersect) inside = !inside;
  }

  return inside;
}


// Not really required but we will see
@Injectable({
  providedIn: 'root'
})
export class RayCasterTs {
  
}
