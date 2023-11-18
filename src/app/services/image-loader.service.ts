import { Injectable } from '@angular/core';
import { concatMap, defer, forkJoin, from, fromEvent, race, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageLoaderService {
  loadImagesInPriorityOrder(imageUrlPriorityGroups: string[][]) {
    return from(imageUrlPriorityGroups).pipe(
      concatMap((imageUrls) =>
        forkJoin(imageUrls.map((url) => this.loadImage(url)))
      )
    );
  }

  private loadImage(url: string) {
    return defer(() => {
      const image = new Image();

      const imageLoadComplete$ = fromEvent(image, 'load').pipe(take(1));
      const imageLoadError$ = fromEvent(image, 'error').pipe(take(1));

      image.src = url;

      return race(imageLoadComplete$, imageLoadError$);
    });
  }
}
