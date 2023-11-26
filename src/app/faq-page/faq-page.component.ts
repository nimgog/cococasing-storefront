import { Component, OnInit } from '@angular/core';
import { Section } from './section';
import { faqs } from './faqs';
import { DeviceDetectorService } from '../services/device-detector.service';
import { Scenario } from './scenario';

@Component({
  selector: 'app-faq-page',
  templateUrl: './faq-page.component.html',
})
export class FaqPageComponent implements OnInit {
  sections: Section[] = faqs;
  sectionExpandedStates!: Map<Section, boolean>;
  scenarioExpandedStates!: Map<Scenario, boolean>;
  isMobile!: boolean;

  constructor(private readonly deviceDetectorService: DeviceDetectorService) {}

  ngOnInit() {
    this.isMobile = this.deviceDetectorService.isMobile();

    this.sectionExpandedStates = new Map(
      this.sections.map((section) => [section, !this.isMobile])
    );

    this.scenarioExpandedStates = new Map(
      this.sections.flatMap((section) =>
        section.topics.flatMap((topic) =>
          topic.scenarios.map((scenario) => [scenario, !this.isMobile])
        )
      )
    );
  }

  isSectionExpanded(section: Section) {
    return this.sectionExpandedStates.get(section);
  }

  toggleSection(section: Section) {
    if (!this.isMobile) {
      return;
    }

    const isExpanded = this.sectionExpandedStates.get(section);
    this.sectionExpandedStates.set(section, !isExpanded);
  }

  isScenarioExpanded(scenario: Scenario) {
    return this.scenarioExpandedStates.get(scenario);
  }

  toggleScenario(scenario: Scenario) {
    const isExpanded = this.scenarioExpandedStates.get(scenario);
    this.scenarioExpandedStates.set(scenario, !isExpanded);
  }
}
