import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

@Component({
  selector: 'app-dropdown-menu',
  templateUrl: './dropdown-menu.component.html',
})
export class DropdownMenuComponent implements OnInit {
  isExpanded = false;

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    if (this.isExpanded && !this.el.nativeElement.contains(event.target)) {
      this.isExpanded = false;
    }
  }

  constructor(private router: Router, private el: ElementRef) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isExpanded = false;
      }
    });
  }

  toggleDropdown() {
    this.isExpanded = !this.isExpanded;
  }
}
