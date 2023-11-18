import { Component } from '@angular/core';

@Component({
  selector: 'app-insta-gallery',
  templateUrl: './insta-gallery.component.html',
})
export class InstaGalleryComponent {
  instaGalleryImages: { src: string; alt: string }[] = [...Array(9)].map(
    (_, i) => ({
      src: `/assets/img/home-page/insta-gallery/ig-${i + 1}.png`,
      alt: `Instagram image #${i + 1}`,
    })
  );
}
