import type { OnInit } from '@angular/core';
import { Component, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NavigationStart } from '@angular/router';

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
